'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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

export default function TestPayPalPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDonor = {
    name: 'Test Donor',
    email: 'test@example.com',
    phone: '+1234567890',
  };

  const handleSuccess = (transactionId: string, details: PayPalCaptureData) => {
    setTestResult(`✅ PayPal Success! Transaction ID: ${transactionId}`);
    console.log('PayPal Success:', { transactionId, details });
  };

  const handleError = (error: PayPalError) => {
    setTestResult(`❌ PayPal Error: ${error.message}`);
    console.error('PayPal Error:', error);
  };

  const handleCancel = () => {
    setTestResult('⚠️ PayPal payment was cancelled');
    console.log('PayPal payment cancelled');
  };

  const testPayPalConfig = async () => {
    setIsLoading(true);
    setTestResult('Testing PayPal configuration...');

    try {
      // Test if PayPal client ID is configured
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      if (!clientId) {
        setTestResult('❌ PayPal Client ID not configured');
        return;
      }

      // Test order creation API
      const response = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100,
          currency: 'INR',
          donor: testDonor,
          recurring: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ PayPal API working! Order ID: ${data.id}`);
      } else {
        const error = await response.json();
        setTestResult(`❌ PayPal API Error: ${error.message}`);
      }
    } catch (error) {
      setTestResult(`❌ PayPal Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">PayPal Integration Test</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Test</h2>
          <Button 
            onClick={testPayPalConfig} 
            loading={isLoading}
            className="w-full mb-4"
          >
            Test PayPal Configuration
          </Button>
          
          {testResult && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm">{testResult}</pre>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">PayPal Button Test</h2>
          <p className="text-gray-600 mb-4">
            Test amount: ₹100 (will be converted to ~$1.20 USD)
          </p>
          
          <div className="mb-4">
            <PayPalButton
              amount={100}
              currency="INR"
              donor={testDonor}
              recurring={false}
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCancel}
            />
          </div>

          <div className="text-sm text-gray-700">
            <p><strong>Note:</strong> This is a test environment. No real money will be charged.</p>
            <p>Use PayPal sandbox credentials for testing.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}