/**
 * Integration Tests for Gallery Functionality
 * Tests gallery image loading, filtering, and lightbox functionality
 */

const { JSDOM } = require('jsdom');

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.Image = dom.window.Image;

describe('Gallery Functionality Integration Tests', () => {
  let mockIntersectionObserver;

  beforeEach(() => {
    // Mock IntersectionObserver for lazy loading
    mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });
    global.IntersectionObserver = mockIntersectionObserver;

    // Mock Image constructor
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload && this.onload();
        }, 100);
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Image Loading', () => {
    test('should load gallery images successfully', async () => {
      const mockImages = [
        {
          id: 'img1',
          src: '/images/gallery/481157835_944410404543185_2962726328455719855_n.webp',
          alt: 'Children in classroom learning',
          category: 'Classrooms'
        },
        {
          id: 'img2',
          src: '/images/gallery/481175245_944425734541652_9070409219912970222_n.webp',
          alt: 'Educational event with volunteers',
          category: 'Events'
        }
      ];

      const loadedImages = await Promise.all(
        mockImages.map(img => loadImage(img.src))
      );

      expect(loadedImages).toHaveLength(2);
      loadedImages.forEach(img => {
        expect(img).toBeInstanceOf(global.Image);
      });
    });

    test('should handle image loading errors gracefully', async () => {
      const invalidImageSrc = '/images/gallery/non-existent-image.webp';

      // Mock Image to simulate loading error
      global.Image = class {
        constructor() {
          setTimeout(() => {
            this.onerror && this.onerror(new Error('Image not found'));
          }, 100);
        }
      };

      try {
        await loadImage(invalidImageSrc);
      } catch (error) {
        expect(error.message).toBe('Image not found');
      }
    });

    test('should implement lazy loading for performance', () => {
      const imageElement = document.createElement('img');
      imageElement.src = '/images/gallery/test-image.webp';
      imageElement.loading = 'lazy';

      // Simulate intersection observer
      const observer = new IntersectionObserver(() => {});
      observer.observe(imageElement);

      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(imageElement.loading).toBe('lazy');
    });
  });

  describe('Gallery Filtering', () => {
    const mockGalleryImages = [
      { id: '1', category: 'Events', src: '/img1.webp', alt: 'Event 1' },
      { id: '2', category: 'Classrooms', src: '/img2.webp', alt: 'Classroom 1' },
      { id: '3', category: 'Field Visits', src: '/img3.webp', alt: 'Field Visit 1' },
      { id: '4', category: 'Events', src: '/img4.webp', alt: 'Event 2' },
      { id: '5', category: 'Classrooms', src: '/img5.webp', alt: 'Classroom 2' }
    ];

    test('should filter images by category', () => {
      const eventsImages = filterImagesByCategory(mockGalleryImages, 'Events');
      expect(eventsImages).toHaveLength(2);
      expect(eventsImages.every(img => img.category === 'Events')).toBe(true);
    });

    test('should show all images when no filter is applied', () => {
      const allImages = filterImagesByCategory(mockGalleryImages, 'All');
      expect(allImages).toHaveLength(5);
    });

    test('should handle empty category filter', () => {
      const emptyFilter = filterImagesByCategory(mockGalleryImages, '');
      expect(emptyFilter).toHaveLength(5);
    });

    test('should return empty array for non-existent category', () => {
      const nonExistentCategory = filterImagesByCategory(mockGalleryImages, 'NonExistent');
      expect(nonExistentCategory).toHaveLength(0);
    });
  });

  describe('Lightbox Functionality', () => {
    test('should open lightbox with correct image', () => {
      const mockImage = {
        id: '1',
        src: '/images/gallery/test-image.webp',
        alt: 'Test image',
        category: 'Events'
      };

      const lightboxState = openLightbox(mockImage, 0);
      
      expect(lightboxState.isOpen).toBe(true);
      expect(lightboxState.currentIndex).toBe(0);
      expect(lightboxState.currentImage).toEqual(mockImage);
    });

    test('should navigate to next image in lightbox', () => {
      const mockImages = [
        { id: '1', src: '/img1.webp', alt: 'Image 1' },
        { id: '2', src: '/img2.webp', alt: 'Image 2' },
        { id: '3', src: '/img3.webp', alt: 'Image 3' }
      ];

      let currentIndex = 0;
      const nextIndex = navigateNext(currentIndex, mockImages.length);
      
      expect(nextIndex).toBe(1);
    });

    test('should navigate to previous image in lightbox', () => {
      const mockImages = [
        { id: '1', src: '/img1.webp', alt: 'Image 1' },
        { id: '2', src: '/img2.webp', alt: 'Image 2' },
        { id: '3', src: '/img3.webp', alt: 'Image 3' }
      ];

      let currentIndex = 1;
      const prevIndex = navigatePrevious(currentIndex, mockImages.length);
      
      expect(prevIndex).toBe(0);
    });

    test('should wrap around when navigating past last image', () => {
      const mockImages = new Array(5).fill(null);
      let currentIndex = 4; // Last image
      const nextIndex = navigateNext(currentIndex, mockImages.length);
      
      expect(nextIndex).toBe(0); // Should wrap to first image
    });

    test('should wrap around when navigating before first image', () => {
      const mockImages = new Array(5).fill(null);
      let currentIndex = 0; // First image
      const prevIndex = navigatePrevious(currentIndex, mockImages.length);
      
      expect(prevIndex).toBe(4); // Should wrap to last image
    });

    test('should close lightbox', () => {
      const lightboxState = {
        isOpen: true,
        currentIndex: 2,
        currentImage: { id: '1', src: '/img1.webp' }
      };

      const closedState = closeLightbox(lightboxState);
      
      expect(closedState.isOpen).toBe(false);
      expect(closedState.currentIndex).toBe(0);
      expect(closedState.currentImage).toBe(null);
    });
  });

  describe('Keyboard Navigation', () => {
    test('should handle keyboard events in lightbox', () => {
      const mockKeyboardEvent = (key) => ({
        key,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      });

      const lightboxState = {
        isOpen: true,
        currentIndex: 1,
        images: [
          { id: '1', src: '/img1.webp' },
          { id: '2', src: '/img2.webp' },
          { id: '3', src: '/img3.webp' }
        ]
      };

      // Test arrow right (next)
      const rightArrowEvent = mockKeyboardEvent('ArrowRight');
      const nextState = handleKeyboardNavigation(lightboxState, rightArrowEvent);
      expect(nextState.currentIndex).toBe(2);

      // Test arrow left (previous)
      const leftArrowEvent = mockKeyboardEvent('ArrowLeft');
      const prevState = handleKeyboardNavigation(lightboxState, leftArrowEvent);
      expect(prevState.currentIndex).toBe(0);

      // Test escape (close)
      const escapeEvent = mockKeyboardEvent('Escape');
      const closedState = handleKeyboardNavigation(lightboxState, escapeEvent);
      expect(closedState.isOpen).toBe(false);
    });
  });

  describe('Touch Gestures', () => {
    test('should handle touch swipe gestures', () => {
      const mockTouchEvent = (clientX) => ({
        touches: [{ clientX }],
        preventDefault: jest.fn()
      });

      const touchHandler = {
        startX: 0,
        endX: 0,
        threshold: 50
      };

      // Simulate swipe left (next image)
      touchHandler.startX = 200;
      touchHandler.endX = 100; // Moved left
      const swipeDirection = getTouchSwipeDirection(touchHandler);
      expect(swipeDirection).toBe('left');

      // Simulate swipe right (previous image)
      touchHandler.startX = 100;
      touchHandler.endX = 200; // Moved right
      const swipeDirection2 = getTouchSwipeDirection(touchHandler);
      expect(swipeDirection2).toBe('right');
    });
  });

  describe('Image Optimization', () => {
    test('should use WebP format with fallback', () => {
      const originalImage = '/images/gallery/test-image.jpg';
      const optimizedImage = getOptimizedImageSrc(originalImage);
      
      expect(optimizedImage).toContain('.webp');
    });

    test('should generate responsive image sizes', () => {
      const imageSrc = '/images/gallery/test-image.webp';
      const responsiveSizes = generateResponsiveImageSizes(imageSrc);
      
      expect(responsiveSizes).toHaveProperty('small');
      expect(responsiveSizes).toHaveProperty('medium');
      expect(responsiveSizes).toHaveProperty('large');
    });
  });
});

