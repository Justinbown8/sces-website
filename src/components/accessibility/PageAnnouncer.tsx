'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PageAnnouncerProps {
  pageTitle?: string;
}

export function PageAnnouncer({ pageTitle }: PageAnnouncerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Announce page changes to screen readers
    const announcePageChange = () => {
      const liveRegion = document.getElementById('sr-live-region');
      if (liveRegion) {
        // Clear previous announcement
        liveRegion.textContent = '';
        
        // Announce new page after a short delay
        setTimeout(() => {
          const title = pageTitle || document.title;
          liveRegion.textContent = `Page loaded: ${title}`;
        }, 100);
      }
    };

    announcePageChange();
  }, [pathname, pageTitle]);

  return null;
}

export default PageAnnouncer;