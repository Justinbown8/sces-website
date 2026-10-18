'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useScreenReader, useFormAccessibility } from '@/hooks/useAccessibility';
import { validateEmail, validateRequired, validateDonationAmount } from '@/lib/validations';
import { PaymentStatusTracker, getPaymentErrorMessage, formatCurrency } from '@/lib/payment';
import { DONATION_TIERS } from '@/config/donation';

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
  notes: Record<string, string>;
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

const TOTAL_STEPS = 3;
const MAX_RETRY_ATTEMPTS = 3;
const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

interface FormErrors {
  amount?: string;
  name?: string;
  email?: string;
  phone?: string;
  pan?: string;
  pincode?: string;
  payment?: string;
}

interface FormState {
  step: number;
  amount: number;
  customAmount: string;
  recurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  donor: {
    name: string;
    email: string;
    phone: string;
    pan: string;
    address: string;
    city: string;
    pincode: string;
  };
  wants80G: boolean;
  wantsUpdates: boolean;
}

interface PaymentStatus {
  status: 'idle' | 'processing' | 'success' | 'failed';
  message?: string;
  transactionId?: string;
  retryCount?: number;
}

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

function initialFormState(defaultAmount?: number, defaultRecurring?: boolean): FormState {
  const preset = defaultAmount && defaultAmount >= 100 ? defaultAmount : 1000;
  return {
    step: 1,
    amount: preset,
    customAmount: '',
    recurring: Boolean(defaultRecurring),
    frequency: 'monthly',
    donor: {
      name: '',
      email: '',
      phone: '',
      pan: '',
      address: '',
      city: '',
      pincode: '',
    },
    wants80G: false,
    wantsUpdates: false,
  };
}

interface DonationFormProps {
  defaultAmount?: number;
  defaultRecurring?: boolean;
}

