'use client';

import { useEffect, useRef, useCallback } from 'react';
import { 
  FocusManager, 
  ScreenReaderUtils, 
  KeyboardNavigation, 
  MotionAccessibility 
} from '@/lib/accessibility';

// Hook for managing focus trapping in modals/dialogs
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      FocusManager.saveFocus();
      cleanupRef.current = FocusManager.trapFocus(containerRef.current);
    } else {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (!isActive) {
        FocusManager.restoreFocus();
      }
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isActive]);

  return containerRef;
}

// Hook for screen reader announcements
export function useScreenReader() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ScreenReaderUtils.announce(message, priority);
  }, []);

  return { announce };
}

// Hook for keyboard navigation in lists/grids
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    wrap?: boolean;
    onActivate?: (index: number, element: T) => void;
  } = {}
) {
  const { orientation = 'both', wrap = true, onActivate } = options;
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (items.length === 0) return;

    const newIndex = KeyboardNavigation.handleArrowNavigation(
      event,
      items,
      currentIndexRef.current,
      { orientation, wrap }
    );

    if (newIndex !== currentIndexRef.current) {
      currentIndexRef.current = newIndex;
    }

    // Handle activation keys
    if (KeyboardNavigation.isActivationKey(event.key)) {
      event.preventDefault();
      onActivate?.(currentIndexRef.current, items[currentIndexRef.current]);
    }
  }, [items, orientation, wrap, onActivate]);

  const setCurrentIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      currentIndexRef.current = index;
      items[index]?.focus();
    }
  }, [items]);

  return {
    handleKeyDown,
    currentIndex: currentIndexRef.current,
    setCurrentIndex,
  };
}

// Hook for managing reduced motion preferences
export function useReducedMotion() {
  const prefersReducedMotion = MotionAccessibility.prefersReducedMotion();

  const safeAnimation = useCallback((
    normalAnimation: object,
    reducedAnimation: object = { transition: 'none' }
  ) => {
    return MotionAccessibility.createSafeAnimation(normalAnimation, reducedAnimation);
  }, []);

  const respectMotionPreference = useCallback(<T>(
    normalValue: T,
    reducedValue: T
  ): T => {
    return MotionAccessibility.respectMotionPreference(normalValue, reducedValue);
  }, []);

  return {
    prefersReducedMotion,
    safeAnimation,
    respectMotionPreference,
  };
}

// Hook for managing ARIA live regions
export function useAriaLive() {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      if (liveRegionRef.current && liveRegionRef.current.parentNode) {
        liveRegionRef.current.parentNode.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
}

// Hook for managing skip links
export function useSkipLinks() {
  useEffect(() => {
    // Add skip links on mount
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#main-navigation" class="skip-link">Skip to navigation</a>
    `;
    
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);

    return () => {
      // Clean up on unmount
      const existingSkipLinks = document.querySelector('.skip-links');
      if (existingSkipLinks) {
        existingSkipLinks.remove();
      }
    };
  }, []);
}

// Hook for form accessibility
export function useFormAccessibility() {
  const generateFieldId = useCallback((prefix: string = 'field') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createFieldProps = useCallback((
    fieldId: string,
    labelId: string,
    errorId?: string,
    descriptionId?: string,
    hasError?: boolean
  ) => {
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ');

    return {
      id: fieldId,
      'aria-labelledby': labelId,
      ...(describedBy && { 'aria-describedby': describedBy }),
      ...(hasError && { 'aria-invalid': true }),
    };
  }, []);

  return {
    generateFieldId,
    createFieldProps,
  };
}

// Hook for managing color contrast
export function useColorContrast() {
  const checkContrast = useCallback((foreground: string, background: string) => {
    // This would typically use the ColorContrast utility
    // For now, return a simple check
    return {
      ratio: 4.5, // Placeholder
      meetsAA: true,
      meetsAAA: false,
    };
  }, []);

  return { checkContrast };
}