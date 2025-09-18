import { Card } from '@/components/ui/Card';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Shipping & Delivery Policy
          </h1>
          
          <Card className="p-8">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Digital Services</h2>
                <p className="text-gray-700 mb-4">
                  Sunrise Children Educational Society (SCES) primarily operates as a charitable organization 
                  providing educational services. Most of our interactions are digital:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Donation receipts are sent via email immediately</li>
                  <li>Volunteer certificates are provided digitally</li>
                  <li>Program updates and newsletters are sent electronically</li>
                  <li>Tax exemption certificates (80G) are emailed within 7 days</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Physical Materials</h2>
                <p className="text-gray-700 mb-4">
                  In rare cases where physical materials need to be shipped:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Educational Materials:</strong> Delivered to program locations</li>
                  <li><strong>Certificates:</strong> Available for pickup or local delivery in Delhi NCR</li>
                  <li><strong>Promotional Materials:</strong> Distributed at events and partner locations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Areas</h2>
                <p className="text-gray-700 mb-4">
                  SCES operates primarily in the following regions:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Primary:</strong> Delhi NCR (New Delhi, Gurgaon, Noida)</li>
                  <li><strong>Secondary:</strong> Major cities across India</li>
                  <li><strong>Digital Services:</strong> Available worldwide</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Timeline</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Email Receipts:</strong> Instant</li>
                  <li><strong>Tax Certificates:</strong> 3-7 business days</li>
                  <li><strong>Physical Materials (Delhi NCR):</strong> 2-5 business days</li>
                  <li><strong>Physical Materials (Other Cities):</strong> 5-10 business days</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Shipping Charges</h2>
                <p className="text-gray-700 mb-4">
                  As a non-profit organization, SCES does not charge for shipping:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>All digital materials are provided free of charge</li>
                  <li>Physical delivery costs are covered by the organization</li>
                  <li>No hidden fees or additional charges</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact for Delivery Issues</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about delivery or need to update your contact information:
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Email:</strong> info@sces.org.in</p>
                  <p className="text-gray-700"><strong>Phone:</strong> 099536 65620</p>
                  <p className="text-gray-700"><strong>Address:</strong> 877/10 Ward No. 6, Mehrauli New Delhi – 110030</p>
                </div>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}