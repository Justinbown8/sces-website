'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYMENT_CONFIG } from '@/config/payment';

interface PayPalWrapperProps {
  children: React.ReactNode;
}

export default function PayPalWrapper({ children }: PayPalWrapperProps) {
  const paypalOptions = {
    clientId: PAYMENT_CONFIG.paypal.clientId || '',
    currency: PAYMENT_CONFIG.paypal.currency,
    intent: PAYMENT_CONFIG.paypal.intent,
    components: 'buttons,funding-eligibility',
    'enable-funding': 'venmo,paylater',
    'disable-funding': 'card', // We'll handle cards through Razorpay
  };

  // Don't render if PayPal client ID is not configured
  if (!PAYMENT_CONFIG.paypal.clientId) {
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}