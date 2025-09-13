import { NextRequest, NextResponse } from 'next/server';

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

interface PayPalCaptureRequest {
  orderID: string;
  donor: {
    name: string;
    email: string;
    phone?: string;
  };
  amount: number;
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
    const body: PayPalCaptureRequest = await request.json();
    const { orderID, donor, recurring, frequency } = body;

    // Validate required fields
    if (!orderID || !donor.name || !donor.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture the PayPal order
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `SCES-CAPTURE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      console.error('PayPal capture error:', error);
      throw new Error('Failed to capture PayPal payment');
    }

    const captureData = await captureResponse.json();

    // Check if capture was successful
    if (captureData.status !== 'COMPLETED') {
      throw new Error(`PayPal capture failed with status: ${captureData.status}`);
    }

    // Extract payment details
    const capture = captureData.purchase_units[0]?.payments?.captures?.[0];
    if (!capture) {
      throw new Error('No capture data found in PayPal response');
    }

    // Generate receipt number
    const receiptNumber = `SCES_PP_${Date.now()}_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Here you would typically:
    // 1. Save the donation to your database
    // 2. Send confirmation email to donor
    // 3. Log the transaction for accounting
    
    console.log('PayPal donation captured:', {
      receiptNumber,
      paypalTransactionId: capture.id,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      donor: donor,
      recurring: recurring,
      frequency: frequency,
      status: capture.status,
      captureTime: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      transactionId: capture.id,
      receiptNumber: receiptNumber,
      amount: {
        value: capture.amount.value,
        currency: capture.amount.currency_code,
      },
      status: capture.status,
      captureTime: capture.create_time,
      donor: {
        name: donor.name,
        email: donor.email,
      },
      recurring: recurring,
      frequency: frequency,
    });

  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to capture PayPal payment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}