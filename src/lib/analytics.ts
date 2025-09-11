/**
 * Google Analytics 4 integration and custom event tracking
 */

// Google Analytics 4 configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = window.gtag || function() {
    (window.gtag.q = window.gtag.q || []).push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Custom event tracking
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const trackEvent = ({ action, category, label, value, custom_parameters }: AnalyticsEvent) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...custom_parameters,
  });
};

// Donation tracking events
export const trackDonation = (amount: number, currency: string = 'INR', method: string) => {
  trackEvent({
    action: 'donation_completed',
    category: 'donations',
    label: method,
    value: amount,
    custom_parameters: {
      currency,
      payment_method: method,
    },
  });

  // Enhanced ecommerce tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: `donation_${Date.now()}`,
      value: amount,
      currency: currency,
      items: [{
        item_id: 'donation',
        item_name: 'Donation to SCES',
        category: 'donation',
        quantity: 1,
        price: amount,
      }],
    });
  }
};

export const trackDonationStart = (amount: number, method: string) => {
  trackEvent({
    action: 'donation_started',
    category: 'donations',
    label: method,
    value: amount,
    custom_parameters: {
      payment_method: method,
    },
  });
};

export const trackDonationError = (error: string, method: string) => {
  trackEvent({
    action: 'donation_error',
    category: 'donations',
    label: `${method}_error`,
    custom_parameters: {
      error_message: error,
      payment_method: method,
    },
  });
};

// Volunteer tracking events
export const trackVolunteerApplication = (skills: string[], city: string) => {
  trackEvent({
    action: 'volunteer_application_submitted',
    category: 'volunteers',
    label: city,
    custom_parameters: {
      skills: skills.join(','),
      city,
    },
  });
};

export const trackVolunteerFormStart = () => {
  trackEvent({
    action: 'volunteer_form_started',
    category: 'volunteers',
  });
};

// Content engagement tracking
export const trackGalleryView = (category: string, imageCount: number) => {
  trackEvent({
    action: 'gallery_viewed',
    category: 'content',
    label: category,
    value: imageCount,
  });
};

export const trackBlogRead = (postTitle: string, readTime: number) => {
  trackEvent({
    action: 'blog_post_read',
    category: 'content',
    label: postTitle,
    value: readTime,
  });
};

export const trackVideoPlay = (videoTitle: string) => {
  trackEvent({
    action: 'video_play',
    category: 'content',
    label: videoTitle,
  });
};

// User interaction tracking
export const trackButtonClick = (buttonText: string, location: string) => {
  trackEvent({
    action: 'button_click',
    category: 'interactions',
    label: `${buttonText}_${location}`,
  });
};

export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent({
    action: success ? 'form_submission_success' : 'form_submission_error',
    category: 'forms',
    label: formName,
  });
};

export const trackSearch = (searchTerm: string, results: number) => {
  trackEvent({
    action: 'search',
    category: 'site_search',
    label: searchTerm,
    value: results,
  });
};

// Performance tracking
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent({
    action: 'performance_metric',
    category: 'performance',
    label: `${metric}_${unit}`,
    value: Math.round(value),
  });
};

// Error tracking
export const trackError = (error: string, location: string, severity: 'low' | 'medium' | 'high' = 'medium') => {
  trackEvent({
    action: 'error_occurred',
    category: 'errors',
    label: location,
    custom_parameters: {
      error_message: error,
      severity,
    },
  });
};

// Social sharing tracking
export const trackSocialShare = (platform: string, content: string) => {
  trackEvent({
    action: 'social_share',
    category: 'social',
    label: platform,
    custom_parameters: {
      content_type: content,
    },
  });
};

// File download tracking
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent({
    action: 'file_download',
    category: 'downloads',
    label: fileName,
    custom_parameters: {
      file_type: fileType,
    },
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number, page: string) => {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    label: page,
    value: depth,
  });
};

// Time on page tracking
export const trackTimeOnPage = (seconds: number, page: string) => {
  trackEvent({
    action: 'time_on_page',
    category: 'engagement',
    label: page,
    value: seconds,
  });
};