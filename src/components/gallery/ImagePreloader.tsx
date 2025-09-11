'use client';

import { useEffect, useState } from 'react';
import { GalleryImage } from '@/config/gallery';
import { getOptimizedImageUrl } from '@/lib/image-utils';

interface ImagePreloaderProps {
  images: GalleryImage[];
  currentIndex: number;
  preloadCount?: number;
  onPreloadComplete?: (loadedCount: number, totalCount: number) => void;
}

export function ImagePreloader({ 
  images, 
  currentIndex, 
  preloadCount = 2,
  onPreloadComplete
}: ImagePreloaderProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (images.length === 0) return;

    // Determine which images to preload
    const imagesToPreload: GalleryImage[] = [];
    
    // Always include current image
    if (images[currentIndex]) {
      imagesToPreload.push(images[currentIndex]);
    }
    
    // Add surrounding images
    for (let i = 1; i <= preloadCount; i++) {
      // Next images
      const nextIndex = (currentIndex + i) % images.length;
      if (nextIndex !== currentIndex && images[nextIndex]) {
        imagesToPreload.push(images[nextIndex]);
      }
      
      // Previous images
      const prevIndex = (currentIndex - i + images.length) % images.length;
      if (prevIndex !== currentIndex && images[prevIndex]) {
        imagesToPreload.push(images[prevIndex]);
      }
    }

    // Remove duplicates
    const uniqueImages = imagesToPreload.filter((image, index, self) => 
      self.findIndex(img => img.id === image.id) === index
    );

    let loadedCount = 0;
    const totalCount = uniqueImages.length;

    // Preload each image
    uniqueImages.forEach(image => {
      const imageUrl = getOptimizedImageUrl(image.filename);
      
      // Skip if already loaded
      if (loadedImages.has(imageUrl)) {
        loadedCount++;
        if (loadedCount === totalCount) {
          onPreloadComplete?.(loadedCount, totalCount);
        }
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(imageUrl));
        loadedCount++;
        if (loadedCount === totalCount) {
          onPreloadComplete?.(loadedCount, totalCount);
        }
      };
      
      img.onerror = () => {
        console.warn(`Failed to preload image: ${imageUrl}`);
        loadedCount++;
        if (loadedCount === totalCount) {
          onPreloadComplete?.(loadedCount, totalCount);
        }
      };
      
      img.src = imageUrl;
    });
  }, [images, currentIndex, preloadCount, loadedImages, onPreloadComplete]);

  return null; // This component doesn't render anything
}

// Utility function to preload a single image
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Utility function to preload multiple images
export const preloadImages = async (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage));
};