'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenReader, useKeyboardNavigation, useReducedMotion } from '@/hooks/useAccessibility';
import { galleryImages, galleryCategories, getImagesByCategory, type GalleryCategory, type GalleryImage } from '@/config/gallery';
import { GalleryGrid } from './GalleryGrid';
import { GalleryFilter } from './GalleryFilter';
import { Lightbox } from './Lightbox';
import { useLightbox } from '@/hooks/useLightbox';

interface GalleryProps {
  className?: string;
  showFilter?: boolean;
  initialCategory?: GalleryCategory;
  maxImages?: number;
}

export function Gallery({ 
  className = '', 
  showFilter = true, 
  initialCategory = 'All',
  maxImages 
}: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>(initialCategory);
  const [isLoading, setIsLoading] = useState(false);
  const lightbox = useLightbox();
  
  // Accessibility hooks
  const { announce } = useScreenReader();
  const { prefersReducedMotion, safeAnimation } = useReducedMotion();

  // Get filtered images
  const filteredImages = useMemo(() => {
    const images = getImagesByCategory(activeCategory);
    return maxImages ? images.slice(0, maxImages) : images;
  }, [activeCategory, maxImages]);

  // Handle category change with loading state
  const handleCategoryChange = async (category: GalleryCategory) => {
    if (category === activeCategory) return;
    
    setIsLoading(true);
    announce(`Loading ${category} images`, 'polite');
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setActiveCategory(category);
    setIsLoading(false);
    
    // Announce results
    const count = getImagesByCategory(category).length;
    announce(`Showing ${count} ${category} images`, 'polite');
  };

  // Handle image click to open lightbox
  const handleImageClick = (image: GalleryImage, index: number) => {
    lightbox.openLightbox(filteredImages, index);
  };

  return (
    <div className={`gallery-container ${className}`}>
      {showFilter && (
        <div className="mb-8">
          <GalleryFilter
            categories={galleryCategories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            isLoading={isLoading}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={safeAnimation({ opacity: 0, y: 20 }, { opacity: 1 })}
          animate={{ opacity: 1, y: 0 }}
          exit={safeAnimation({ opacity: 0, y: -20 }, { opacity: 1 })}
          transition={safeAnimation({ duration: 0.3, ease: 'easeInOut' }, { duration: 0 })}
          role="region"
          aria-label={`${activeCategory} gallery images`}
          aria-live="polite"
        >
          <GalleryGrid 
            images={filteredImages}
            isLoading={isLoading}
            onImageClick={handleImageClick}
          />
        </motion.div>
      </AnimatePresence>

      {/* Results count */}
      <motion.div 
        className="mt-6 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Showing {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
        {activeCategory !== 'All' && (
          <span className="ml-1">in {activeCategory}</span>
        )}

      {/* Lightbox */}
      <Lightbox
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        onNext={lightbox.nextImage}
        onPrevious={lightbox.previousImage}
      />
      </motion.div>
    </div>
  );
}