'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { convertCurrency, getPaymentErrorMessage } from '@/lib/payment';

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

interface PayPalButtonProps {
  amount: number;
  currency: string;
  donor: {
    name: string;
    email: string;
    phone?: string;
  };
  recurring: boolean;
  frequency?: string;
  onSuccess: (transactionId: string, details: PayPalCaptureData) => void;
  onError: (error: PayPalError) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function PayPalButton({
  amount,
  currency,
  donor,
  recurring,
  frequency,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: PayPalButtonProps) {
  const [{ isPending, isResolved }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert amount to USD for PayPal
  const usdAmount = currency === 'INR' ? convertCurrency(amount, 'INR', 'USD') : amount;

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          donor,
          recurring,
          frequency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create PayPal order');
      }

      const orderData = await response.json();
      return orderData.id;
    } catch (error) {
      console.error('PayPal order creation error:', error);
      onError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/payment/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
          donor,
          amount,
          recurring,
          frequency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to capture PayPal payment');
      }

      const captureData = await response.json();
      
      if (captureData.success) {
        onSuccess(captureData.transactionId, captureData);
      } else {
        throw new Error('PayPal payment capture failed');
      }
    } catch (error) {
      console.error('PayPal capture error:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onErrorHandler = (error: unknown) => {
    console.error('PayPal button error:', error);
    const errorMessage = getPaymentErrorMessage(error, 'paypal');
    onError({ message: errorMessage, originalError: error });
  };

  const onCancelHandler = () => {
    console.log('PayPal payment cancelled by user');
    onCancel();
  };

  // Show loading state while PayPal script is loading
  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  // Show error if PayPal script failed to load
  if (!isResolved) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-800 text-sm">
          PayPal is temporarily unavailable. Please try Razorpay or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      {isProcessing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">Processing payment...</span>
          </div>
        </div>
      )}
      
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
        disabled={disabled || isProcessing}
        forceReRender={[amount, currency, donor.email, recurring, frequency]}
      />
      
      {currency === 'INR' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Amount will be converted to ${usdAmount.toFixed(2)} USD
        </div>
      )}
    </div>
  );
}