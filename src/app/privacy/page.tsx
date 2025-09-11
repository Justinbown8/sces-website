import { Metadata } from 'next';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Privacy Policy | SCES - Sunrise Children Educational Society',
  description: 'Privacy Policy for Sunrise Children Educational Society. Learn how we protect and handle your personal information.',
  openGraph: {
    title: 'Privacy Policy | SCES',
    description: 'Privacy Policy for Sunrise Children Educational Society',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-6">
              We collect information you provide directly to us, such as when you make a donation, 
              apply to volunteer, or contact us. This may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Donation and payment information</li>
              <li>Volunteer application details</li>
              <li>Communication preferences</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Process donations and provide receipts</li>
              <li>Manage volunteer applications and communications</li>
              <li>Send updates about our programs and impact</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except as described in this policy. We may share information with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Payment processors for donation processing</li>
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Secure SSL encryption for data transmission</li>
              <li>Regular security assessments</li>
              <li>Limited access to personal information</li>
              <li>Secure payment processing through trusted providers</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-6">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of communications</li>
              <li>Request information about how your data is used</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">NPO Compliance</h2>
            <p className="text-gray-700 mb-6">
              As a registered Non-Profit Organization in India, SCES complies with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Indian Information Technology Act, 2000</li>
              <li>Personal Data Protection Bill guidelines</li>
              <li>Foreign Contribution Regulation Act (FCRA) requirements</li>
              <li>Income Tax Act provisions for charitable organizations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Sunrise Children Educational Society</strong>
              </p>
              <p className="text-gray-700 mb-2">
                Address: 877/10 Ward No. 6, Mehrauli New Delhi – 110030
              </p>
              <p className="text-gray-700 mb-2">
                Phone: 099536 65620
              </p>
              <p className="text-gray-700">
                Email: info@sces.org.in
              </p>
            </div>

            <p className="text-sm text-gray-700 mt-8">
              Last updated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}