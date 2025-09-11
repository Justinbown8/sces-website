/**
 * Error Boundary component with analytics tracking
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { trackError } from '@/lib/analytics';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track error in analytics
    trackError(
      error.message || 'React Error Boundary',
      errorInfo.componentStack || 'unknown',
      'high'
    );

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use our custom ErrorFallback component
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: undefined })}
          title="Component Error"
          message="A component on this page encountered an error. Please try refreshing or navigate to another page."
          showContactInfo={false}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;