export default function DonationForm({ defaultAmount, defaultRecurring }: DonationFormProps = {}) {
  const [formState, setFormState] = useState<FormState>(() =>
    initialFormState(defaultAmount, defaultRecurring)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'idle' });
  const [paymentTracker] = useState(() => new PaymentStatusTracker());

  const { announce } = useScreenReader();

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const currentAmount = useMemo(() => {
    const parsed = Number(formState.customAmount);
    return formState.customAmount && Number.isFinite(parsed) && parsed > 0 ? parsed : formState.amount;
  }, [formState.amount, formState.customAmount]);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      const amountValidation = validateDonationAmount(currentAmount);
      if (!amountValidation.isValid) {
        newErrors.amount = amountValidation.errors[0];
      }
    }

    if (step === 2) {
      const nameValidation = validateRequired(formState.donor.name, 'Name');
      if (!nameValidation.isValid) newErrors.name = nameValidation.errors[0];

      const emailValidation = validateEmail(formState.donor.email);
      if (!emailValidation.isValid) newErrors.email = emailValidation.errors[0];

      if (formState.wants80G) {
        if (!formState.donor.pan) {
          newErrors.pan = 'PAN is required to issue your 80G certificate.';
        } else if (!PAN_PATTERN.test(formState.donor.pan.toUpperCase())) {
          newErrors.pan = 'Enter a valid 10-character PAN, for example ABCDE1234F.';
        }
        if (!formState.donor.address.trim()) {
          newErrors.pincode = 'Address is required for the 80G certificate.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(formState.step)) {
      updateFormState({ step: formState.step + 1 });
      announce(`Step ${formState.step + 1} of ${TOTAL_STEPS}`);
    }
  };

  const handlePrevious = () => {
    updateFormState({ step: formState.step - 1 });
    setErrors({});
    setPaymentStatus({ status: 'idle' });
  };

  const initializeRazorpay = (): Promise<typeof window.Razorpay | null> => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return Promise.resolve(window.Razorpay);
    }
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => resolve(null);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (amount: number) => {
    try {
      setPaymentStatus({ status: 'processing', message: 'Opening secure payment window...' });

      const Razorpay = await initializeRazorpay();
      if (!Razorpay) {
        throw new Error('Payment window could not load. Please check your connection.');
      }

      const orderResponse = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });

      const order = await orderResponse.json();
      if (!orderResponse.ok || !order.success) {
        throw new Error(order?.message || 'Could not start the payment.');
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'Sunrise Children Educational Society',
        description: `Donation - ${formState.recurring ? 'Recurring' : 'One-time'}`,
        order_id: order.order_id,
        handler: async (response: RazorpayResponse) => {
          try {
            setPaymentStatus({ status: 'processing', message: 'Confirming your payment...' });

            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                amount,
                recurring: formState.recurring,
                frequency: formState.frequency,
                donor: {
                  name: formState.donor.name,
                  email: formState.donor.email,
                  phone: formState.donor.phone,
                  pan: formState.wants80G ? formState.donor.pan.toUpperCase() : '',
                  address: formState.donor.address,
                  city: formState.donor.city,
                  pincode: formState.donor.pincode,
                  wants80G: formState.wants80G,
                },
              }),
            });

            const verification = await verifyResponse.json();

            if (!verifyResponse.ok || !verification.success) {
              // The money may still have been captured, so give the donor a
              // reference number instead of a dead end.
              setPaymentStatus({
                status: 'failed',
                message:
                  verification?.message ||
                  `We could not confirm this payment. Please email info@scesindia.com with reference ${response.razorpay_payment_id}.`,
              });
              return;
            }

            paymentTracker.addUpdate('success', 'Payment completed', response.razorpay_payment_id);

            setPaymentStatus({
              status: 'success',
              message: 'Thank you. Your donation is confirmed.',
              transactionId: response.razorpay_payment_id,
            });

            const successUrl = new URL('/donation-success', window.location.origin);
            successUrl.searchParams.set('token', verification.confirmationToken);
            successUrl.searchParams.set('payment_id', response.razorpay_payment_id);
            successUrl.searchParams.set('amount', String(verification.amount ?? amount));
            successUrl.searchParams.set('recurring', String(formState.recurring));
            if (formState.recurring) {
              successUrl.searchParams.set('frequency', formState.frequency);
            }

            setTimeout(() => {
              window.location.href = successUrl.toString();
            }, 1200);
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus({
              status: 'failed',
              message: `We could not confirm this payment. Please email info@scesindia.com with reference ${response.razorpay_payment_id}.`,
            });
          }
        },
        prefill: {
          name: formState.donor.name,
          email: formState.donor.email,
          contact: formState.donor.phone,
        },
        notes: {
          cause: 'Children education',
          wants80G: formState.wants80G ? 'yes' : 'no',
        },
        theme: { color: '#EA580C' },
        modal: {
          ondismiss: () => {
            setPaymentStatus({
              status: 'failed',
              message: 'Payment window closed. No money was deducted.',
            });
          },
        },
      };

      const rzp = new Razorpay(options);

      rzp.on('payment.failed', (response: RazorpayError) => {
        const errorMessage = getPaymentErrorMessage(response);
        paymentTracker.addUpdate('failed', errorMessage, undefined, response.error?.code);
        setPaymentStatus({ status: 'failed', message: errorMessage });
      });

      rzp.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      setPaymentStatus({
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment could not start. Please try again.',
      });
    }
  };

  const handleRetryPayment = () => {
    const currentRetryCount = paymentStatus.retryCount || 0;
    if (currentRetryCount < MAX_RETRY_ATTEMPTS) {
      setPaymentStatus({ status: 'idle', retryCount: currentRetryCount + 1 });
      void handleRazorpayPayment(currentAmount);
    } else {
      setPaymentStatus({
        status: 'failed',
        message: 'Please email info@scesindia.com and we will help you complete this donation.',
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(formState.step)) return;
    setIsLoading(true);
    setErrors({});

    try {
      await handleRazorpayPayment(currentAmount);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({ status: 'failed', message: 'Payment failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressIndicator = () => (
    <div className="mb-8">
      <ol className="flex items-center justify-center gap-2" aria-label="Donation progress">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === formState.step;
          const isCompleted = stepNumber < formState.step;
          return (
            <li key={stepNumber} className="flex items-center">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? '✓' : stepNumber}
              </span>
              {stepNumber < TOTAL_STEPS && (
                <span
                  aria-hidden="true"
                  className={`mx-2 h-1 w-10 sm:w-16 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-center text-sm text-gray-700">
        Step {formState.step} of {TOTAL_STEPS}
      </p>
    </div>
  );

  const renderAmountStep = () => (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Choose your donation amount</h2>

      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-1" role="group" aria-label="Donation frequency">
          <button
            type="button"
            onClick={() => updateFormState({ recurring: false })}
            aria-pressed={!formState.recurring}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              !formState.recurring ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700'
            }`}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => updateFormState({ recurring: true })}
            aria-pressed={formState.recurring}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              formState.recurring ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {formState.recurring && (
        <div className="mb-6">
          <label htmlFor="frequency" className="mb-2 block text-sm font-medium text-gray-700">
            Donation frequency
          </label>
          <select
            id="frequency"
            value={formState.frequency}
            onChange={(event) =>
              updateFormState({ frequency: event.target.value as FormState['frequency'] })
            }
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {PRESET_AMOUNTS.map((preset) => {
          const tier = DONATION_TIERS.find((entry) => entry.amount === preset);
          const isActive = !formState.customAmount && formState.amount === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => updateFormState({ amount: preset, customAmount: '' })}
              aria-pressed={isActive}
              className={`rounded-lg border-2 p-4 text-center transition-all hover:shadow-md ${
                isActive
                  ? 'border-orange-500 bg-orange-50 text-orange-800'
                  : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="block text-2xl font-bold">{formatCurrency(preset)}</span>
              <span className="mt-1 block text-sm font-semibold">{tier?.title ?? 'Custom impact'}</span>
              {tier && <span className="mt-1 block text-xs text-gray-700">{tier.description}</span>}
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <label htmlFor="donation-amount" className="mb-2 block text-sm font-medium text-gray-700">
          Or enter a custom amount (₹)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">₹</span>
          <input
            id="donation-amount"
            type="text"
            inputMode="numeric"
            value={formState.customAmount}
            onChange={(event) => {
              updateFormState({ customAmount: event.target.value.replace(/[^0-9]/g, '') });
              setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            placeholder="Enter amount above ₹100"
            aria-invalid={Boolean(errors.amount)}
            className={`w-full rounded-lg border py-3 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">
          <strong>Your impact:</strong> {formatCurrency(currentAmount)}
          {formState.recurring ? ` per ${formState.frequency.replace('ly', '')}` : ''} goes directly to
          children&apos;s education in Delhi. 65% funds classrooms and school kits, 15% trains teachers.
        </p>
      </div>

      <Button onClick={handleNext} className="w-full" disabled={!currentAmount || currentAmount < 100}>
        Continue
      </Button>
    </Card>
  );

  const renderDonorInfoStep = () => (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Your details</h2>
      <p className="mb-6 text-center text-sm text-gray-600">
        We only ask for what is needed to send your receipt. It takes about 30 seconds.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="donor-name" className="mb-1 block text-sm font-medium text-gray-700">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            id="donor-name"
            type="text"
            autoComplete="name"
            value={formState.donor.name}
            onChange={(event) => {
              updateFormState({ donor: { ...formState.donor, name: event.target.value } });
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            className={`w-full rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Name as you want it on the receipt"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="donor-email" className="mb-1 block text-sm font-medium text-gray-700">
            Email address <span className="text-red-600">*</span>
          </label>
          <input
            id="donor-email"
            type="email"
            autoComplete="email"
            value={formState.donor.email}
            onChange={(event) => {
              updateFormState({ donor: { ...formState.donor, email: event.target.value } });
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="email-help"
            className={`w-full rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your receipt is emailed here"
          />
          <p id="email-help" className="mt-1 text-xs text-gray-500">
            Your 80G receipt arrives here within 7 working days.
          </p>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="donor-phone" className="mb-1 block text-sm font-medium text-gray-700">
            Phone number (optional)
          </label>
          <input
            id="donor-phone"
            type="tel"
            autoComplete="tel"
            value={formState.donor.phone}
            onChange={(event) =>
              updateFormState({ donor: { ...formState.donor, phone: event.target.value } })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="For payment issues only"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formState.wants80G}
              onChange={(event) => updateFormState({ wants80G: event.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Send me an 80G tax exemption certificate
              </span>
              <span className="block text-xs text-gray-600">
                Section 80G of the Income Tax Act allows a 50% deduction on your taxable income. You
                need to file under the old tax regime to claim it.
              </span>
            </span>
          </label>

          {formState.wants80G && (
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="donor-pan" className="mb-1 block text-sm font-medium text-gray-700">
                  PAN <span className="text-red-600">*</span>
                </label>
                <input
                  id="donor-pan"
                  type="text"
                  maxLength={10}
                  value={formState.donor.pan}
                  onChange={(event) => {
                    updateFormState({
                      donor: { ...formState.donor, pan: event.target.value.toUpperCase() },
                    });
                    setErrors((prev) => ({ ...prev, pan: undefined }));
                  }}
                  aria-invalid={Boolean(errors.pan)}
                  className={`w-full rounded-lg border px-3 py-2 uppercase text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.pan ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABCDE1234F"
                />
                {errors.pan && <p className="mt-1 text-sm text-red-600">{errors.pan}</p>}
              </div>

              <div>
                <label htmlFor="donor-address" className="mb-1 block text-sm font-medium text-gray-700">
                  Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="donor-address"
                  rows={2}
                  value={formState.donor.address}
                  onChange={(event) =>
                    updateFormState({ donor: { ...formState.donor, address: event.target.value } })
                  }
                  aria-invalid={Boolean(errors.pincode)}
                  className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="House, street, area"
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="donor-city" className="mb-1 block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    id="donor-city"
                    type="text"
                    value={formState.donor.city}
                    onChange={(event) =>
                      updateFormState({ donor: { ...formState.donor, city: event.target.value } })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="New Delhi"
                  />
                </div>
                <div>
                  <label htmlFor="donor-pincode" className="mb-1 block text-sm font-medium text-gray-700">
                    PIN code
                  </label>
                  <input
                    id="donor-pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={formState.donor.pincode}
                    onChange={(event) =>
                      updateFormState({
                        donor: { ...formState.donor, pincode: event.target.value.replace(/[^0-9]/g, '') },
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="110030"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formState.wantsUpdates}
            onChange={(event) => updateFormState({ wantsUpdates: event.target.checked })}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span>Send me occasional updates on how my donation is being used.</span>
        </label>
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold text-gray-900">Donation summary</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-700">Amount</dt>
            <dd className="font-semibold text-gray-900">{formatCurrency(currentAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-700">Type</dt>
            <dd className="font-semibold text-gray-900">
              {formState.recurring ? `Recurring (${formState.frequency})` : 'One-time'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={handlePrevious} className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue to payment
        </Button>
      </div>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Secure payment</h2>
      <p className="mb-6 text-center text-sm text-gray-600">
        Pay by UPI, debit card, credit card, net banking or wallet. Razorpay handles the transaction and
        we never see your card number.
      </p>

      <div className="mb-6 rounded-lg border-2 border-orange-500 bg-orange-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Razorpay checkout</p>
            <p className="text-sm text-gray-700">UPI, cards, net banking, wallets</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            Recommended
          </span>
        </div>
      </div>

      {paymentStatus.status !== 'idle' && (
        <div className="mb-6" role="status" aria-live="polite">
          {paymentStatus.status === 'processing' && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center">
                <span className="mr-3 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600" />
                <span className="text-blue-800">{paymentStatus.message}</span>
              </div>
            </div>
          )}

          {paymentStatus.status === 'success' && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="text-green-800">
                <p className="font-semibold">✓ {paymentStatus.message}</p>
                {paymentStatus.transactionId && (
                  <p className="mt-1 text-sm">Reference: {paymentStatus.transactionId}</p>
                )}
              </div>
            </div>
          )}

          {paymentStatus.status === 'failed' && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="text-red-800">
                <p className="font-semibold">{paymentStatus.message}</p>
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold text-gray-900">Final summary</h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-700">Amount</dt>
            <dd className="font-semibold text-gray-900">{formatCurrency(currentAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-700">Type</dt>
            <dd className="text-gray-900">
              {formState.recurring ? `Recurring (${formState.frequency})` : 'One-time'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-700">Donor</dt>
            <dd className="text-gray-900">{formState.donor.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-700">Email</dt>
            <dd className="text-gray-900">{formState.donor.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-700">80G certificate</dt>
            <dd className="text-gray-900">{formState.wants80G ? 'Yes' : 'No'}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleSubmit}
          className="w-full"
          loading={isLoading || paymentStatus.status === 'processing'}
          disabled={paymentStatus.status === 'success'}
        >
          {paymentStatus.status === 'success'
            ? 'Payment complete'
            : isLoading || paymentStatus.status === 'processing'
            ? 'Processing...'
            : `Donate ${formatCurrency(currentAmount)}`}
        </Button>

        <Button
          variant="outline"
          onClick={handlePrevious}
          className="w-full"
          disabled={paymentStatus.status === 'processing'}
        >
          Back
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        By donating you agree to our{' '}
        <Link href="/terms" className="text-orange-700 underline">
          terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-orange-700 underline">
          privacy policy
        </Link>
        . For NRI and international donations, email info@scesindia.com.
      </p>
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
