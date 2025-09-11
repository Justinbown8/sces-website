import { Metadata } from 'next';
import { Suspense } from 'react';
import DonationSuccessContent from '@/components/forms/DonationSuccessContent';

export const metadata: Metadata = {
  title: 'Donation Successful - Thank You | SCES',
  description: 'Thank you for your generous donation to Sunrise Children Educational Society. Your contribution helps provide educational opportunities to children in need.',
  robots: 'noindex, nofollow', // Don't index success pages
};

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        }>
          <DonationSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}