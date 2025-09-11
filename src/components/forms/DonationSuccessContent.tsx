'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency, generateReceiptNumber } from '@/lib/payment';
import { sendDonationReceipt, sendAdminNotification, DonationReceiptData } from '@/lib/email';
import { recordDonation } from '@/lib/donation-tracking';
import FundsBreakdown from '@/components/donation/FundsBreakdown';
import Link from 'next/link';

interface DonationDetails {
  transactionId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  recurring: boolean;
  frequency?: string;
  timestamp: string;
  paymentMethod?: string;
  receiptNumber?: string;
}

export default function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState<'sending' | 'sent' | 'failed' | null>(null);

  useEffect(() => {
    // Extract donation details from URL parameters
    const transactionId = searchParams.get('transaction_id');
    const amount = searchParams.get('amount');
    const donorName = searchParams.get('donor_name');
    const donorEmail = searchParams.get('donor_email');
    const recurring = searchParams.get('recurring') === 'true';
    const frequency = searchParams.get('frequency');
    const paymentMethod = searchParams.get('payment_method') || 'razorpay';
    
    // Handle PayPal redirect case
    const paypalOrderId = searchParams.get('paypal_order_id');

    if (paypalOrderId && !transactionId) {
      // This is a PayPal redirect, we need to capture the order
      // For now, show a processing state and redirect to capture
      setIsLoading(true);
      // In a real implementation, you would capture the PayPal order here
      // For this demo, we'll show an error message
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return;
    }

    if (transactionId && amount && donorName && donorEmail) {
      const receiptNumber = generateReceiptNumber();
      const details: DonationDetails = {
        transactionId,
        amount: parseFloat(amount),
        donorName,
        donorEmail,
        recurring,
        frequency: frequency || undefined,
        timestamp: new Date().toISOString(),
        paymentMethod,
        receiptNumber,
      };
      
      setDonationDetails(details);
      
      // Process donation in background
      processDonation(details);
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const processDonation = async (details: DonationDetails) => {
    try {
      setEmailStatus('sending');
      
      // Record donation in tracking system
      await recordDonation({
        transactionId: details.transactionId,
        receiptNumber: details.receiptNumber!,
        amount: details.amount,
        currency: 'INR',
        donorName: details.donorName,
        donorEmail: details.donorEmail,
        recurring: details.recurring,
        frequency: details.frequency as 'monthly' | 'quarterly' | 'yearly' | undefined,
        paymentMethod: (details.paymentMethod || 'razorpay') as 'razorpay' | 'paypal',
      });

      // Prepare receipt data
      const receiptData: DonationReceiptData = {
        transactionId: details.transactionId,
        amount: details.amount,
        currency: 'INR',
        donorName: details.donorName,
        donorEmail: details.donorEmail,
        recurring: details.recurring,
        frequency: details.frequency,
        paymentMethod: details.paymentMethod || 'razorpay',
        timestamp: details.timestamp,
        receiptNumber: details.receiptNumber!,
      };

      // Send receipt email and admin notification
      const [receiptResult, adminResult] = await Promise.all([
        sendDonationReceipt(receiptData),
        sendAdminNotification(receiptData),
      ]);

      if (receiptResult.success) {
        setEmailStatus('sent');
      } else {
        console.error('Failed to send receipt:', receiptResult.error);
        setEmailStatus('failed');
      }

      if (!adminResult.success) {
        console.error('Failed to send admin notification:', adminResult.error);
      }
    } catch (error) {
      console.error('Failed to process donation:', error);
      setEmailStatus('failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!donationDetails) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Donation Details</h1>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find the details for this donation. Please check your email for the confirmation receipt.
        </p>
        <Link href="/donate">
          <Button>Make Another Donation</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <Card className="text-center p-8 mb-8">
        <div className="text-green-600 mb-4">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Thank You for Your Generous Donation!
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Your contribution will help provide educational opportunities to children in need.
        </p>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(donationDetails.amount)}
          {donationDetails.recurring && (
            <span className="text-lg text-gray-600 ml-2">
              per {donationDetails.frequency?.replace('ly', '') || 'month'}
            </span>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Details</h2>
          <div className="space-y-3">
            {donationDetails.receiptNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Receipt Number:</span>
                <span className="font-mono text-sm font-semibold">{donationDetails.receiptNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-sm">{donationDetails.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">{formatCurrency(donationDetails.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span>{donationDetails.recurring ? `Recurring (${donationDetails.frequency})` : 'One-time'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Donor:</span>
              <span>{donationDetails.donorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-sm">{donationDetails.donorEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="capitalize">{donationDetails.paymentMethod || 'Razorpay'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(donationDetails.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-1">
                {emailStatus === 'sending' && (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {emailStatus === 'sent' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {emailStatus === 'failed' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Receipt:</strong> 
                  {emailStatus === 'sending' && ' Sending confirmation email...'}
                  {emailStatus === 'sent' && ` A confirmation email with your donation receipt has been sent to ${donationDetails.donorEmail}`}
                  {emailStatus === 'failed' && ' Failed to send confirmation email. Please contact us for your receipt.'}
                  {emailStatus === null && ` A confirmation email with your donation receipt will be sent to ${donationDetails.donorEmail}`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Impact Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Impact</h2>
          <div className="space-y-4">
            {donationDetails.amount >= 5000 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">Full Educational Sponsorship</div>
                  <div className="text-sm text-gray-600">Complete educational support for 1 child for 3 months</div>
                </div>
              </div>
            )}
            {donationDetails.amount >= 2500 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">Digital Learning Access</div>
                  <div className="text-sm text-gray-600">Provides digital learning tools and resources</div>
                </div>
              </div>
            )}
            {donationDetails.amount >= 1000 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">Tuition Support</div>
                  <div className="text-sm text-gray-600">Covers tuition fees for 1 child for 1 month</div>
                </div>
              </div>
            )}
            {donationDetails.amount >= 500 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">School Kit</div>
                  <div className="text-sm text-gray-600">Provides basic school supplies for one child</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              Your donation helps us continue our mission of providing quality education to underserved children across India.
            </p>
          </div>
        </Card>
      </div>

      {/* Funds Breakdown */}
      <FundsBreakdown totalAmount={donationDetails.amount} showAnimation={true} />

      {/* Next Steps */}
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-blue-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Stay Updated</h3>
            <p className="text-sm text-gray-600">Receive updates on how your donation is making a difference</p>
          </div>
          <div>
            <div className="text-green-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Get Involved</h3>
            <p className="text-sm text-gray-600">Consider volunteering or spreading awareness about our cause</p>
          </div>
          <div>
            <div className="text-purple-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Share the Impact</h3>
            <p className="text-sm text-gray-600">Help us reach more supporters by sharing our mission</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
          <Link href="/donor-dashboard">
            <Button variant="outline">View Donation History</Button>
          </Link>
          <Link href="/volunteer">
            <Button variant="outline">Become a Volunteer</Button>
          </Link>
          <Link href="/donate">
            <Button>Make Another Donation</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}