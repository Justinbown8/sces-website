import { NextRequest, NextResponse } from 'next/server';
import { convertCurrency } from '@/lib/payment';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  scope: string;
}

interface PayPalOrderRequest {
  amount: number;
  currency: string;
  donor: {
    name: string;
    email: string;
    phone?: string;
  };
  recurring: boolean;
  frequency?: string;
}

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal token error:', error);
    throw new Error('Failed to get PayPal access token');
  }

  const data: PayPalAccessTokenResponse = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body: PayPalOrderRequest = await request.json();
    const { amount, currency, donor, recurring, frequency } = body;

    // Validate required fields
    if (!amount || !donor.name || !donor.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert INR to USD for PayPal
    const usdAmount = currency === 'INR' ? convertCurrency(amount, 'INR', 'USD') : amount;
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `SCES_${Date.now()}`,
          amount: {
            currency_code: 'USD',
            value: usdAmount.toFixed(2),
          },
          description: `Donation to Sunrise Children Educational Society${recurring ? ` (${frequency})` : ''}`,
          custom_id: `donor_${donor.email}_${Date.now()}`,
          soft_descriptor: 'SCES Donation',
        },
      ],
      application_context: {
        brand_name: 'Sunrise Children Educational Society',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payment/paypal/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/donate?cancelled=true`,
      },
      payer: {
        name: {
          given_name: donor.name.split(' ')[0] || donor.name,
          surname: donor.name.split(' ').slice(1).join(' ') || '',
        },
        email_address: donor.email,
      },
    };

    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `SCES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error('PayPal order creation error:', error);
      throw new Error('Failed to create PayPal order');
    }

    const order = await orderResponse.json();

    return NextResponse.json({
      id: order.id,
      status: order.status,
      links: order.links,
      amount: {
        original: amount,
        currency: currency,
        converted: usdAmount,
        convertedCurrency: 'USD',
      },
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create PayPal order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}