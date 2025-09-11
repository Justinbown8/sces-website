'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
import { GalleryImage } from '@/config/gallery';
import { getOptimizedImageUrl, getImageAlt } from '@/lib/image-utils';

interface GalleryImageCardProps {
  image: GalleryImage;
  index: number;
  isLoaded?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
}

export function GalleryImageCard({ 
  image, 
  index, 
  isLoaded = false, 
  onLoad, 
  onClick 
}: GalleryImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <motion.div
      className="gallery-image-card group relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative aspect-auto">
        {!imageError ? (
          <Image
            src={getOptimizedImageUrl(image.filename)}
            alt={getImageAlt(image)}
            width={400}
            height={300}
            className={`
              w-full h-auto object-cover transition-all duration-300
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
            <div className="text-gray-600 text-sm text-center p-4">
              <div className="mb-2">Image not available</div>
              <div className="text-xs">{image.filename}</div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {!isLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Content overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: isHovered ? 0 : 20, 
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Category badge */}
        <div className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-2">
          {image.category}
        </div>

        {/* Caption */}
        {image.caption && (
          <p className="text-sm font-medium leading-tight line-clamp-2">
            {image.caption}
          </p>
        )}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="absolute top-3 right-3 flex gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8
        }}
        transition={{ duration: 0.2 }}
      >
        <button
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle view action
          }}
          aria-label="View image"
        >
          <Eye size={16} />
        </button>
        
        {image.featured && (
          <button
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite action
            }}
            aria-label="Featured image"
          >
            <Heart size={16} className="fill-current" />
          </button>
        )}
      </motion.div>

      {/* Featured indicator */}
      {image.featured && (
        <div className="absolute top-3 left-3">
          <div className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
            Featured
          </div>
        </div>
      )}
    </motion.div>
  );
}