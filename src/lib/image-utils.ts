import { GalleryImage } from '@/config/gallery';

// Responsive image sizes for different breakpoints
export const imageSizes = {
  thumbnail: { width: 300, height: 200 },
  small: { width: 400, height: 300 },
  medium: { width: 600, height: 400 },
  large: { width: 800, height: 600 },
  xlarge: { width: 1200, height: 800 }
} as const;

export type ImageSize = keyof typeof imageSizes;

// Generate srcSet for responsive images
export const generateSrcSet = (filename: string): string => {
  const basePath = '/gallery';
  const name = filename.replace('.jpg', '');
  
  return [
    `${basePath}/${filename} 1x`,
    // For now, we'll use the original image at different densities
    // In a real implementation, you'd have multiple sizes generated
    `${basePath}/${filename} 2x`
  ].join(', ');
};

// Generate sizes attribute for responsive images
export const generateSizes = (): string => {
  return [
    '(max-width: 640px) 100vw',
    '(max-width: 768px) 50vw',
    '(max-width: 1024px) 33vw',
    '25vw'
  ].join(', ');
};

// Get optimized image URL
export const getOptimizedImageUrl = (
  filename: string, 
  size: ImageSize = 'medium'
): string => {
  // For Next.js Image component, we'll use the original path
  // Next.js will handle optimization automatically
  return `/gallery/${filename}`;
};

// Get image dimensions for a specific size
export const getImageDimensions = (size: ImageSize) => {
  return imageSizes[size];
};

// Generate alt text with fallback
export const getImageAlt = (image: GalleryImage): string => {
  return image.alt || `SCES ${image.category.toLowerCase()} image`;
};

// Check if image format is supported
export const isWebPSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Get WebP URL with fallback
export const getWebPUrl = (filename: string): string => {
  const webpFilename = filename.replace('.jpg', '.webp');
  return `/gallery/${webpFilename}`;
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Lazy loading intersection observer options
export const lazyLoadOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1
};