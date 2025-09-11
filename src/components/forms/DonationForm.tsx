'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useScreenReader, useFormAccessibility } from '@/hooks/useAccessibility';
import { validateEmail, validateRequired, validateDonationAmount } from '@/lib/validations';
import { 
  PaymentStatusTracker, 
  getPaymentErrorMessage,
  formatCurrency,
  convertCurrency 
} from '@/lib/payment';
import PayPalButton from '@/components/payment/PayPalButton';

interface PayPalCaptureData {
  success: boolean;
  transactionId: string;
  amount: {
    value: string;
    currency: string;
  };
  status: string;
  captureTime: string;
  donor: {
    name: string;
    email: string;
  };
  recurring: boolean;
  frequency?: string;
}

interface PayPalError {
  message: string;
  originalError?: unknown;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    code?: string;
    description?: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open(): void;
        on(event: string, callback: (response: RazorpayError) => void): void;
      };
    };
  }
}
import { PAYMENT_CONFIG, DONATION_PRESETS, SUPPORTED_PAYMENT_METHODS } from '@/config/payment';

interface FormErrors {
  amount?: string;
  name?: string;
  email?: string;
  phone?: string;
  payment?: string;
}

interface DonationFormState {
  step: number;
  amount: number;
  customAmount: string;
  recurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  donor: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
}

interface PaymentStatus {
  status: 'idle' | 'processing' | 'success' | 'failed' | 'retry';
  message?: string;
  transactionId?: string;
  retryCount?: number;
}

const TOTAL_STEPS = 3;
const MAX_RETRY_ATTEMPTS = PAYMENT_CONFIG.limits.maxRetries;

