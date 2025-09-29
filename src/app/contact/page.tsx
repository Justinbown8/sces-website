import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ContactForm from '@/components/forms/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Contact Us
          </h1>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <Card className="p-8 h-full">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-700">
                        877/10 Ward No. 6<br />
                        Mehrauli, New Delhi – 110030<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                      <p className="text-gray-700">
                        <a href="tel:09953665620" className="hover:text-blue-600 transition-colors">
                          099536 65620
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 text-xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-700">
                        <a href="mailto:info@sces.org.in" className="hover:text-blue-600 transition-colors">
                          info@sces.org.in
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xl">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                      <p className="text-gray-700">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="primary" asChild>
                      <a href="/donate">Make a Donation</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/volunteer">Become a Volunteer</a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                
                <ContactForm />

                <p className="text-sm text-gray-600 mt-4 text-center">
                  We typically respond within 24-48 hours during business days.
                </p>
              </Card>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🎓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Educational Programs</h3>
              <p className="text-gray-600 text-sm">
                Learn about our various educational initiatives and how you can get involved.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Partnerships</h3>
              <p className="text-gray-600 text-sm">
                Interested in partnering with us? We welcome collaborations with like-minded organizations.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl">📰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Media Inquiries</h3>
              <p className="text-gray-600 text-sm">
                Press and media representatives can reach out for interviews and information.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}