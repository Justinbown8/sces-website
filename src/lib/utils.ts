import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conditional classes and resolves conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to create consistent focus ring styles
 */
export function focusRing(className?: string) {
  return cn(
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-button-blue focus-visible:ring-offset-2',
    className
  );
}

/**
 * Utility function for consistent hover transitions
 */
export function hoverTransition(className?: string) {
  return cn('transition-all duration-200 ease-in-out', className);
}

/**
 * Utility function for gradient backgrounds
 */
export function gradientPrimary(className?: string) {
  return cn('gradient-primary', className);
}

export function gradientButton(className?: string) {
  return cn('gradient-button', className);
}

/**
 * Utility function for consistent shadow styles
 */
export function cardShadow(variant: 'sm' | 'md' | 'lg' = 'md') {
  const shadows = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  return shadows[variant];
}

/**
 * Utility function for responsive text sizes
 */
export function responsiveText(
  mobile: string,
  tablet?: string,
  desktop?: string
) {
  return cn(
    mobile,
    tablet && `md:${tablet}`,
    desktop && `lg:${desktop}`
  );
}

/**
 * Utility function for consistent spacing
 */
export function spacing(size: keyof typeof spacingMap) {
  return spacingMap[size];
}

const spacingMap = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const;

/**
 * Utility function for consistent border radius
 */
export function rounded(size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md') {
  const radiusMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  return radiusMap[size];
}

/**
 * Utility function for consistent button styles
 */
export function buttonBase(className?: string) {
  return cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    focusRing(),
    className
  );
}

/**
 * Utility function for consistent card styles
 */
export function cardBase(className?: string) {
  return cn(
    'bg-white border border-gray-200 rounded-lg',
    cardShadow('md'),
    'transition-shadow duration-200 hover:shadow-lg',
    className
  );
}

/**
 * Utility function for screen reader only content
 */
export function srOnly() {
  return 'sr-only';
}

/**
 * Utility function for consistent container styles
 */
export function container(className?: string) {
  return cn(
    'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
    className
  );
}

/**
 * Utility function for consistent section spacing
 */
export function sectionSpacing(className?: string) {
  return cn('py-12 md:py-16 lg:py-20', className);
}