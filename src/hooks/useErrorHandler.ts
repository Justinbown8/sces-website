'use client';

import { useCallback } from 'react';
import { trackError } from '@/lib/analytics';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  trackInAnalytics?: boolean;
  severity?: 'low' | 'medium' | 'high';
}

interface UseErrorHandlerReturn {
  handleError: (error: Error | string, context?: string, options?: ErrorHandlerOptions) => void;
  handleAsyncError: (asyncFn: () => Promise<any>, context?: string, options?: ErrorHandlerOptions) => Promise<any>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const handleError = useCallback((
    error: Error | string,
    context: string = 'Unknown',
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = false,
      logToConsole = true,
      trackInAnalytics = true,
      severity = 'medium'
    } = options;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? 'N/A' : error.stack || 'No stack trace';

    // Log to console in development
    if (logToConsole && process.env.NODE_ENV === 'development') {
      console.error(`[${context}] Error:`, error);
    }

    // Track in analytics
    if (trackInAnalytics) {
      trackError(errorMessage, `${context}: ${errorStack}`, severity);
    }

    // Show toast notification (if toast system is implemented)
    if (showToast) {
      // This would integrate with a toast notification system
      // For now, we'll just log it
      console.warn('Toast notification requested but not implemented:', errorMessage);
    }
  }, []);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context: string = 'Async Operation',
    options: ErrorHandlerOptions = {}
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};

// Specialized error handlers for common scenarios
export const useDonationErrorHandler = () => {
  const { handleError, handleAsyncError } = useErrorHandler();

  return {
    handlePaymentError: (error: Error | string) => 
      handleError(error, 'Payment Processing', { severity: 'high', showToast: true }),
    handleFormError: (error: Error | string) => 
      handleError(error, 'Donation Form', { severity: 'medium', showToast: true }),
    handleAsyncPayment: (asyncFn: () => Promise<any>) => 
      handleAsyncError(asyncFn, 'Payment Processing', { severity: 'high' })
  };
};

export const useVolunteerErrorHandler = () => {
  const { handleError, handleAsyncError } = useErrorHandler();

  return {
    handleSubmissionError: (error: Error | string) => 
      handleError(error, 'Volunteer Application', { severity: 'medium', showToast: true }),
    handleValidationError: (error: Error | string) => 
      handleError(error, 'Form Validation', { severity: 'low' }),
    handleAsyncSubmission: (asyncFn: () => Promise<any>) => 
      handleAsyncError(asyncFn, 'Volunteer Application', { severity: 'medium' })
  };
};

export const useGalleryErrorHandler = () => {
  const { handleError, handleAsyncError } = useErrorHandler();

  return {
    handleImageLoadError: (error: Error | string) => 
      handleError(error, 'Image Loading', { severity: 'low' }),
    handleLightboxError: (error: Error | string) => 
      handleError(error, 'Lightbox', { severity: 'low' }),
    handleAsyncImageLoad: (asyncFn: () => Promise<any>) => 
      handleAsyncError(asyncFn, 'Image Loading', { severity: 'low' })
  };
};

export default useErrorHandler;