'use client';

import React, { useState, useEffect } from 'react';
import { TestimonialCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { testimonials } from '@/config/testimonials';
import { cn } from '@/lib/utils';

interface TestimonialSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  layout?: 'carousel' | 'grid';
  showNavigation?: boolean;
  autoPlay?: boolean;
  interval?: number;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export default function TestimonialSection({
  className,
  title = "What People Say About Us",
  subtitle = "Hear from the families and communities we've had the privilege to serve",
  layout = 'carousel',
  showNavigation = true,
  autoPlay = true,
  interval = 5000,
  itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
}: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || layout === 'grid') return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= testimonials.length - itemsPerView.desktop 
          ? 0 
          : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, layout, itemsPerView.desktop]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(autoPlay), 10000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 
      ? Math.max(0, testimonials.length - itemsPerView.desktop)
      : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex >= testimonials.length - itemsPerView.desktop
      ? 0
      : currentIndex + 1;
    goToSlide(newIndex);
  };

  if (layout === 'grid') {
    return (
      <section className={cn('py-16 bg-gradient-to-br from-yellow-50 to-white', className)}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-${index}`}
                quote={testimonial.content}
                author={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.image}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Carousel Layout
  return (
    <section className={cn('py-16 bg-gradient-to-br from-yellow-50 to-white', className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {showNavigation && testimonials.length > itemsPerView.desktop && (
            <>
              <button
                onClick={goToPrevious}
                className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10',
                  'w-12 h-12 rounded-full bg-white shadow-lg',
                  'flex items-center justify-center',
                  'text-blue-800 hover:text-blue-600',
                  'hover:shadow-xl transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2'
                )}
                aria-label="Previous testimonials"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className={cn(
                  'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10',
                  'w-12 h-12 rounded-full bg-white shadow-lg',
                  'flex items-center justify-center',
                  'text-blue-800 hover:text-blue-600',
                  'hover:shadow-xl transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2'
                )}
                aria-label="Next testimonials"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={`testimonial-${index}`}
                  className={cn(
                    'flex-shrink-0 px-3',
                    'w-full md:w-1/2 lg:w-1/3'
                  )}
                >
                  <TestimonialCard
                    quote={testimonial.content}
                    author={testimonial.name}
                    role={testimonial.role}
                    avatar={testimonial.image}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {testimonials.length > itemsPerView.desktop && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ 
                length: Math.ceil(testimonials.length - itemsPerView.desktop + 1) 
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2',
                    currentIndex === index
                      ? 'bg-blue-800 scale-125'
                      : 'bg-gray-300 hover:bg-blue-600'
                  )}
                  aria-label={`Go to testimonial set ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-700 mb-6">
            Join the families who have experienced the transformative power of education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="min-w-[200px]"
            >
              Support a Child's Education
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              Become a Volunteer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}