import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donor,
      amount,
      recurring,
      frequency,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Payment is verified - here you would typically:
    // 1. Save donation record to database
    // 2. Send confirmation email
    // 3. Set up recurring payment if applicable
    // 4. Generate receipt

    const donationRecord = {
      id: `donation_${Date.now()}`,
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      donor,
      recurring,
      frequency,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    // Log the successful donation (in production, save to database)
    console.log('Donation completed:', donationRecord);

    // Send confirmation email (placeholder)
    await sendDonationConfirmationEmail(donor, donationRecord);

    return NextResponse.json({
      success: true,
      donation_id: donationRecord.id,
      message: 'Payment verified successfully',
      receipt_url: `/receipt/${donationRecord.id}`, // Placeholder URL
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Placeholder function for sending confirmation email
async function sendDonationConfirmationEmail(
  donor: { email: string; name?: string }, 
  donation: { amount: number; id: string; created_at: string }
) {
  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  console.log('Sending confirmation email to:', donor.email);
  console.log('Donation details:', {
    amount: donation.amount,
    id: donation.id,
    date: donation.created_at,
  });
  
  // For now, just simulate email sending
  return Promise.resolve();
}