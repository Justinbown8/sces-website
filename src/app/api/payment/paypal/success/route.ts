import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token'); // PayPal order ID
  const payerID = searchParams.get('PayerID');

  if (!token) {
    // Redirect to donation page with error
    return NextResponse.redirect(new URL('/donate?error=missing_token', request.url));
  }

  // Redirect to donation success page with PayPal order ID
  // The frontend will handle the capture process
  const successUrl = new URL('/donation-success', request.url);
  successUrl.searchParams.set('paypal_order_id', token);
  if (payerID) {
    successUrl.searchParams.set('payer_id', payerID);
  }
  successUrl.searchParams.set('payment_method', 'paypal');

  return NextResponse.redirect(successUrl);
}