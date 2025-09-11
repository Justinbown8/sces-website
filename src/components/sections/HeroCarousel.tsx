'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HeroSlide } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function HeroCarousel({ 
  slides, 
  autoPlay = true, 
  interval = 5000,
  className 
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, nextSlide, slides.length]);

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className={cn(
        'relative w-full h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden',
        className
      )}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(autoPlay)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero carousel"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight">
              {currentSlideData.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto">
              {currentSlideData.subtitle}
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="primary" 
                size="md" 
                asChild
                className="shadow-2xl"
              >
                <Link href={currentSlideData.ctaPrimary.href}>
                  {currentSlideData.ctaPrimary.text}
                </Link>
              </Button>
              
              {currentSlideData.ctaSecondary && (
                <Button 
                  variant="outline" 
                  size="md" 
                  asChild
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl"
                >
                  <Link href={currentSlideData.ctaSecondary.href}>
                    {currentSlideData.ctaSecondary.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50',
                index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      )}
    </section>
  );
}

export default HeroCarousel;