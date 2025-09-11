'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { type GalleryCategory } from '@/config/gallery';

interface GalleryFilterProps {
  categories: readonly GalleryCategory[];
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
  isLoading?: boolean;
}

export function GalleryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  isLoading = false 
}: GalleryFilterProps) {
  return (
    <div className="gallery-filter">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {categories.map((category, index) => {
          const isActive = category === activeCategory;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: 'easeOut'
              }}
            >
              <Button
                variant={isActive ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category)}
                disabled={isLoading}
                className={`
                  relative transition-all duration-300 ease-in-out
                  ${isActive 
                    ? 'shadow-lg scale-105' 
                    : 'hover:scale-105 hover:shadow-md'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg opacity-20"
                    layoutId="activeFilter"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10">
                  {category}
                </span>
                
                {/* Loading spinner */}
                {isLoading && isActive && (
                  <motion.div
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
      
      {/* Filter description */}
      <motion.p 
        className="text-center text-sm text-gray-600 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {getFilterDescription(activeCategory)}
      </motion.p>
    </div>
  );
}

function getFilterDescription(category: GalleryCategory): string {
  switch (category) {
    case 'All':
      return 'Browse all our memorable moments and activities';
    case 'Events':
      return 'Special celebrations and community gatherings';
    case 'Classrooms':
      return 'Learning environments and educational activities';
    case 'Field Visits':
      return 'Educational trips and outdoor learning experiences';
    default:
      return '';
  }
}