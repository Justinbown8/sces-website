'use client';

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'image' | 'button' | 'avatar' | 'custom';
  lines?: number;
  width?: string;
  height?: string;
  animate?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'text',
  lines = 1,
  width,
  height,
  animate = true
}) => {
  const baseClasses = `bg-gray-200 ${animate ? 'animate-pulse' : ''} ${className}`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'card':
        return 'h-48 rounded-lg';
      case 'image':
        return 'aspect-video rounded-lg';
      case 'button':
        return 'h-10 rounded-md';
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'custom':
        return 'rounded';
      default:
        return 'h-4 rounded';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || undefined,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()}`}
      style={style}
    />
  );
};

// Predefined skeleton components for common use cases
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => (
  <LoadingSkeleton variant="text" lines={lines} className={className} />
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`p-6 border border-gray-200 rounded-lg ${className}`}>
    <LoadingSkeleton variant="image" className="mb-4" />
    <LoadingSkeleton variant="text" className="mb-2 h-6" width="60%" />
    <LoadingSkeleton variant="text" lines={2} className="mb-4" />
    <LoadingSkeleton variant="button" width="120px" />
  </div>
);

export const GallerySkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 6, 
  className 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <LoadingSkeleton key={index} variant="image" />
    ))}
  </div>
);

export const BlogSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-6">
        <LoadingSkeleton variant="image" className="mb-4" height="200px" />
        <LoadingSkeleton variant="text" className="mb-2 h-6" width="80%" />
        <LoadingSkeleton variant="text" lines={2} className="mb-4" />
        <div className="flex items-center space-x-4">
          <LoadingSkeleton variant="avatar" />
          <div className="flex-1">
            <LoadingSkeleton variant="text" width="120px" className="mb-1" />
            <LoadingSkeleton variant="text" width="80px" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const StaffSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 4, 
  className 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="text-center">
        <LoadingSkeleton variant="image" className="mb-4 aspect-square rounded-full mx-auto" width="150px" height="150px" />
        <LoadingSkeleton variant="text" className="mb-2 h-6" width="80%" />
        <LoadingSkeleton variant="text" className="mb-4" width="60%" />
        <LoadingSkeleton variant="text" lines={3} />
      </div>
    ))}
  </div>
);

export const FormSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`space-y-6 ${className}`}>
    <div>
      <LoadingSkeleton variant="text" width="120px" className="mb-2" />
      <LoadingSkeleton variant="button" height="40px" />
    </div>
    <div>
      <LoadingSkeleton variant="text" width="100px" className="mb-2" />
      <LoadingSkeleton variant="button" height="40px" />
    </div>
    <div>
      <LoadingSkeleton variant="text" width="140px" className="mb-2" />
      <LoadingSkeleton variant="button" height="100px" />
    </div>
    <LoadingSkeleton variant="button" width="120px" height="44px" />
  </div>
);

export default LoadingSkeleton;