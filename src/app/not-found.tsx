import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Logo from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        
        {/* Logo and Branding */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <Logo size="xl" className="text-orange-500" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900 font-heading">SCES</h2>
              <p className="text-sm text-gray-600">Sunrise Children Educational Society</p>
            </div>
          </div>
        </div>

        <Card className="p-8 md:p-12">
          {/* 404 Error */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off. 
              Just like our mission to reach every child, let's help you find your way back.
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="font-semibold"
                asChild
              >
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="font-semibold"
                asChild
              >
                <Link href="/donate">
                  Make a Donation
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Link
                href="/gallery"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Photo Gallery
              </Link>
              <Link
                href="/volunteer"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Volunteer
              </Link>
              <Link
                href="/impact"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Our Impact
              </Link>
              <Link
                href="/staff"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Meet Our Team
              </Link>
              <Link
                href="/president"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                President's Message
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Blog
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:text-orange-600"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              If you believe this is an error or need assistance, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="tel:09953665620"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 focus:outline-none focus:text-orange-700"
              >
                📞 099536 65620
              </a>
              <a
                href="mailto:info@sces.org.in"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 focus:outline-none focus:text-orange-700"
              >
                ✉️ info@sces.org.in
              </a>
            </div>
          </div>

        </Card>

        {/* Inspirational Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 italic">
            "Every child deserves education. Every page deserves to be found."
          </p>
        </div>

      </div>
    </div>
  );
}