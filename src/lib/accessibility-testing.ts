/**
 * Accessibility testing utilities for WCAG compliance
 */

import { ColorContrast } from './accessibility';

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  element?: HTMLElement;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

export class AccessibilityTester {
  private issues: AccessibilityIssue[] = [];

  // Test color contrast ratios
  testColorContrast(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const ratio = ColorContrast.getContrastRatio(color, backgroundColor);
      
      if (ratio < 4.5) {
        issues.push({
          type: 'error',
          rule: 'WCAG 2.1 AA - Color Contrast',
          message: `Insufficient color contrast ratio: ${ratio.toFixed(2)}:1. Minimum required: 4.5:1`,
          element,
          severity: 'critical'
        });
      } else if (ratio < 7) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 2.1 AAA - Color Contrast',
          message: `Color contrast ratio ${ratio.toFixed(2)}:1 meets AA but not AAA standards (7:1)`,
          element,
          severity: 'moderate'
        });
      }
    }

    return issues;
  }

  // Test for missing alt text
  testImageAltText(element: HTMLImageElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const alt = element.getAttribute('alt');
    const role = element.getAttribute('role');

    if (alt === null) {
      issues.push({
        type: 'error',
        rule: 'WCAG 2.1 A - Images of Text',
        message: 'Image missing alt attribute',
        element,
        severity: 'critical'
      });
    } else if (alt === '' && role !== 'presentation' && !element.hasAttribute('aria-hidden')) {
      issues.push({
        type: 'warning',
        rule: 'WCAG 2.1 A - Images of Text',
        message: 'Image has empty alt text but may not be decorative',
        element,
        severity: 'moderate'
      });
    }

    return issues;
  }

  // Test for proper heading hierarchy
  testHeadingHierarchy(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        issues.push({
          type: 'error',
          rule: 'WCAG 2.1 AA - Headings and Labels',
          message: 'Page should start with h1 heading',
          element: heading as HTMLElement,
          severity: 'serious'
        });
      }
      
      if (level > previousLevel + 1) {
        issues.push({
          type: 'error',
          rule: 'WCAG 2.1 AA - Headings and Labels',
          message: `Heading level skipped from h${previousLevel} to h${level}`,
          element: heading as HTMLElement,
          severity: 'serious'
        });
      }
      
      previousLevel = level;
    });

    return issues;
  }

  // Test for keyboard accessibility
  testKeyboardAccessibility(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const isInteractive = this.isInteractiveElement(element);
    const tabIndex = element.getAttribute('tabindex');
    const hasClickHandler = element.onclick !== null || 
                           element.addEventListener !== undefined;

    if (isInteractive || hasClickHandler) {
      if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 2.1 A - Keyboard',
          message: 'Interactive element not keyboard accessible',
          element,
          severity: 'serious'
        });
      }

      if (!element.hasAttribute('role') && !this.isNativeInteractiveElement(element)) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 2.1 A - Keyboard',
          message: 'Interactive element missing appropriate role',
          element,
          severity: 'moderate'
        });
      }
    }

    return issues;
  }

  // Test for ARIA labels and descriptions
  testAriaLabels(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const ariaDescribedBy = element.getAttribute('aria-describedby');

    // Check for required labels
    if (this.requiresLabel(element) && !ariaLabel && !ariaLabelledBy) {
      issues.push({
        type: 'error',
        rule: 'WCAG 2.1 A - Labels or Instructions',
        message: 'Interactive element missing accessible name',
        element,
        severity: 'critical'
      });
    }

    // Check for invalid ARIA references
    if (ariaLabelledBy) {
      const referencedElements = ariaLabelledBy.split(' ').map(id => document.getElementById(id));
      if (referencedElements.some(el => !el)) {
        issues.push({
          type: 'error',
          rule: 'WCAG 2.1 A - Parsing',
          message: 'aria-labelledby references non-existent element',
          element,
          severity: 'serious'
        });
      }
    }

    if (ariaDescribedBy) {
      const referencedElements = ariaDescribedBy.split(' ').map(id => document.getElementById(id));
      if (referencedElements.some(el => !el)) {
        issues.push({
          type: 'error',
          rule: 'WCAG 2.1 A - Parsing',
          message: 'aria-describedby references non-existent element',
          element,
          severity: 'serious'
        });
      }
    }

    return issues;
  }

  // Test for focus indicators
  testFocusIndicators(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    
    if (this.isInteractiveElement(element)) {
      const computedStyle = window.getComputedStyle(element, ':focus-visible');
      const outline = computedStyle.outline;
      const outlineWidth = computedStyle.outlineWidth;
      
      if (outline === 'none' || outlineWidth === '0px') {
        issues.push({
          type: 'error',
          rule: 'WCAG 2.1 AA - Focus Visible',
          message: 'Interactive element missing visible focus indicator',
          element,
          severity: 'serious'
        });
      }
    }

    return issues;
  }

  // Helper methods
  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'tab', 'menuitem', 'option'];
    
    return interactiveTags.includes(element.tagName.toLowerCase()) ||
           interactiveRoles.includes(element.getAttribute('role') || '') ||
           element.hasAttribute('tabindex') ||
           element.onclick !== null;
  }

  private isNativeInteractiveElement(element: HTMLElement): boolean {
    const nativeTags = ['button', 'a', 'input', 'select', 'textarea'];
    return nativeTags.includes(element.tagName.toLowerCase());
  }

  private requiresLabel(element: HTMLElement): boolean {
    const requiresLabelTags = ['input', 'select', 'textarea'];
    const requiresLabelRoles = ['button', 'link', 'tab', 'menuitem'];
    
    return requiresLabelTags.includes(element.tagName.toLowerCase()) ||
           requiresLabelRoles.includes(element.getAttribute('role') || '');
  }

  // Run all tests on a page or element
  runAllTests(container: HTMLElement = document.body): AccessibilityIssue[] {
    this.issues = [];

    // Test all elements
    const allElements = container.querySelectorAll('*');
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Color contrast
      this.issues.push(...this.testColorContrast(htmlElement));
      
      // Images
      if (element.tagName === 'IMG') {
        this.issues.push(...this.testImageAltText(element as HTMLImageElement));
      }
      
      // Keyboard accessibility
      this.issues.push(...this.testKeyboardAccessibility(htmlElement));
      
      // ARIA labels
      this.issues.push(...this.testAriaLabels(htmlElement));
      
      // Focus indicators
      this.issues.push(...this.testFocusIndicators(htmlElement));
    });

    // Heading hierarchy (page-level test)
    if (container === document.body) {
      this.issues.push(...this.testHeadingHierarchy());
    }

    return this.issues;
  }

  // Generate accessibility report
  generateReport(): {
    summary: {
      total: number;
      critical: number;
      serious: number;
      moderate: number;
      minor: number;
    };
    issues: AccessibilityIssue[];
  } {
    const summary = {
      total: this.issues.length,
      critical: this.issues.filter(i => i.severity === 'critical').length,
      serious: this.issues.filter(i => i.severity === 'serious').length,
      moderate: this.issues.filter(i => i.severity === 'moderate').length,
      minor: this.issues.filter(i => i.severity === 'minor').length,
    };

    return {
      summary,
      issues: this.issues,
    };
  }
}

// Export singleton instance
export const accessibilityTester = new AccessibilityTester();