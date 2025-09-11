'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Logo from '@/components/ui/Logo';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showContactInfo?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.",
  showContactInfo = true
}) => {
  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        
        {/* Logo and Branding */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <Logo size="xl" className="text-orange-500" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900 font-heading">SCES</h2>
              <p className="text-sm text-gray-600">Sunrise Children Educational Society</p>
            </div>
          </div>
        </div>

        <Card className="p-8 md:p-12">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              {title}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-red-800 mb-2">
                Error Details (Development Mode)
              </h3>
              <p className="text-sm text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-red-700 cursor-pointer hover:text-red-800">
                    Stack Trace
                  </summary>
                  <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="font-semibold"
                onClick={handleRefresh}
              >
                Try Again
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="font-semibold"
                asChild
              >
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">
              Continue Your Journey
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <Link
                href="/donate"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Make a Donation
              </Link>
              <Link
                href="/volunteer"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Volunteer
              </Link>
              <Link
                href="/gallery"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Photo Gallery
              </Link>
              <Link
                href="/impact"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Our Impact
              </Link>
              <Link
                href="/staff"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Meet Our Team
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          {showContactInfo && (
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If this problem persists, please contact our support team:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a
                  href="tel:09953665620"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 focus:outline-none focus:text-orange-700"
                >
                  📞 099536 65620
                </a>
                <a
                  href="mailto:info@sces.org.in"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 focus:outline-none focus:text-orange-700"
                >
                  ✉️ info@sces.org.in
                </a>
              </div>
            </div>
          )}

        </Card>

        {/* Inspirational Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 italic">
            "Even when things go wrong, our commitment to children's education remains strong."
          </p>
        </div>

      </div>
    </div>
  );
};

export default ErrorFallback;