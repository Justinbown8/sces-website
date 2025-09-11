'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GalleryImage } from '@/config/gallery';
import { GalleryImageCard } from './GalleryImageCard';
import { GalleryImageSkeleton } from './GalleryImageSkeleton';

interface GalleryGridProps {
  images: GalleryImage[];
  isLoading?: boolean;
  onImageClick?: (image: GalleryImage, index: number) => void;
}

export function GalleryGrid({ images, isLoading = false, onImageClick }: GalleryGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  // Handle image load
  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  }, []);

  // Handle image click
  const handleImageClick = useCallback((image: GalleryImage, index: number) => {
    onImageClick?.(image, index);
  }, [onImageClick]);

  if (isLoading) {
    return (
      <div className="gallery-grid-loading">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <GalleryImageSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-gray-700 text-lg mb-2">No images found</div>
        <p className="text-gray-600 text-sm">
          Try selecting a different category to see more images.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="gallery-grid" ref={gridRef}>
      {/* Masonry Grid Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="break-inside-avoid mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              ease: 'easeOut'
            }}
            layout
          >
            <GalleryImageCard
              image={image}
              index={index}
              isLoaded={loadedImages.has(image.id)}
              onLoad={() => handleImageLoad(image.id)}
              onClick={() => handleImageClick(image, index)}
            />
          </motion.div>
        ))}
      </div>

      {/* Alternative Grid Layout (commented out, can be used instead of masonry) */}
      {/* 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: 'easeOut'
            }}
            layout
          >
            <GalleryImageCard
              image={image}
              index={index}
              isLoaded={loadedImages.has(image.id)}
              onLoad={() => handleImageLoad(image.id)}
              onClick={() => handleImageClick(image, index)}
            />
          </motion.div>
        ))}
      </div>
      */}
    </div>
  );
}