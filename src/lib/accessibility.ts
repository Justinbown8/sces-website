/**
 * Accessibility utilities and helpers for WCAG AA compliance
 */

// Color contrast ratios for WCAG AA compliance
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const;

// ARIA live region politeness levels
export type AriaLive = 'off' | 'polite' | 'assertive';

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  static trapFocus(element: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(element);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }

  static getFocusableElements(element: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(element.querySelectorAll(focusableSelectors));
  }

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      this.focusStack.push(activeElement);
    }
  }

  static restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && element.focus) {
      element.focus();
    }
  }
}

// Screen reader utilities
export class ScreenReaderUtils {
  private static liveRegion: HTMLElement | null = null;

  static announce(message: string, priority: AriaLive = 'polite'): void {
    if (!this.liveRegion) {
      this.createLiveRegion();
    }

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  private static createLiveRegion(): void {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  }

  static createScreenReaderText(text: string): string {
    return `<span class="sr-only">${text}</span>`;
  }
}

// Keyboard navigation utilities
export class KeyboardNavigation {
  static KEYS = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    TAB: 'Tab',
  } as const;

  static isActivationKey(key: string): boolean {
    return key === this.KEYS.ENTER || key === this.KEYS.SPACE;
  }

  static isArrowKey(key: string): boolean {
    return [
      this.KEYS.ARROW_UP,
      this.KEYS.ARROW_DOWN,
      this.KEYS.ARROW_LEFT,
      this.KEYS.ARROW_RIGHT,
    ].includes(key as any);
  }

  static handleArrowNavigation(
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number,
    options: {
      orientation?: 'horizontal' | 'vertical' | 'both';
      wrap?: boolean;
    } = {}
  ): number {
    const { orientation = 'both', wrap = true } = options;
    const { key } = event;

    let newIndex = currentIndex;

    switch (key) {
      case this.KEYS.ARROW_UP:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = wrap 
            ? (currentIndex - 1 + elements.length) % elements.length
            : Math.max(0, currentIndex - 1);
        }
        break;
      case this.KEYS.ARROW_DOWN:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = wrap 
            ? (currentIndex + 1) % elements.length
            : Math.min(elements.length - 1, currentIndex + 1);
        }
        break;
      case this.KEYS.ARROW_LEFT:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = wrap 
            ? (currentIndex - 1 + elements.length) % elements.length
            : Math.max(0, currentIndex - 1);
        }
        break;
      case this.KEYS.ARROW_RIGHT:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = wrap 
            ? (currentIndex + 1) % elements.length
            : Math.min(elements.length - 1, currentIndex + 1);
        }
        break;
      case this.KEYS.HOME:
        newIndex = 0;
        break;
      case this.KEYS.END:
        newIndex = elements.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      elements[newIndex]?.focus();
    }

    return newIndex;
  }
}

// Color contrast utilities
export class ColorContrast {
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  static meetsWCAG(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA', size: 'normal' | 'large' = 'normal'): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    const required = level === 'AA' 
      ? (size === 'large' ? CONTRAST_RATIOS.AA_LARGE : CONTRAST_RATIOS.AA_NORMAL)
      : (size === 'large' ? CONTRAST_RATIOS.AAA_LARGE : CONTRAST_RATIOS.AAA_NORMAL);
    
    return ratio >= required;
  }
}

// Form accessibility utilities
export class FormAccessibility {
  static generateId(prefix: string = 'field'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static associateLabel(inputId: string, labelId: string, errorId?: string, descriptionId?: string): {
    'aria-labelledby': string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
  } {
    const labelledBy = labelId;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ');

    return {
      'aria-labelledby': labelledBy,
      ...(describedBy && { 'aria-describedby': describedBy }),
      ...(errorId && { 'aria-invalid': true }),
    };
  }

  static createFieldset(legend: string, required: boolean = false): {
    role: string;
    'aria-labelledby': string;
    'aria-required'?: boolean;
  } {
    const legendId = this.generateId('legend');
    
    return {
      role: 'group',
      'aria-labelledby': legendId,
      ...(required && { 'aria-required': true }),
    };
  }
}

// Image accessibility utilities
export class ImageAccessibility {
  static generateAltText(context: string, description?: string): string {
    if (!description) {
      return `Image from ${context}`;
    }
    return `${description} - ${context}`;
  }

  static isDecorative(alt: string): boolean {
    return alt === '' || alt.toLowerCase().includes('decorative');
  }

  static createFigureCaption(alt: string, caption?: string): string {
    if (caption) {
      return caption;
    }
    return alt;
  }
}

// Motion and animation utilities
export class MotionAccessibility {
  static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static createSafeAnimation(
    normalAnimation: object,
    reducedAnimation: object = { transition: 'none' }
  ): object {
    return this.prefersReducedMotion() ? reducedAnimation : normalAnimation;
  }

  static respectMotionPreference<T>(
    normalValue: T,
    reducedValue: T
  ): T {
    return this.prefersReducedMotion() ? reducedValue : normalValue;
  }
}

// Skip link utilities
export class SkipLinks {
  static createSkipLink(targetId: string, text: string): HTMLAnchorElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    
    // Add skip link styles
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 4px;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    return skipLink;
  }

  static addSkipLinks(): void {
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    
    const mainSkipLink = this.createSkipLink('main-content', 'Skip to main content');
    const navSkipLink = this.createSkipLink('main-navigation', 'Skip to navigation');
    
    skipLinksContainer.appendChild(mainSkipLink);
    skipLinksContainer.appendChild(navSkipLink);
    
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
  }
}

// Landmark utilities
export class LandmarkUtils {
  static addLandmarkLabels(): void {
    // Add aria-label to navigation landmarks
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : `Navigation ${index + 1}`);
      }
    });

    // Add aria-label to main content
    const mainElement = document.querySelector('main');
    if (mainElement && !mainElement.getAttribute('aria-label')) {
      mainElement.setAttribute('aria-label', 'Main content');
    }

    // Add aria-label to complementary content
    const asideElements = document.querySelectorAll('aside');
    asideElements.forEach((aside, index) => {
      if (!aside.getAttribute('aria-label') && !aside.getAttribute('aria-labelledby')) {
        aside.setAttribute('aria-label', `Complementary content ${index + 1}`);
      }
    });
  }
}

// Export all utilities
export {
  FocusManager,
  ScreenReaderUtils,
  KeyboardNavigation,
  ColorContrast,
  FormAccessibility,
  ImageAccessibility,
  MotionAccessibility,
  SkipLinks,
  LandmarkUtils,
};