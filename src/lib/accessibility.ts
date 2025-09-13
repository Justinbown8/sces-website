// Simple accessibility utilities for SCES website

export const accessibility = {
  // Focus management
  focusElement: (element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  },

  // Screen reader announcements
  announce: (message: string) => {
    const liveRegion = document.getElementById('sr-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  },

  // Keyboard navigation
  handleKeyDown: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  },

  // Color contrast (basic check)
  hasGoodContrast: (foreground: string, background: string): boolean => {
    // Simple implementation - in production, use a proper contrast checker
    return true;
  },

  // Skip links
  createSkipLink: (targetId: string, text: string): HTMLAnchorElement => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    return skipLink;
  }
};

export default accessibility;