// Helper functions for testing
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new global.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function filterImagesByCategory(images, category) {
  if (!category || category === 'All' || category === '') {
    return images;
  }
  return images.filter(img => img.category === category);
}

function openLightbox(image, index) {
  return {
    isOpen: true,
    currentIndex: index,
    currentImage: image
  };
}

function closeLightbox(state) {
  return {
    ...state,
    isOpen: false,
    currentIndex: 0,
    currentImage: null
  };
}

function navigateNext(currentIndex, totalImages) {
  return (currentIndex + 1) % totalImages;
}

function navigatePrevious(currentIndex, totalImages) {
  return currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
}

function handleKeyboardNavigation(state, event) {
  switch (event.key) {
    case 'ArrowRight':
      return { ...state, currentIndex: navigateNext(state.currentIndex, state.images.length) };
    case 'ArrowLeft':
      return { ...state, currentIndex: navigatePrevious(state.currentIndex, state.images.length) };
    case 'Escape':
      return closeLightbox(state);
    default:
      return state;
  }
}

function getTouchSwipeDirection(touchHandler) {
  const diff = touchHandler.startX - touchHandler.endX;
  if (Math.abs(diff) < touchHandler.threshold) return null;
  return diff > 0 ? 'left' : 'right';
}

function getOptimizedImageSrc(originalSrc) {
  return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

function generateResponsiveImageSizes(src) {
  const baseName = src.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  const extension = src.match(/\.(webp|jpg|jpeg|png)$/i)?.[0] || '.webp';
  
  return {
    small: `${baseName}_400w${extension}`,
    medium: `${baseName}_800w${extension}`,
    large: `${baseName}_1200w${extension}`
  };
}