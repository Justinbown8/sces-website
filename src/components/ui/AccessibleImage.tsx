import React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { ImageAccessibility } from '@/lib/accessibility';

interface AccessibleImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  caption?: string;
  decorative?: boolean;
  context?: string;
  className?: string;
}

export function AccessibleImage({
  alt,
  caption,
  decorative = false,
  context = 'SCES',
  className,
  ...props
}: AccessibleImageProps) {
  // Generate enhanced alt text if not decorative
  const enhancedAlt = decorative 
    ? '' 
    : ImageAccessibility.generateAltText(context, alt);

  // Determine if image should be hidden from screen readers
  const ariaHidden = decorative || ImageAccessibility.isDecorative(alt);

  const imageElement = (
    <Image
      {...props}
      alt={enhancedAlt}
      className={cn('object-cover', className)}
      aria-hidden={ariaHidden}
      role={ariaHidden ? 'presentation' : 'img'}
    />
  );

  // If there's a caption, wrap in figure element
  if (caption && !decorative) {
    return (
      <figure className="space-y-2">
        {imageElement}
        <figcaption className="text-sm text-gray-600 text-center">
          {ImageAccessibility.createFigureCaption(alt, caption)}
        </figcaption>
      </figure>
    );
  }

  return imageElement;
}

interface AccessibleImageGridProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  className?: string;
  onImageClick?: (index: number) => void;
}

export function AccessibleImageGrid({
  images,
  columns = 3,
  className,
  onImageClick,
}: AccessibleImageGridProps) {
  return (
    <div 
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
      role="grid"
      aria-label={`Image gallery with ${images.length} images`}
    >
      {images.map((image, index) => (
        <div 
          key={index}
          role="gridcell"
          className="relative group"
        >
          {onImageClick ? (
            <button
              onClick={() => onImageClick(index)}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg overflow-hidden"
              aria-label={`View image: ${image.alt}`}
            >
              <AccessibleImage
                src={image.src}
                alt={image.alt}
                caption={image.caption}
                width={400}
                height={300}
                className="w-full h-48 transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          ) : (
            <AccessibleImage
              src={image.src}
              alt={image.alt}
              caption={image.caption}
              width={400}
              height={300}
              className="w-full h-48 rounded-lg"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default AccessibleImage;