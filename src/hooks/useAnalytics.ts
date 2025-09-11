/**
 * Analytics hooks for tracking user interactions
 */

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  trackButtonClick,
  trackScrollDepth,
  trackTimeOnPage,
  trackFormSubmission,
  trackDonation,
  trackDonationStart,
  trackDonationError,
  trackVolunteerApplication,
  trackVolunteerFormStart,
  trackGalleryView,
  trackBlogRead,
  trackSocialShare,
} from '@/lib/analytics';

// Hook for tracking button clicks
export const useButtonTracking = () => {
  return useCallback((buttonText: string, location?: string) => {
    const currentLocation = location || window.location.pathname;
    trackButtonClick(buttonText, currentLocation);
  }, []);
};

// Hook for tracking scroll depth
export const useScrollTracking = () => {
  const pathname = usePathname();
  const scrollDepthRef = useRef(0);
  const reportedDepths = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      // Track at 25%, 50%, 75%, and 100% scroll depths
      const depths = [25, 50, 75, 100];
      depths.forEach(depth => {
        if (scrollPercent >= depth && !reportedDepths.current.has(depth)) {
          trackScrollDepth(depth, pathname);
          reportedDepths.current.add(depth);
        }
      });

      scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Reset reported depths when pathname changes
  useEffect(() => {
    reportedDepths.current.clear();
    scrollDepthRef.current = 0;
  }, [pathname]);
};

// Hook for tracking time on page
export const useTimeTracking = () => {
  const pathname = usePathname();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5) { // Only track if user spent more than 5 seconds
        trackTimeOnPage(timeSpent, pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname]);
};

// Hook for tracking form interactions
export const useFormTracking = () => {
  const trackFormStart = useCallback((formName: string) => {
    trackFormSubmission(`${formName}_started`, true);
  }, []);

  const trackFormComplete = useCallback((formName: string, success: boolean = true) => {
    trackFormSubmission(formName, success);
  }, []);

  const trackFormError = useCallback((formName: string, error: string) => {
    trackFormSubmission(`${formName}_error`, false);
  }, []);

  return {
    trackFormStart,
    trackFormComplete,
    trackFormError,
  };
};

// Hook for tracking donation flow
export const useDonationTracking = () => {
  const trackStart = useCallback((amount: number, method: string) => {
    trackDonationStart(amount, method);
  }, []);

  const trackComplete = useCallback((amount: number, currency: string, method: string) => {
    trackDonation(amount, currency, method);
  }, []);

  const trackError = useCallback((error: string, method: string) => {
    trackDonationError(error, method);
  }, []);

  return {
    trackDonationStart: trackStart,
    trackDonationComplete: trackComplete,
    trackDonationError: trackError,
  };
};

// Hook for tracking volunteer interactions
export const useVolunteerTracking = () => {
  const trackFormStart = useCallback(() => {
    trackVolunteerFormStart();
  }, []);

  const trackApplication = useCallback((skills: string[], city: string) => {
    trackVolunteerApplication(skills, city);
  }, []);

  return {
    trackVolunteerFormStart: trackFormStart,
    trackVolunteerApplication: trackApplication,
  };
};

// Hook for tracking content engagement
export const useContentTracking = () => {
  const trackGallery = useCallback((category: string, imageCount: number) => {
    trackGalleryView(category, imageCount);
  }, []);

  const trackBlog = useCallback((postTitle: string, readTime: number) => {
    trackBlogRead(postTitle, readTime);
  }, []);

  const trackShare = useCallback((platform: string, content: string) => {
    trackSocialShare(platform, content);
  }, []);

  return {
    trackGalleryView: trackGallery,
    trackBlogRead: trackBlog,
    trackSocialShare: trackShare,
  };
};

// Hook for tracking reading progress
export const useReadingProgress = (contentRef: React.RefObject<HTMLElement>) => {
  const pathname = usePathname();
  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleScroll = () => {
      const element = contentRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.pageYOffset;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;

      // Calculate reading progress
      const startReading = elementTop - windowHeight;
      const finishReading = elementTop + elementHeight;
      const totalReadingArea = finishReading - startReading;
      const currentPosition = scrollTop - startReading;
      const progress = Math.max(0, Math.min(100, (currentPosition / totalReadingArea) * 100));

      maxScrollRef.current = Math.max(maxScrollRef.current, progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;

    return () => {
      // Track reading completion on unmount
      const readTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      const readProgress = maxScrollRef.current;
      
      if (readTime > 10 && readProgress > 25) { // Meaningful engagement
        trackBlogRead(pathname, readTime);
      }
    };
  }, [pathname]);

  return maxScrollRef.current;
};