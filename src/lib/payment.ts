// Payment utility functions and error handling

export interface PaymentError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
}

export interface PaymentRetryConfig {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
}

export const DEFAULT_RETRY_CONFIG: PaymentRetryConfig = {
  maxAttempts: 3,
  backoffMultiplier: 2,
  initialDelay: 1000, // 1 second
};

// PayPal error codes and user-friendly messages
export const PAYPAL_ERROR_MESSAGES: Record<string, string> = {
  'PAYMENT_AUTHORIZATION_VOIDED': 'Payment authorization was cancelled. Please try again.',
  'PAYMENT_CAPTURE_FAILED': 'Payment capture failed. Please try again.',
  'PAYMENT_CAPTURE_PENDING': 'Payment is being processed. Please wait.',
  'PAYMENT_DENIED': 'Payment was denied. Please try a different payment method.',
  'PAYMENT_NOT_APPROVED_FOR_EXECUTION': 'Payment was not approved. Please try again.',
  'PAYMENT_REQUEST_ID_REQUIRED': 'Payment request failed. Please try again.',
  'PAYMENT_STATE_INVALID': 'Invalid payment state. Please start over.',
  'PAYER_ACCOUNT_LOCKED_OR_CLOSED': 'PayPal account is locked or closed. Please use a different account.',
  'PAYER_ACCOUNT_RESTRICTED': 'PayPal account is restricted. Please contact PayPal support.',
  'PAYER_CANNOT_PAY': 'Unable to process payment with this PayPal account.',
  'PAYER_ID_MISSING_FOR_CARD_TOKEN': 'PayPal authentication failed. Please try again.',
  'PAYEE_ACCOUNT_INVALID': 'Merchant account error. Please contact support.',
  'PAYEE_ACCOUNT_LOCKED_OR_CLOSED': 'Merchant account issue. Please contact support.',
  'PAYEE_ACCOUNT_RESTRICTED': 'Merchant account restricted. Please contact support.',
  'TRANSACTION_LIMIT_EXCEEDED': 'Transaction limit exceeded. Please try with a smaller amount.',
  'TRANSACTION_RECEIVING_LIMIT_EXCEEDED': 'Receiving limit exceeded. Please contact support.',
  'TRANSACTION_SENDING_LIMIT_EXCEEDED': 'Sending limit exceeded. Please try with a smaller amount.',
  'INSUFFICIENT_FUNDS': 'Insufficient funds in PayPal account. Please add funds or use a different payment method.',
  'INVALID_ACCOUNT_NUMBER': 'Invalid PayPal account. Please check your account details.',
  'CURRENCY_NOT_SUPPORTED': 'Currency not supported. Please contact support.',
  'DUPLICATE_INVOICE_ID': 'Duplicate transaction detected. Please try again.',
  'INSTRUMENT_DECLINED': 'Payment method declined. Please try a different payment method.',
  'MAX_NUMBER_OF_PAYMENT_ATTEMPTS_EXCEEDED': 'Too many payment attempts. Please try again later.',
  'PAYPAL_REQUEST_ID_REQUIRED': 'PayPal request failed. Please try again.',
  'PERMISSION_DENIED': 'Permission denied. Please contact support.',
  'VALIDATION_ERROR': 'Payment validation failed. Please check your details.',
};

// Razorpay error codes and user-friendly messages
export const RAZORPAY_ERROR_MESSAGES: Record<string, string> = {
  'BAD_REQUEST_ERROR': 'Invalid payment request. Please check your details and try again.',
  'GATEWAY_ERROR': 'Payment gateway is temporarily unavailable. Please try again.',
  'NETWORK_ERROR': 'Network connection issue. Please check your internet and try again.',
  'SERVER_ERROR': 'Payment server error. Please try again later.',
  'PAYMENT_CANCELLED': 'Payment was cancelled. You can try again when ready.',
  'PAYMENT_FAILED': 'Payment failed. Please check your payment method and try again.',
  'INSUFFICIENT_FUNDS': 'Insufficient funds in your account. Please try a different payment method.',
  'CARD_DECLINED': 'Your card was declined. Please try a different card or payment method.',
  'INVALID_CARD': 'Invalid card details. Please check your card information.',
  'EXPIRED_CARD': 'Your card has expired. Please use a different card.',
  'AUTHENTICATION_FAILED': 'Payment authentication failed. Please try again.',
  'LIMIT_EXCEEDED': 'Transaction limit exceeded. Please try with a smaller amount or different method.',
};

