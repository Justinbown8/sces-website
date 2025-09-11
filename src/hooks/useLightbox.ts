'use client';

import { useState, useCallback } from 'react';
import { GalleryImage } from '@/config/gallery';

interface UseLightboxReturn {
  isOpen: boolean;
  currentIndex: number;
  currentImage: GalleryImage | null;
  openLightbox: (images: GalleryImage[], index: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  previousImage: () => void;
  goToImage: (index: number) => void;
  images: GalleryImage[];
}

export function useLightbox(): UseLightboxReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const openLightbox = useCallback((imageList: GalleryImage[], index: number) => {
    setImages(imageList);
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    // Small delay to allow animation to complete
    setTimeout(() => {
      setImages([]);
      setCurrentIndex(0);
    }, 200);
  }, []);

  const nextImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  const currentImage = images[currentIndex] || null;

  return {
    isOpen,
    currentIndex,
    currentImage,
    openLightbox,
    closeLightbox,
    nextImage,
    previousImage,
    goToImage,
    images
  };
}