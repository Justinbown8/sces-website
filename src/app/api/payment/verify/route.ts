import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createAdminClient } from '@/utils/supabase/server';
import { sendDonationReceipt, sendAdminNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface VerifyPayload {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount?: number;
  recurring?: boolean;
  frequency?: string;
  donor?: {
    name?: string;
    email?: string;
    phone?: string;
    pan?: string;
    address?: string;
    city?: string;
    pincode?: string;
    wants80G?: boolean;
  };
}

// Razorpay signs `${order_id}|${payment_id}` with the key secret using HMAC SHA256.
// A mismatch means the payment was not created for this order and must be rejected.
function isValidSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

// Short-lived signed token handed to the browser. The success page proves
// that a verified payment exists without exposing donor PII in the URL.
function createConfirmationToken(paymentId: string, amount: number) {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const payload = `${paymentId}.${amount}.${Date.now()}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

async function persistDonation(record: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Persistence is best-effort: a missing table or key must never tell a donor
  // their successful payment failed.
  if (!url || !serviceKey) return;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('donations').insert(record);
    if (error) {
      console.error('Could not persist donation:', error.message);
    }
  } catch (error) {
    console.error('Donation persistence unavailable:', error);
  }
}

export async function POST(request: NextRequest) {
  let payload: VerifyPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { success: false, message: 'Missing payment verification fields.' },
      { status: 400 }
    );
  }

  if (!isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    console.error('Razorpay signature mismatch for order', razorpay_order_id);
    return NextResponse.json(
      {
        success: false,
        message:
          'We could not verify this payment. If money left your account, contact us at info@scesindia.com with your payment ID.',
      },
      { status: 400 }
    );
  }

  // Confirm the captured amount with Razorpay instead of trusting the browser.
  let capturedAmount = payload.amount ?? 0;
  let method = 'razorpay';

  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const payment = (await razorpay.payments.fetch(razorpay_payment_id)) as {
      amount?: number;
      status?: string;
      method?: string;
    };
    if (payment?.status && !['captured', 'authorized'].includes(payment.status)) {
      return NextResponse.json(
        { success: false, message: `Payment is ${payment.status}. No money was collected.` },
        { status: 402 }
      );
    }
    if (payment?.amount) capturedAmount = payment.amount / 100;
    if (payment?.method) method = payment.method;
  } catch (error) {
    // The signature already passed, so a failed lookup should not fail the donor.
    console.error('Razorpay payment lookup failed:', error);
  }

  const donor = payload.donor || {};
  const donation = {
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
    amount: capturedAmount,
    currency: 'INR',
    recurring: Boolean(payload.recurring),
    frequency: payload.frequency || null,
    donor_name: donor.name || null,
    donor_email: donor.email || null,
    donor_phone: donor.phone || null,
    donor_pan: donor.pan || null,
    donor_address: donor.address || null,
    donor_city: donor.city || null,
    donor_pincode: donor.pincode || null,
    wants_80g: Boolean(donor.wants80G),
    payment_method: method,
    status: 'completed',
    created_at: new Date().toISOString(),
  };

  await persistDonation(donation);

  if (donor.email && donor.name) {
    const receipt = {
      transactionId: razorpay_payment_id,
      receiptNumber: `SCES-${new Date().getFullYear()}-${razorpay_payment_id.slice(-6).toUpperCase()}`,
      amount: capturedAmount,
      currency: 'INR',
      donorName: donor.name,
      donorEmail: donor.email,
      recurring: Boolean(payload.recurring),
      frequency: payload.frequency,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
    };

    try {
      await Promise.all([sendDonationReceipt(receipt), sendAdminNotification(receipt)]);
    } catch (error) {
      console.error('Receipt email failed:', error);
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Payment verified.',
    paymentId: razorpay_payment_id,
    amount: capturedAmount,
    confirmationToken: createConfirmationToken(razorpay_payment_id, capturedAmount),
  });
}