export function getPaymentErrorMessage(error: unknown, paymentMethod: 'razorpay' | 'paypal' = 'razorpay'): string {
  if (!error) return 'An unknown payment error occurred.';
  
  const errorObj = error as Record<string, unknown>;
  
  // Handle PayPal specific errors
  if (paymentMethod === 'paypal') {
    // PayPal SDK errors
    if (errorObj.details && Array.isArray(errorObj.details)) {
      const detail = errorObj.details[0] as Record<string, unknown>;
      if (detail && detail.issue) {
        return PAYPAL_ERROR_MESSAGES[detail.issue as string] || (detail.description as string) || 'PayPal payment failed. Please try again.';
      }
    }
    
    // PayPal error codes
    if (errorObj.name || errorObj.code) {
      const errorCode = (errorObj.name || errorObj.code) as string;
      return PAYPAL_ERROR_MESSAGES[errorCode] || (errorObj.message as string) || 'PayPal payment failed. Please try again.';
    }
    
    // PayPal order errors
    if (errorObj.error && typeof errorObj.error === 'object' && errorObj.error !== null) {
      const nestedError = errorObj.error as Record<string, unknown>;
      if (nestedError.name) {
        return PAYPAL_ERROR_MESSAGES[nestedError.name as string] || (nestedError.message as string) || 'PayPal payment failed. Please try again.';
      }
    }
  }
  
  // Handle Razorpay specific errors
  if (errorObj.error && typeof errorObj.error === 'object' && errorObj.error !== null) {
    const razorpayError = errorObj.error as Record<string, unknown>;
    if (razorpayError.code) {
      const errorCode = razorpayError.code as string;
      return RAZORPAY_ERROR_MESSAGES[errorCode] || (razorpayError.description as string) || 'Payment failed. Please try again.';
    }
  }
  
  // Handle network errors
  if (errorObj.message && typeof errorObj.message === 'string' && errorObj.message.includes('network')) {
    return 'Network connection issue. Please check your internet and try again.';
  }
  
  // Handle timeout errors
  if (errorObj.message && typeof errorObj.message === 'string' && errorObj.message.includes('timeout')) {
    return 'Payment request timed out. Please try again.';
  }
  
  // Default error message
  return (errorObj.message as string) || 'Payment failed. Please try again.';
}

