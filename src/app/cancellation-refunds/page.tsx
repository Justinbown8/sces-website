import { Card } from '@/components/ui/Card';

export default function CancellationRefundsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Cancellation & Refunds Policy
          </h1>
          
          <Card className="p-8">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Donation Cancellations</h2>
                <p className="text-gray-700 mb-4">
                  At Sunrise Children Educational Society (SCES), we understand that circumstances may change. 
                  However, due to the nature of our charitable work and immediate deployment of funds for 
                  educational programs, we have the following cancellation policy:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Donations are generally non-refundable once processed</li>
                  <li>Cancellation requests must be made within 24 hours of donation</li>
                  <li>Recurring donations can be cancelled at any time for future payments</li>
                  <li>Emergency cancellations will be reviewed on a case-by-case basis</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
                <p className="text-gray-700 mb-4">
                  If you are eligible for a refund, please follow these steps:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                  <li>Contact us at <a href="mailto:info@sces.org.in" className="text-blue-600 hover:underline">info@sces.org.in</a></li>
                  <li>Provide your donation receipt and transaction ID</li>
                  <li>Explain the reason for your refund request</li>
                  <li>Allow 7-10 business days for processing</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Timeline</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Credit/Debit Cards:</strong> 5-7 business days</li>
                  <li><strong>UPI/Digital Wallets:</strong> 3-5 business days</li>
                  <li><strong>Net Banking:</strong> 7-10 business days</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Non-Refundable Situations</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Donations made more than 30 days ago</li>
                  <li>Funds already allocated to specific programs</li>
                  <li>Anonymous donations without proper documentation</li>
                  <li>Donations made through third-party platforms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For any questions regarding cancellations or refunds, please contact us:
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