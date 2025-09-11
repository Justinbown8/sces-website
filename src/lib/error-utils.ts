/**
 * Error handling utilities for the SCES website
 */

export interface ErrorInfo {
  message: string;
  code?: string;
  context?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  userId?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Common error codes used throughout the application
 */
export const ERROR_CODES = {
  // Payment errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_CANCELLED: 'PAYMENT_CANCELLED',
  PAYMENT_TIMEOUT: 'PAYMENT_TIMEOUT',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  
  // Form errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PHONE: 'INVALID_PHONE',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Content errors
  NOT_FOUND: 'NOT_FOUND',
  CONTENT_LOAD_ERROR: 'CONTENT_LOAD_ERROR',
  IMAGE_LOAD_ERROR: 'IMAGE_LOAD_ERROR',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
} as const;

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.PAYMENT_FAILED]: 'Payment processing failed. Please try again or use a different payment method.',
  [ERROR_CODES.PAYMENT_CANCELLED]: 'Payment was cancelled. You can try again when ready.',
  [ERROR_CODES.PAYMENT_TIMEOUT]: 'Payment timed out. Please try again.',
  [ERROR_CODES.INVALID_AMOUNT]: 'Please enter a valid donation amount.',
  
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.REQUIRED_FIELD]: 'This field is required.',
  [ERROR_CODES.INVALID_EMAIL]: 'Please enter a valid email address.',
  [ERROR_CODES.INVALID_PHONE]: 'Please enter a valid phone number.',
  
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ERROR_CODES.FORBIDDEN]: 'Access denied.',
  
  [ERROR_CODES.NOT_FOUND]: 'The requested content was not found.',
  [ERROR_CODES.CONTENT_LOAD_ERROR]: 'Failed to load content. Please refresh the page.',
  [ERROR_CODES.IMAGE_LOAD_ERROR]: 'Failed to load image.',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.CLIENT_ERROR]: 'A client error occurred. Please refresh the page.',
} as const;

/**
 * Create a standardized error object
 */
export function createError(
  message: string,
  code?: keyof typeof ERROR_CODES,
  context?: string,
  details?: any
): ErrorInfo {
  return {
    message,
    code,
    context,
    details,
    timestamp: new Date(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: Error | ErrorInfo | string, fallback?: string): string {
  if (typeof error === 'string') {
    return error;
  }

  if ('code' in error && error.code && error.code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES];
  }

  if ('message' in error && error.message) {
    return error.message;
  }

  return fallback || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.name === 'NetworkError' ||
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('connection')
  );
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: Error): boolean {
  return (
    error.name === 'TimeoutError' ||
    error.message.includes('timeout') ||
    error.message.includes('timed out')
  );
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: Error | any): boolean {
  return (
    error.name === 'ValidationError' ||
    error.code === ERROR_CODES.VALIDATION_ERROR ||
    error.message.includes('validation')
  );
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Don't retry validation errors
      if (isValidationError(error)) {
        throw lastError;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Safe async function wrapper
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.error('Safe async error:', error);
    return fallback;
  }
}

/**
 * Create API response helpers
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(
  message: string,
  code?: string,
  details?: any
): ErrorResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
  };
}

/**
 * Type guard for API responses
 */
export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return !response.success;
}

export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success;
}

/**
 * Log error to external service (placeholder)
 */
export function logErrorToService(error: ErrorInfo): void {
  // In a real application, this would send to an error tracking service
  // like Sentry, LogRocket, or a custom logging endpoint
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', error);
  }
  
  // Example: Send to external service
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(error),
  // }).catch(() => {
  //   // Silently fail if logging fails
  // });
}