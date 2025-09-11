'use client';

import { motion } from 'framer-motion';

interface GalleryImageSkeletonProps {
  className?: string;
}

export function GalleryImageSkeleton({ className = '' }: GalleryImageSkeletonProps) {
  // Random height for masonry effect
  const heights = ['h-48', 'h-56', 'h-64', 'h-72'];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];

  return (
    <motion.div
      className={`gallery-image-skeleton ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative overflow-hidden rounded-lg bg-gray-200 ${randomHeight}`}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Content placeholders */}
        <div className="absolute bottom-4 left-4 right-4">
          {/* Category badge skeleton */}
          <div className="w-16 h-5 bg-gray-300 rounded-full mb-2" />
          
          {/* Caption skeleton */}
          <div className="space-y-1">
            <div className="w-3/4 h-3 bg-gray-300 rounded" />
            <div className="w-1/2 h-3 bg-gray-300 rounded" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// Add shimmer keyframe to global CSS
export const shimmerKeyframes = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;