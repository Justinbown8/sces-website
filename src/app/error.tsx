'use client';

import { useEffect } from 'react';
import ErrorFallback from '@/components/ui/ErrorFallback';
import { trackError } from '@/lib/analytics';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Track the error in analytics
    trackError(
      error.message || 'Application Error',
      error.stack || 'unknown',
      'high'
    );

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error);
    }
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      resetError={reset}
      title="Application Error"
      message="We encountered an unexpected error while loading this page. Our team has been notified and is working to resolve this issue."
      showContactInfo={true}
    />
  );
}