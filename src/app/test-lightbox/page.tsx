'use client';

import { useState } from 'react';
import { Lightbox } from '@/components/gallery/Lightbox';
import { useLightbox } from '@/hooks/useLightbox';
import { galleryImages } from '@/config/gallery';

export default function TestLightboxPage() {
  const lightbox = useLightbox();
  const testImages = galleryImages.slice(0, 5); // Use first 5 images for testing

  const openLightbox = (index: number) => {
    lightbox.openLightbox(testImages, index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lightbox Test Page</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Features to Test:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Keyboard Navigation:</strong> Arrow keys (←/→), Escape to close, +/- to zoom, R to rotate, I for info</li>
            <li><strong>Touch Gestures:</strong> Swipe left/right to navigate, double-tap to zoom</li>
            <li><strong>Mouse Controls:</strong> Click navigation buttons, scroll to zoom, drag to pan when zoomed</li>
            <li><strong>Accessibility:</strong> Screen reader announcements, focus management, ARIA labels</li>
            <li><strong>Image Preloading:</strong> Smooth transitions between images</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {testImages.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openLightbox(index)}
            >
              <img
                src={`/gallery/${image.filename}`}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                <span className="text-white font-semibold opacity-0 hover:opacity-100 transition-opacity">
                  Click to open
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click on any image above to open the lightbox</li>
            <li>Test keyboard navigation with arrow keys</li>
            <li>Try zooming with +/- keys or mouse wheel</li>
            <li>Test rotation with R key</li>
            <li>Toggle image info with I key</li>
            <li>On mobile: try swiping left/right and double-tap to zoom</li>
            <li>Test accessibility with screen reader if available</li>
            <li>Verify smooth image preloading when navigating</li>
          </ol>
        </div>

        {/* Lightbox */}
        <Lightbox
          images={lightbox.images}
          currentIndex={lightbox.currentIndex}
          isOpen={lightbox.isOpen}
          onClose={lightbox.closeLightbox}
          onNext={lightbox.nextImage}
          onPrevious={lightbox.previousImage}
        />
      </div>
    </div>
  );
}