/**
 * Optimized Image component with lazy loading and performance features
 */

'use client';

import Image from 'next/image';
import { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useLazyImage } from '@/hooks/useLazyLoading';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    quality = 85,
    placeholder = 'empty',
    blurDataURL,
    sizes,
    fill = false,
    loading = 'lazy',
    onLoad,
    onError,
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Use lazy loading for non-priority images
    const { elementRef, isVisible } = useLazyImage(src, {
      threshold: 0.1,
      rootMargin: '50px',
      triggerOnce: true,
    });

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    // Generate optimized sizes if not provided
    const optimizedSizes = sizes || (
      fill 
        ? '100vw'
        : width 
          ? `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${width}px`
          : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    );

    // Don't render until visible (unless priority)
    if (!priority && !isVisible) {
      return (
        <div
          ref={elementRef}
          className={cn(
            'bg-gray-200 animate-pulse',
            fill ? 'absolute inset-0' : '',
            className
          )}
          style={!fill ? { width, height } : undefined}
          aria-label={`Loading ${alt}`}
        />
      );
    }

    if (hasError) {
      return (
        <div
          className={cn(
            'bg-gray-200 flex items-center justify-center text-gray-500 text-sm',
            fill ? 'absolute inset-0' : '',
            className
          )}
          style={!fill ? { width, height } : undefined}
        >
          Failed to load image
        </div>
      );
    }

    return (
      <div className={cn('relative', fill ? 'w-full h-full' : '', className)}>
        <Image
          ref={ref}
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={optimizedSizes}
          loading={priority ? 'eager' : loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            fill ? 'object-cover' : ''
          )}
          {...props}
        />
        
        {isLoading && (
          <div
            className={cn(
              'absolute inset-0 bg-gray-200 animate-pulse',
              'flex items-center justify-center'
            )}
          >
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;