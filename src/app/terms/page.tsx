import { Metadata } from 'next';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Terms of Service | SCES - Sunrise Children Educational Society',
  description: 'Terms of Service for Sunrise Children Educational Society. Understand the terms and conditions for using our website and services.',
  openGraph: {
    title: 'Terms of Service | SCES',
    description: 'Terms of Service for Sunrise Children Educational Society',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our website and services.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using the Sunrise Children Educational Society (SCES) website, 
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About SCES</h2>
            <p className="text-gray-700 mb-6">
              Sunrise Children Educational Society is a registered Non-Profit Organization 
              dedicated to providing educational opportunities to underserved children in India. 
              Our mission is to ensure every child has access to quality education.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Website</h2>
            <p className="text-gray-700 mb-6">
              You may use our website for lawful purposes only. You agree not to use the site:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>In any way that violates applicable laws or regulations</li>
              <li>To transmit or procure harmful or malicious content</li>
              <li>To impersonate or attempt to impersonate SCES or its representatives</li>
              <li>To engage in any fraudulent activities</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Donations</h2>
            <p className="text-gray-700 mb-6">
              When making a donation through our website:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>All donations are voluntary and non-refundable</li>
              <li>Donations will be used for SCES educational programs and operations</li>
              <li>You will receive a receipt for tax purposes as per Indian tax laws</li>
              <li>SCES reserves the right to use donations where the need is greatest</li>
              <li>Recurring donations can be cancelled by contacting us directly</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Volunteer Applications</h2>
            <p className="text-gray-700 mb-6">
              Volunteer applications are subject to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Background verification as required by law</li>
              <li>Approval based on organizational needs and capacity</li>
              <li>Compliance with SCES volunteer policies and guidelines</li>
              <li>Commitment to child safety and protection protocols</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              The content on this website, including text, graphics, logos, and images, 
              is the property of SCES and is protected by copyright and other intellectual 
              property laws. You may not reproduce, distribute, or create derivative works 
              without written permission.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information. By using our website, 
              you consent to our data practices as described in the Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-6">
              This website is provided "as is" without any representations or warranties. 
              SCES makes no warranties regarding the accuracy, reliability, or availability 
              of the website or its content.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              SCES shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from your use of this website or services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These terms shall be governed by and construed in accordance with the laws of India. 
              Any disputes shall be subject to the jurisdiction of the courts in New Delhi, India.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              SCES reserves the right to modify these terms at any time. Changes will be 
              effective immediately upon posting on the website. Your continued use of 
              the website constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact us:
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