/**
 * Performance Provider - Sets up performance monitoring and optimizations
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { addResourceHints, trackWebVitals, setupCacheCleanup } from '@/lib/performance';
import { preloadCache } from '@/lib/cache';

interface PerformanceProviderProps {
  children: ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Add resource hints for external domains
    addResourceHints();

    // Set up Web Vitals tracking
    const vitalsTracker = trackWebVitals();

    // Set up cache cleanup
    const cacheCleanup = setupCacheCleanup();

    // Preload critical resources
    preloadCache([
      {
        key: 'site-config',
        fetcher: () => import('@/config/site').then(m => m.siteConfig),
        options: { storage: 'memory', ttl: 30 * 60 * 1000 }, // 30 minutes
      },
      {
        key: 'testimonials',
        fetcher: () => import('@/config/testimonials').then(m => m.testimonials),
        options: { storage: 'local', ttl: 60 * 60 * 1000 }, // 1 hour
      },
    ]);

    // Performance monitoring
    if (process.env.NODE_ENV === 'development') {
      // Monitor performance in development
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation timing:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            });
          }
        }
      });

      if ('PerformanceObserver' in window) {
        observer.observe({ type: 'navigation', buffered: true });
      }
    }

    // Cleanup function
    return () => {
      cacheCleanup?.();
    };
  }, []);

  return <>{children}</>;
}