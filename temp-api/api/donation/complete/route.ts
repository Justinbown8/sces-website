import { NextRequest, NextResponse } from 'next/server';
import { generateReceiptNumber } from '@/lib/payment';
import { sendDonationReceipt, sendAdminNotification, DonationReceiptData } from '@/lib/email';
import { recordDonation } from '@/lib/donation-tracking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      transactionId,
      amount,
      donorName,
      donorEmail,
      donorPhone,
      recurring = false,
      frequency,
      paymentMethod = 'razorpay',
      currency = 'INR',
    } = body;

    // Validate required fields
    if (!transactionId || !amount || !donorName || !donorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donorEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();
    const timestamp = new Date().toISOString();

    // Record donation in tracking system
    try {
      await recordDonation({
        transactionId,
        receiptNumber,
        amount,
        currency,
        donorName,
        donorEmail,
        donorPhone,
        recurring,
        frequency: frequency as 'monthly' | 'quarterly' | 'yearly' | undefined,
        paymentMethod: paymentMethod as 'razorpay' | 'paypal',
      });
    } catch (error) {
      console.error('Failed to record donation:', error);
      // Continue with email sending even if tracking fails
    }

    // Prepare receipt data
    const receiptData: DonationReceiptData = {
      transactionId,
      amount,
      currency,
      donorName,
      donorEmail,
      recurring,
      frequency,
      paymentMethod,
      timestamp,
      receiptNumber,
    };

    // Send emails in parallel
    const [receiptResult, adminResult] = await Promise.all([
      sendDonationReceipt(receiptData),
      sendAdminNotification(receiptData),
    ]);

    // Prepare response
    const response = {
      success: true,
      receiptNumber,
      timestamp,
      emailSent: receiptResult.success,
      adminNotified: adminResult.success,
    };

    if (!receiptResult.success) {
      response.emailSent = false;
      console.error('Failed to send receipt email:', receiptResult.error);
    }

    if (!adminResult.success) {
      response.adminNotified = false;
      console.error('Failed to send admin notification:', adminResult.error);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Donation completion error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process donation completion',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}