export default function DonationForm() {
  const [formState, setFormState] = useState<DonationFormState>({
    step: 1,
    amount: 0,
    customAmount: '',
    recurring: false,
    frequency: 'monthly',
    donor: {
      name: '',
      email: '',
      phone: '',
    },
    paymentMethod: 'razorpay',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'idle' });
  const [paymentTracker] = useState(() => new PaymentStatusTracker());
  
  // Accessibility hooks
  const { announce } = useScreenReader();
  const { generateFieldId, createFieldProps } = useFormAccessibility();

  const updateFormState = (updates: Partial<DonationFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Validate amount
      const amount = formState.amount || parseFloat(formState.customAmount);
      const amountValidation = validateDonationAmount(amount);
      if (!amountValidation.isValid) {
        newErrors.amount = amountValidation.errors[0];
      }
    }

    if (step === 2) {
      // Validate donor information
      const nameValidation = validateRequired(formState.donor.name, 'Name');
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.errors[0];
      }

      const emailValidation = validateEmail(formState.donor.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.errors[0];
      }

      // Phone is optional but validate if provided
      if (formState.donor.phone) {
        const phoneValidation = validateRequired(formState.donor.phone, 'Phone');
        if (!phoneValidation.isValid) {
          newErrors.phone = phoneValidation.errors[0];
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(formState.step)) {
      updateFormState({ step: formState.step + 1 });
    }
  };

  const handlePrevious = () => {
    updateFormState({ step: formState.step - 1 });
    setErrors({});
    setPaymentStatus({ status: 'idle' });
  };

  const handleAmountSelect = (amount: number) => {
    updateFormState({ amount, customAmount: '' });
    setErrors({ ...errors, amount: undefined });
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    updateFormState({ customAmount: numericValue, amount: 0 });
    setErrors({ ...errors, amount: undefined });
  };

  const handleDonorInfoChange = (field: keyof DonationFormState['donor'], value: string) => {
    updateFormState({
      donor: { ...formState.donor, [field]: value }
    });
    setErrors({ ...errors, [field]: undefined });
  };

  const initializeRazorpay = (): Promise<typeof window.Razorpay | null> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(window.Razorpay);
      };
      script.onerror = () => {
        resolve(null);
      };
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount: number) => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `donation_${Date.now()}`,
          notes: {
            donor_name: formState.donor.name,
            donor_email: formState.donor.email,
            recurring: formState.recurring,
            frequency: formState.frequency,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (amount: number) => {
    try {
      setPaymentStatus({ status: 'processing', message: 'Initializing payment...' });
      
      const Razorpay = await initializeRazorpay();
      if (!Razorpay) {
        throw new Error('Razorpay SDK failed to load');
      }

      const order = await createRazorpayOrder(amount);

      const options = {
        key: PAYMENT_CONFIG.razorpay.keyId,
        amount: order.amount,
        currency: order.currency,
        name: PAYMENT_CONFIG.razorpay.name,
        description: `${PAYMENT_CONFIG.razorpay.description} - ${formState.recurring ? 'Recurring' : 'One-time'}`,
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            setPaymentStatus({ status: 'processing', message: 'Verifying payment...' });
            
            // Verify payment on server
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donor: formState.donor,
                amount,
                recurring: formState.recurring,
                frequency: formState.frequency,
              }),
            });

            if (verifyResponse.ok) {
              await verifyResponse.json();
              paymentTracker.addUpdate('success', 'Payment completed successfully', response.razorpay_payment_id);
              
              setPaymentStatus({
                status: 'success',
                message: 'Payment successful! Redirecting to confirmation page...',
                transactionId: response.razorpay_payment_id,
              });

              // Redirect to success page with donation details
              const successUrl = new URL('/donation-success', window.location.origin);
              successUrl.searchParams.set('transaction_id', response.razorpay_payment_id);
              successUrl.searchParams.set('amount', amount.toString());
              successUrl.searchParams.set('donor_name', formState.donor.name);
              successUrl.searchParams.set('donor_email', formState.donor.email);
              successUrl.searchParams.set('recurring', formState.recurring.toString());
              if (formState.recurring) {
                successUrl.searchParams.set('frequency', formState.frequency);
              }
              
              // Redirect after a short delay to show success message
              setTimeout(() => {
                window.location.href = successUrl.toString();
              }, 2000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus({
              status: 'failed',
              message: 'Payment verification failed. Please contact support.',
            });
          }
        },
        prefill: {
          name: formState.donor.name,
          email: formState.donor.email,
          contact: formState.donor.phone,
        },
        notes: {
          address: 'SCES Donation',
        },
        theme: PAYMENT_CONFIG.razorpay.theme,
        modal: {
          ondismiss: (): void => {
            setPaymentStatus({
              status: 'failed',
              message: 'Payment cancelled by user',
            });
          },
        },
      };

      const rzp = new Razorpay(options);
      
      rzp.on('payment.failed', (response: RazorpayError) => {
        console.error('Payment failed:', response.error);
        const errorMessage = getPaymentErrorMessage(response);
        paymentTracker.addUpdate('failed', errorMessage, undefined, response.error?.code);
        
        setPaymentStatus({
          status: 'failed',
          message: errorMessage,
        });
      });

      rzp.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      setPaymentStatus({
        status: 'failed',
        message: 'Failed to initialize payment. Please try again.',
      });
    }
  };

  const handleRetryPayment = () => {
    const currentRetryCount = paymentStatus.retryCount || 0;
    if (currentRetryCount < MAX_RETRY_ATTEMPTS) {
      setPaymentStatus({
        status: 'retry',
        retryCount: currentRetryCount + 1,
      });
      handleSubmit();
    } else {
      setPaymentStatus({
        status: 'failed',
        message: 'Maximum retry attempts reached. Please contact support.',
      });
    }
  };

  const handlePayPalSuccess = (transactionId: string) => {
    paymentTracker.addUpdate('success', 'PayPal payment completed successfully', transactionId);
    
    setPaymentStatus({
      status: 'success',
      message: 'PayPal payment successful! Redirecting to confirmation page...',
      transactionId: transactionId,
    });

    // Redirect to success page with donation details
    const successUrl = new URL('/donation-success', window.location.origin);
    successUrl.searchParams.set('transaction_id', transactionId);
    successUrl.searchParams.set('amount', (formState.amount || parseFloat(formState.customAmount)).toString());
    successUrl.searchParams.set('donor_name', formState.donor.name);
    successUrl.searchParams.set('donor_email', formState.donor.email);
    successUrl.searchParams.set('recurring', formState.recurring.toString());
    successUrl.searchParams.set('payment_method', 'paypal');
    if (formState.recurring) {
      successUrl.searchParams.set('frequency', formState.frequency);
    }
    
    // Redirect after a short delay to show success message
    setTimeout(() => {
      window.location.href = successUrl.toString();
    }, 2000);
  };

  const handlePayPalError = (error: PayPalError) => {
    console.error('PayPal payment error:', error);
    const errorMessage = getPaymentErrorMessage(error, 'paypal');
    paymentTracker.addUpdate('failed', errorMessage, undefined, error.originalError?.name);
    
    setPaymentStatus({
      status: 'failed',
      message: errorMessage,
    });
  };

  const handlePayPalCancel = () => {
    setPaymentStatus({
      status: 'failed',
      message: 'PayPal payment was cancelled',
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(formState.step)) return;

    // For PayPal, we don't need to handle submission here as PayPal button handles it
    if (formState.paymentMethod === 'paypal') {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const amount = formState.amount || parseFloat(formState.customAmount);
      
      if (formState.paymentMethod === 'razorpay') {
        await handleRazorpayPayment(amount);
      } else {
        setPaymentStatus({
          status: 'failed',
          message: 'Unsupported payment method selected.',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({
        status: 'failed',
        message: 'Payment failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === formState.step;
          const isCompleted = stepNumber < formState.step;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              {stepNumber < TOTAL_STEPS && (
                <div
                  className={`w-16 h-1 mx-2 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-700">
          Step {formState.step} of {TOTAL_STEPS}
        </span>
      </div>
    </div>
  );

  const renderAmountStep = () => (
    <Card className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Choose Your Donation Amount</h2>
      
      {/* Recurring Toggle */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => updateFormState({ recurring: false })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !formState.recurring
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => updateFormState({ recurring: true })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              formState.recurring
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Frequency Selection for Recurring */}
      {formState.recurring && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Frequency
          </label>
          <select
            value={formState.frequency}
            onChange={(e) => updateFormState({ frequency: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}

      {/* Preset Amounts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {DONATION_PRESETS.map((preset) => (
          <button
            key={preset.amount}
            type="button"
            onClick={() => handleAmountSelect(preset.amount)}
            className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-md ${
              formState.amount === preset.amount
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-900 bg-white'
            }`}
          >
            <div className="text-2xl font-bold">{formatCurrency(preset.amount)}</div>
            <div className="text-sm text-gray-700 mt-1">{preset.label}</div>
            <div className="text-xs text-gray-800 mt-1">{preset.description}</div>
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or enter custom amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">₹</span>
          <input
            type="text"
            value={formState.customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder="Enter amount"
            className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      {/* Impact Message */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Your Impact:</strong> ₹{(formState.amount || parseFloat(formState.customAmount) || 0).toLocaleString()} 
          {formState.recurring ? ` per ${formState.frequency.replace('ly', '')}` : ''} can help provide educational resources to children in need.
        </p>
      </div>

      <Button
        onClick={handleNext}
        className="w-full"
        disabled={!formState.amount && !formState.customAmount}
      >
        Continue to Donor Information
      </Button>
    </Card>
  );

  const renderDonorInfoStep = () => (
    <Card className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Donor Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formState.donor.name}
            onChange={(e) => handleDonorInfoChange('name', e.target.value)}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={formState.donor.email}
            onChange={(e) => handleDonorInfoChange('email', e.target.value)}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={formState.donor.phone}
            onChange={(e) => handleDonorInfoChange('phone', e.target.value)}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Donation Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Donation Summary</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Amount:</span>
          <span className="font-semibold text-gray-900">₹{(formState.amount || parseFloat(formState.customAmount) || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Type:</span>
          <span className="font-semibold text-gray-900">
            {formState.recurring ? `Recurring (${formState.frequency})` : 'One-time'}
          </span>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
        >
          Continue to Payment
        </Button>
      </div>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Payment Method</h2>
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Payment Method
        </label>
        <div className="space-y-3">
          {SUPPORTED_PAYMENT_METHODS.map((method) => {
            const amount = formState.amount || parseFloat(formState.customAmount) || 0;
            const showCurrencyInfo = method.id === 'paypal' && amount > 0;
            const usdAmount = showCurrencyInfo ? convertCurrency(amount, 'INR', 'USD') : 0;
            
            return (
              <label 
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  formState.paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={formState.paymentMethod === method.id}
                  onChange={(e) => updateFormState({ paymentMethod: e.target.value })}
                  disabled={!method.enabled}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-700">{method.description}</div>
                  {showCurrencyInfo && (
                    <div className="text-xs text-blue-600 mt-1">
                      Amount will be converted to ${usdAmount.toFixed(2)} USD
                    </div>
                  )}
                </div>
                {method.recommended && method.enabled && (
                  <div className="text-xs text-green-600 font-medium">Recommended</div>
                )}
                {!method.enabled && (
                  <div className="text-xs text-gray-800">Coming Soon</div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus.status !== 'idle' && (
        <div className="mb-6">
          {paymentStatus.status === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-800">{paymentStatus.message}</span>
              </div>
            </div>
          )}
          
          {paymentStatus.status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800">
                <div className="font-semibold">✓ {paymentStatus.message}</div>
                {paymentStatus.transactionId && (
                  <div className="text-sm mt-1">Transaction ID: {paymentStatus.transactionId}</div>
                )}
              </div>
            </div>
          )}
          
          {paymentStatus.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">
                <div className="font-semibold">✗ {paymentStatus.message}</div>
                {paymentStatus.retryCount && paymentStatus.retryCount < MAX_RETRY_ATTEMPTS && (
                  <button
                    onClick={handleRetryPayment}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    Try Again ({MAX_RETRY_ATTEMPTS - paymentStatus.retryCount} attempts left)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Donation Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Final Summary</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Amount:</span>
            <span className="font-semibold text-gray-900">₹{(formState.amount || parseFloat(formState.customAmount) || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Type:</span>
            <span className="text-gray-900">{formState.recurring ? `Recurring (${formState.frequency})` : 'One-time'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Donor:</span>
            <span className="text-gray-900">{formState.donor.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Email:</span>
            <span className="text-gray-900">{formState.donor.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Payment Method:</span>
            <span className="capitalize text-gray-900">{formState.paymentMethod}</span>
          </div>
        </div>
      </div>

      {errors.payment && (
        <div className="mb-4 text-sm text-red-600 text-center">
          {errors.payment}
        </div>
      )}

      {/* Payment Buttons */}
      <div className="space-y-4">
        {formState.paymentMethod === 'razorpay' && (
          <Button
            onClick={handleSubmit}
            className="w-full"
            loading={isLoading || paymentStatus.status === 'processing'}
            disabled={paymentStatus.status === 'success'}
          >
            {paymentStatus.status === 'success' 
              ? 'Payment Complete' 
              : isLoading || paymentStatus.status === 'processing'
              ? 'Processing...' 
              : 'Pay with Razorpay'
            }
          </Button>
        )}

        {formState.paymentMethod === 'paypal' && (
          <div className="relative">
            <PayPalButton
              amount={formState.amount || parseFloat(formState.customAmount) || 0}
              currency="INR"
              donor={formState.donor}
              recurring={formState.recurring}
              frequency={formState.frequency}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
              onCancel={handlePayPalCancel}
              disabled={paymentStatus.status === 'success' || paymentStatus.status === 'processing'}
            />
          </div>
        )}

        <Button
          variant="outline"
          onClick={handlePrevious}
          className="w-full"
          disabled={paymentStatus.status === 'processing'}
        >
          Back to Donor Information
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="py-8">
      {renderProgressIndicator()}
      
      {formState.step === 1 && renderAmountStep()}
      {formState.step === 2 && renderDonorInfoStep()}
      {formState.step === 3 && renderPaymentStep()}
    </div>
  );
}