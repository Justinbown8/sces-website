/**
 * Performance monitoring component for Core Web Vitals and custom metrics
 */

'use client';

import { useEffect, useRef } from 'react';
import { trackPerformance, trackError } from '@/lib/analytics';

interface PerformanceEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export default function PerformanceMonitor() {
  const metricsReported = useRef(new Set<string>());

  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

        // Cumulative Layout Shift
        getCLS((metric) => {
          if (!metricsReported.current.has('CLS')) {
            trackPerformance('CLS', metric.value * 1000, 'score'); // Convert to score
            metricsReported.current.add('CLS');
          }
        });

        // First Input Delay
        getFID((metric) => {
          if (!metricsReported.current.has('FID')) {
            trackPerformance('FID', metric.value, 'ms');
            metricsReported.current.add('FID');
          }
        });

        // First Contentful Paint
        getFCP((metric) => {
          if (!metricsReported.current.has('FCP')) {
            trackPerformance('FCP', metric.value, 'ms');
            metricsReported.current.add('FCP');
          }
        });

        // Largest Contentful Paint
        getLCP((metric) => {
          if (!metricsReported.current.has('LCP')) {
            trackPerformance('LCP', metric.value, 'ms');
            metricsReported.current.add('LCP');
          }
        });

        // Time to First Byte
        getTTFB((metric) => {
          if (!metricsReported.current.has('TTFB')) {
            trackPerformance('TTFB', metric.value, 'ms');
            metricsReported.current.add('TTFB');
          }
        });
      } catch (error) {
        console.warn('Failed to load web-vitals library:', error);
      }
    };

    // Track custom performance metrics
    const trackCustomMetrics = () => {
      if (typeof window === 'undefined' || !('performance' in window)) return;

      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        const loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
        
        trackPerformance('DOM_Content_Loaded', domContentLoaded, 'ms');
        trackPerformance('Load_Complete', loadComplete, 'ms');
      }

      // Resource timing for critical resources
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      resources.forEach((resource) => {
        if (resource.name.includes('fonts.googleapis.com') || 
            resource.name.includes('fonts.gstatic.com')) {
          trackPerformance('Font_Load_Time', resource.responseEnd - resource.startTime, 'ms');
        }
      });
    };

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        trackPerformance('JS_Heap_Used', memory.usedJSHeapSize / 1024 / 1024, 'MB');
        trackPerformance('JS_Heap_Total', memory.totalJSHeapSize / 1024 / 1024, 'MB');
      }
    };

    // Track connection information
    const trackConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          trackPerformance('Connection_Downlink', connection.downlink, 'Mbps');
          trackPerformance('Connection_RTT', connection.rtt, 'ms');
        }
      }
    };

    // Initialize tracking
    trackWebVitals();
    
    // Track custom metrics after page load
    if (document.readyState === 'complete') {
      trackCustomMetrics();
      trackMemoryUsage();
      trackConnection();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          trackCustomMetrics();
          trackMemoryUsage();
          trackConnection();
        }, 1000); // Wait 1 second after load
      });
    }

    // Track long tasks (performance issues)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              trackPerformance('Long_Task', entry.duration, 'ms');
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });

        // Track layout shifts
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput) {
              trackPerformance('Layout_Shift', layoutShift.value * 1000, 'score');
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }

    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      trackError(
        event.message || 'Unknown error',
        event.filename || 'unknown',
        'high'
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(
        event.reason?.message || 'Unhandled promise rejection',
        'promise',
        'medium'
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}