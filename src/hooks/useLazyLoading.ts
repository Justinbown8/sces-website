/**
 * Hook for lazy loading components and resources
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createIntersectionObserver } from '@/lib/performance';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useLazyLoading = (options: UseLazyLoadingOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce && observerRef.current) {
          observerRef.current.unobserve(element);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    };

    observerRef.current = createIntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    if (observerRef.current) {
      observerRef.current.observe(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      setIsVisible(true);
    }

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  const markAsLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    elementRef,
    isVisible,
    isLoaded,
    markAsLoaded,
  };
};

// Hook for lazy loading images
export const useLazyImage = (src: string, options: UseLazyLoadingOptions = {}) => {
  const { elementRef, isVisible, isLoaded, markAsLoaded } = useLazyLoading(options);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible || isLoaded) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      markAsLoaded();
    };
    img.onerror = () => {
      setError(true);
      markAsLoaded();
    };
    img.src = src;
  }, [isVisible, isLoaded, src, markAsLoaded]);

  return {
    elementRef,
    imageSrc,
    isLoaded,
    error,
    isVisible,
  };
};

// Hook for lazy loading components
export const useLazyComponent = <T>(
  importFn: () => Promise<{ default: T }>,
  options: UseLazyLoadingOptions = {}
) => {
  const { elementRef, isVisible } = useLazyLoading(options);
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isVisible || Component) return;

    setLoading(true);
    importFn()
      .then((module) => {
        setComponent(module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [isVisible, Component, importFn]);

  return {
    elementRef,
    Component,
    loading,
    error,
    isVisible,
  };
};