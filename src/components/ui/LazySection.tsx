/**
 * Lazy loading wrapper for sections and components
 */

'use client';

import { Suspense, ReactNode } from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  minHeight?: string | number;
  skeleton?: ReactNode;
}

const DefaultSkeleton = ({ minHeight }: { minHeight?: string | number }) => (
  <div 
    className="animate-pulse bg-gray-200 rounded-lg"
    style={{ minHeight: minHeight || '200px' }}
  >
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);

export default function LazySection({
  children,
  fallback,
  className,
  threshold = 0.1,
  rootMargin = '100px',
  minHeight,
  skeleton,
}: LazySectionProps) {
  const { elementRef, isVisible } = useLazyLoading({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const renderFallback = () => {
    if (skeleton) return skeleton;
    if (fallback) return fallback;
    return <DefaultSkeleton minHeight={minHeight} />;
  };

  return (
    <div ref={elementRef} className={cn('w-full', className)}>
      {isVisible ? (
        <Suspense fallback={renderFallback()}>
          {children}
        </Suspense>
      ) : (
        renderFallback()
      )}
    </div>
  );
}