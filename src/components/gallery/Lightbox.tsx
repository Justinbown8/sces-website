'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info
} from 'lucide-react';
import { GalleryImage } from '@/config/gallery';
import { getOptimizedImageUrl, getImageAlt } from '@/lib/image-utils';
import { ImagePreloader } from './ImagePreloader';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Lightbox({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious 
}: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [announceText, setAnnounceText] = useState('');
  
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const currentImage = images[currentIndex];

  // Zoom and pan handlers
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.5, 5);
    setZoom(newZoom);
    setAnnounceText(`Zoomed in to ${Math.round(newZoom * 100)}%`);
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.5, 0.5);
    setZoom(newZoom);
    setAnnounceText(`Zoomed out to ${Math.round(newZoom * 100)}%`);
  }, [zoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setAnnounceText('Zoom reset to 100%');
  }, []);

  const handleRotate = useCallback(() => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    setAnnounceText(`Image rotated to ${newRotation} degrees`);
  }, [rotation]);

  // Reset image state when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsLoading(true);
    setShowInfo(false);
    
    // Announce image change to screen readers
    if (currentImage) {
      setAnnounceText(`Image ${currentIndex + 1} of ${images.length}: ${currentImage.alt}`);
    }
  }, [currentIndex, currentImage, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setShowInfo(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, handleZoomIn, handleZoomOut, resetZoom, handleRotate]);

  // Prevent body scroll and manage focus when lightbox is open
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the lightbox container for screen reader navigation
      setTimeout(() => {
        lightboxRef.current?.focus();
      }, 100);
      
      // Announce lightbox opening
      setAnnounceText(`Lightbox opened. Image ${currentIndex + 1} of ${images.length}. Use arrow keys to navigate, escape to close.`);
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, images.length]);

  // Touch gesture handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Swipe detection
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    const maxVerticalMovement = 100;

    // Only process horizontal swipes if vertical movement is minimal
    if (deltaTime < maxSwipeTime && Math.abs(deltaY) < maxVerticalMovement) {
      if (deltaX > minSwipeDistance && images.length > 1) {
        onPrevious();
        setAnnounceText(`Swiped to previous image: ${images[(currentIndex - 1 + images.length) % images.length].alt}`);
      } else if (deltaX < -minSwipeDistance && images.length > 1) {
        onNext();
        setAnnounceText(`Swiped to next image: ${images[(currentIndex + 1) % images.length].alt}`);
      }
    }

    // Double tap to zoom (if tap is quick and in same position)
    if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      if (zoom === 1) {
        handleZoomIn();
      } else {
        resetZoom();
      }
    }

    touchStartRef.current = null;
  }, [onNext, onPrevious, images, currentIndex, zoom, handleZoomIn, resetZoom]);

  // Mouse drag handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  }, []);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={lightboxRef}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        aria-describedby="lightbox-description"
        tabIndex={-1}
      >
        {/* Screen reader announcements */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
          id="lightbox-description"
        >
          {announceText}
        </div>
        {/* Header */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                {currentIndex + 1} of {images.length}
              </div>
              <div className="hidden sm:block text-sm text-gray-200">
                {currentImage.category}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label={`Zoom out. Current zoom: ${Math.round(zoom * 100)}%`}
                disabled={zoom <= 0.5}
              >
                <ZoomOut size={20} />
              </button>
              
              <span className="text-sm min-w-[3rem] text-center" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label={`Zoom in. Current zoom: ${Math.round(zoom * 100)}%`}
                disabled={zoom >= 5}
              >
                <ZoomIn size={20} />
              </button>

              {/* Rotate */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotate();
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label={`Rotate image. Current rotation: ${rotation} degrees`}
              >
                <RotateCw size={20} />
              </button>

              {/* Info toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(prev => !prev);
                }}
                className={`p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${showInfo ? 'bg-white/20' : ''}`}
                aria-label={showInfo ? "Hide image information" : "Show image information"}
                aria-pressed={showInfo}
              >
                <Info size={20} />
              </button>

              {/* Share */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle share functionality
                  if (navigator.share && currentImage) {
                    navigator.share({
                      title: currentImage.alt,
                      text: currentImage.caption || currentImage.alt,
                      url: window.location.href
                    }).catch(() => {
                      // Fallback: copy to clipboard
                      navigator.clipboard?.writeText(window.location.href);
                      setAnnounceText('Image URL copied to clipboard');
                    });
                  } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard?.writeText(window.location.href);
                    setAnnounceText('Image URL copied to clipboard');
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Share image"
              >
                <Share2 size={20} />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Close lightbox"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Previous image. Currently viewing image ${currentIndex + 1} of ${images.length}`}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Next image. Currently viewing image ${currentIndex + 1} of ${images.length}`}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image container */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-20"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            ref={imageRef}
            className={`relative max-w-full max-h-full ${isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-default'}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={getOptimizedImageUrl(currentImage.filename)}
              alt={getImageAlt(currentImage)}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              onLoad={() => {
                setIsLoading(false);
                setAnnounceText(`Image loaded: ${currentImage.alt}`);
              }}
              priority
              sizes="100vw"
              role="img"
              aria-describedby={showInfo ? "image-details" : undefined}
            />
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer with image info */}
        <AnimatePresence>
          {(showInfo || currentImage.caption) && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              id="image-details"
            >
              <div className="text-center text-white max-w-4xl mx-auto">
                {currentImage.caption && (
                  <p className="text-lg font-medium mb-2">
                    {currentImage.caption}
                  </p>
                )}
                
                {showInfo && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-200">
                      <span>Category: {currentImage.category}</span>
                      {currentImage.featured && (
                        <span className="flex items-center gap-1">
                          <Heart size={14} className="fill-current text-red-400" />
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-300">
                      Image {currentIndex + 1} of {images.length} • 
                      Zoom: {Math.round(zoom * 100)}% • 
                      Rotation: {rotation}°
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard shortcuts help */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-300 hidden lg:block">
          <div>← → Navigate • ESC Close • +/- Zoom • R Rotate • I Info</div>
        </div>

        {/* Image preloader for smooth transitions */}
        <ImagePreloader 
          images={images} 
          currentIndex={currentIndex} 
          preloadCount={3} 
        />

        {/* Skip links for screen readers */}
        <div className="sr-only">
          <button
            onClick={onClose}
            className="absolute top-0 left-0"
          >
            Skip to main content
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}