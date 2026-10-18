import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

const MIN_AMOUNT = 100; // ₹100 floor, matches settings.general.minimumAmount
const MAX_AMOUNT = 500000; // ₹5,00,000 ceiling

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = Number(body?.amount);
    const currency = body?.currency === 'INR' ? 'INR' : 'INR';

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return NextResponse.json(
        {
          success: false,
          message: `Donation amount must be between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT.toLocaleString('en-IN')}.`,
        },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not configured.');
      return NextResponse.json(
        { success: false, message: 'Online payments are temporarily unavailable.' },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Round to rupees first so paise conversion never produces a fractional amount.
    const order = await razorpay.orders.create({
      amount: Math.round(amount) * 100,
      currency,
      receipt: `sces_${Date.now()}`,
      notes: {
        purpose: 'SCES donation',
        source: 'website',
      },
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json(
      { success: false, message: 'Could not start the payment. Please try again.' },
      { status: 500 }
    );
  }
}
