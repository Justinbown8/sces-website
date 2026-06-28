import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Membership Registration Successful | SCES',
  description: 'Thank you for registering as a member of SCES. Welcome to our community!',
};

export default function MembershipSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome to SCES!
          </h1>
          <p className="text-gray-600 mb-6">
            Your membership has been successfully registered. Thank you for joining our community of change-makers!
          </p>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">What's Next?</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>You'll receive a confirmation message on WhatsApp</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Check your email for membership details and benefits</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Join our community events and programs</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              asChild
            >
              <Link href="/">Return to Home</Link>
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              asChild
            >
              <Link href="/donate">Make a Donation</Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-xs text-gray-600 border-t pt-4">
            <p>Questions? Contact us at</p>
            <p className="font-semibold text-gray-900">info@scesindia.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
