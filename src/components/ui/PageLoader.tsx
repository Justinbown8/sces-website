'use client';

import React from 'react';
import Logo from '@/components/ui/Logo';

interface PageLoaderProps {
  message?: string;
  showLogo?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
  showLogo = true,
  size = 'md',
  fullScreen = true
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          logo: 'lg',
          spinner: 'w-6 h-6',
          text: 'text-sm'
        };
      case 'md':
        return {
          container: 'p-8',
          logo: 'xl',
          spinner: 'w-8 h-8',
          text: 'text-base'
        };
      case 'lg':
        return {
          container: 'p-12',
          logo: '2xl',
          spinner: 'w-12 h-12',
          text: 'text-lg'
        };
      default:
        return {
          container: 'p-8',
          logo: 'xl',
          spinner: 'w-8 h-8',
          text: 'text-base'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className={`text-center ${sizeClasses.container}`}>
        
        {/* Logo */}
        {showLogo && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3">
              <Logo size={sizeClasses.logo as any} className="text-orange-500 animate-pulse" />
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900 font-heading">SCES</h2>
                <p className="text-sm text-gray-600">Sunrise Children Educational Society</p>
              </div>
            </div>
          </div>
        )}

        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className={`${sizeClasses.spinner} animate-spin`}>
            <svg
              className="w-full h-full text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>

        {/* Loading Message */}
        <p className={`text-gray-600 font-medium ${sizeClasses.text}`}>
          {message}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

      </div>
    </div>
  );
};

// Specialized loading components
export const DonationLoader: React.FC = () => (
  <PageLoader 
    message="Processing your generous donation..." 
    size="lg"
  />
);

export const VolunteerLoader: React.FC = () => (
  <PageLoader 
    message="Submitting your volunteer application..." 
    size="md"
  />
);

export const GalleryLoader: React.FC = () => (
  <PageLoader 
    message="Loading inspiring moments..." 
    size="md"
    fullScreen={false}
  />
);

export const PageTransitionLoader: React.FC = () => (
  <PageLoader 
    message="Loading page..." 
    size="sm"
  />
);

export default PageLoader;