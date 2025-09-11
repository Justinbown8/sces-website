import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Application Submitted | SCES Volunteer',
  description: 'Thank you for your volunteer application. We will contact you soon.',
  robots: 'noindex, nofollow', // Don't index success pages
};

export default function VolunteerSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your interest in volunteering with SCES. 
            We have received your application and will contact you soon.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            What Happens Next?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Application Review</h3>
                <p className="text-gray-600">
                  Our team will review your application and match your skills with our current needs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Initial Contact</h3>
                <p className="text-gray-600">
                  We&apos;ll contact you within 3-5 business days to discuss volunteer opportunities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Orientation & Training</h3>
                <p className="text-gray-600">
                  Join our orientation session to learn about SCES and get started with your volunteer journey.
                </p>
              </div>
            </div>
            
            <div className="flex items-start text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Start Making Impact</h3>
                <p className="text-gray-600">
                  Begin your volunteer work and help us transform children&apos;s lives through education.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Have Questions?
          </h2>
          <p className="mb-6">
            Feel free to reach out to us if you have any questions about the volunteer process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>099536 65620</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>volunteer@sces.org</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/about">
              Learn More About SCES
            </Link>
          </Button>
        </div>

        {/* Social Sharing */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Help us spread the word about volunteering opportunities!
          </p>
          
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://sces.org/volunteer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <a
              href="https://twitter.com/intent/tweet?text=I%20just%20applied%20to%20volunteer%20with%20SCES!%20Join%20me%20in%20helping%20children%20get%20quality%20education.&url=https://sces.org/volunteer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://sces.org/volunteer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}