export function shouldRetryPayment(error: unknown, currentAttempt: number, maxAttempts: number, paymentMethod: 'razorpay' | 'paypal' = 'razorpay'): boolean {
  if (currentAttempt >= maxAttempts) return false;
  
  const errorObj = error as Record<string, unknown>;
  
  if (paymentMethod === 'paypal') {
    // Don't retry for PayPal user-cancelled payments
    if (errorObj.name === 'PAYMENT_AUTHORIZATION_VOIDED' || errorObj.name === 'PAYMENT_DENIED') return false;
    
    // Don't retry for account issues
    if (errorObj.name && typeof errorObj.name === 'string' && ['PAYER_ACCOUNT_LOCKED_OR_CLOSED', 'PAYER_ACCOUNT_RESTRICTED', 'PAYEE_ACCOUNT_INVALID'].includes(errorObj.name)) return false;
    
    // Don't retry for validation errors
    if (errorObj.name === 'VALIDATION_ERROR' || errorObj.name === 'INVALID_ACCOUNT_NUMBER') return false;
    
    // Don't retry for limit exceeded errors
    if (errorObj.name && typeof errorObj.name === 'string' && errorObj.name.includes('LIMIT_EXCEEDED')) return false;
    
    // Retry for temporary issues
    if (errorObj.name === 'PAYMENT_CAPTURE_PENDING') return true;
    
    // Retry for network issues
    if (errorObj.message && typeof errorObj.message === 'string' && (errorObj.message.includes('network') || errorObj.message.includes('timeout'))) return true;
    
    return false;
  }
  
  // Razorpay retry logic
  if (errorObj.error && typeof errorObj.error === 'object' && errorObj.error !== null) {
    const razorpayError = errorObj.error as Record<string, unknown>;
    
    // Don't retry for user-cancelled payments
    if (razorpayError.code === 'PAYMENT_CANCELLED') return false;
    
    // Don't retry for authentication failures
    if (razorpayError.code === 'AUTHENTICATION_FAILED') return false;
    
    // Don't retry for invalid card details
    if (razorpayError.code && ['INVALID_CARD', 'EXPIRED_CARD', 'CARD_DECLINED'].includes(razorpayError.code as string)) return false;
    
    // Retry for network, gateway, and server errors
    if (razorpayError.code && ['NETWORK_ERROR', 'GATEWAY_ERROR', 'SERVER_ERROR'].includes(razorpayError.code as string)) return true;
  }
  
  // Retry for timeout errors
  if (errorObj.message && typeof errorObj.message === 'string' && errorObj.message.includes('timeout')) return true;
  
  return false;
}

export function calculateRetryDelay(attempt: number, config: PaymentRetryConfig = DEFAULT_RETRY_CONFIG): number {
  return config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Payment status tracking
export interface PaymentStatusUpdate {
  status: 'initiated' | 'processing' | 'success' | 'failed' | 'cancelled';
  timestamp: string;
  message?: string;
  transactionId?: string;
  errorCode?: string;
}

export class PaymentStatusTracker {
  private updates: PaymentStatusUpdate[] = [];
  
  addUpdate(status: PaymentStatusUpdate['status'], message?: string, transactionId?: string, errorCode?: string) {
    this.updates.push({
      status,
      timestamp: new Date().toISOString(),
      message,
      transactionId,
      errorCode,
    });
  }
  
  getCurrentStatus(): PaymentStatusUpdate | null {
    return this.updates.length > 0 ? this.updates[this.updates.length - 1] : null;
  }
  
  getHistory(): PaymentStatusUpdate[] {
    return [...this.updates];
  }
  
  isCompleted(): boolean {
    const current = this.getCurrentStatus();
    return current ? ['success', 'failed', 'cancelled'].includes(current.status) : false;
  }
  
  isSuccessful(): boolean {
    const current = this.getCurrentStatus();
    return current?.status === 'success';
  }
}

// Validation functions for payment data
export function validatePaymentAmount(amount: number): { isValid: boolean; error?: string } {
  if (!amount || isNaN(amount)) {
    return { isValid: false, error: 'Amount is required' };
  }
  
  if (amount < 1) {
    return { isValid: false, error: 'Minimum donation amount is ₹1' };
  }
  
  if (amount > 500000) {
    return { isValid: false, error: 'Maximum donation amount is ₹5,00,000' };
  }
  
  return { isValid: true };
}

export function validateDonorInfo(donor: { name: string; email: string; phone?: string }): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!donor.name || donor.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!donor.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (donor.phone && !/^[+]?[\d\s\-\(\)]{10,15}$/.test(donor.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Currency conversion (approximate rates - in production, use real-time rates)
export const CURRENCY_RATES = {
  INR_TO_USD: 0.012, // 1 INR = 0.012 USD (approximate)
  USD_TO_INR: 83.33, // 1 USD = 83.33 INR (approximate)
} as const;

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return Math.round((amount * CURRENCY_RATES.INR_TO_USD) * 100) / 100; // Round to 2 decimal places
  }
  
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return Math.round(amount * CURRENCY_RATES.USD_TO_INR);
  }
  
  return amount;
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Generate receipt number
export function generateReceiptNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SCES${timestamp}${random}`;
}