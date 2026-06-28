import MembershipForm from '@/components/forms/MembershipForm';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

export const metadata = pageMetadata.membership?.() || {
  title: 'Become a Member | SCES',
  description: 'Join SCES and support children\'s education. Choose from our flexible membership plans.',
};

export default function MembershipPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="relative py-8 lg:py-12">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { name: 'Home', url: '/' },
                { name: 'Membership', url: '/membership' },
              ]}
              className="max-w-4xl mx-auto mb-6"
            />
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Become a Member of SCES
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 leading-relaxed">
                Join our growing community of dedicated individuals committed to providing quality education to underprivileged children. Your membership directly supports our educational initiatives.
              </p>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="font-semibold text-gray-900 text-sm">Quality Education</div>
                  <p className="text-xs text-gray-600 mt-1">Support structured learning programs</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="font-semibold text-gray-900 text-sm">Community Impact</div>
                  <p className="text-xs text-gray-600 mt-1">Be part of positive social change</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-semibold text-gray-900 text-sm">Transparent Reports</div>
                  <p className="text-xs text-gray-600 mt-1">Track the impact of your contribution</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Form Section */}
        <section className="py-8 lg:py-12">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <MembershipForm />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 lg:py-12 bg-white/50">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <details className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer">
                  <summary className="font-semibold text-gray-900 text-sm">What are the membership benefits?</summary>
                  <p className="mt-3 text-sm text-gray-600">
                    As a member, you'll receive regular updates on our programs, transparent financial reports, and invitations to special events. You'll also be part of our community making a real difference.
                  </p>
                </details>
                <details className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer">
                  <summary className="font-semibold text-gray-900 text-sm">Can I upgrade my membership?</summary>
                  <p className="mt-3 text-sm text-gray-600">
                    Yes, you can upgrade from Annual to Lifetime membership at any time. Contact us for upgrade options.
                  </p>
                </details>
                <details className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer">
                  <summary className="font-semibold text-gray-900 text-sm">Is student membership available?</summary>
                  <p className="mt-3 text-sm text-gray-600">
                    Yes! We offer special student membership rates. You'll need to provide a valid student ID during registration.
                  </p>
                </details>
                <details className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer">
                  <summary className="font-semibold text-gray-900 text-sm">How will I be contacted?</summary>
                  <p className="mt-3 text-sm text-gray-600">
                    We'll contact you via WhatsApp and email for membership confirmations and important updates. You can manage your preferences anytime.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
