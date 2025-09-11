/**
 * Performance optimization utilities
 */

import { lazy, ComponentType } from 'react';

// Lazy loading utilities
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) => {
  const LazyComponent = lazy(importFn);
  
  if (fallback) {
    LazyComponent.displayName = `Lazy(${fallback.displayName || fallback.name || 'Component'})`;
  }
  
  return LazyComponent;
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
};

// Prefetch resources
export const prefetchResource = (href: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
};

// Image optimization utilities
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  width?: number,
  height?: number
) => ({
  src,
  alt,
  width,
  height,
  loading: 'lazy' as const,
  decoding: 'async' as const,
  sizes: width 
    ? `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${width}px`
    : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
});

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return fn();
  }

  const startTime = performance.now();
  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      const endTime = performance.now();
      console.log(`${name} took ${endTime - startTime} milliseconds`);
    });
  } else {
    const endTime = performance.now();
    console.log(`${name} took ${endTime - startTime} milliseconds`);
    return result;
  }
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track CLS (Cumulative Layout Shift)
  let clsValue = 0;
  let clsEntries: LayoutShift[] = [];

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        clsEntries.push(entry as any);
      }
    }
  });

  if ('PerformanceObserver' in window) {
    observer.observe({ type: 'layout-shift', buffered: true });
  }

  // Track LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  });

  if ('PerformanceObserver' in window) {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  // Track FID (First Input Delay)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('FID:', (entry as any).processingStart - entry.startTime);
    }
  });

  if ('PerformanceObserver' in window) {
    fidObserver.observe({ type: 'first-input', buffered: true });
  }

  return {
    getCLS: () => clsValue,
    getEntries: () => clsEntries,
  };
};

// Resource hints
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://checkout.razorpay.com',
    'https://www.paypal.com',
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Bundle splitting utilities
export const loadChunk = async (chunkName: string) => {
  try {
    const module = await import(/* webpackChunkName: "[request]" */ `../components/${chunkName}`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load chunk: ${chunkName}`, error);
    throw error;
  }
};

// Memory management
export const cleanupResources = (cleanup: () => void) => {
  if (typeof window === 'undefined') return;

  const handleBeforeUnload = () => {
    cleanup();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

// Cache cleanup utilities
export const setupCacheCleanup = () => {
  if (typeof window === 'undefined') return;

  const cleanupInterval = setInterval(() => {
    // Clean up expired cache entries
    try {
      const now = Date.now();
      
      // Clean localStorage cache
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              if (parsed.expiry && parsed.expiry < now) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // Remove invalid cache entries
            localStorage.removeItem(key);
          }
        }
      }

      // Clean sessionStorage cache
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('cache_')) {
          try {
            const item = sessionStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              if (parsed.expiry && parsed.expiry < now) {
                sessionStorage.removeItem(key);
              }
            }
          } catch (error) {
            // Remove invalid cache entries
            sessionStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }, 5 * 60 * 1000); // Run every 5 minutes

  // Cleanup on page unload
  const handleBeforeUnload = () => {
    clearInterval(cleanupInterval);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return cleanup function
  return () => {
    clearInterval(cleanupInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};