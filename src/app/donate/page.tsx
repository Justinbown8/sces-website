import DonationForm from '@/components/forms/DonationForm';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateDonationStructuredData } from '@/lib/structured-data';

export const metadata = pageMetadata.donate();

export default function DonatePage() {
  const donationStructuredData = generateDonationStructuredData();

  return (
    <>
      <StructuredData data={donationStructuredData} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumb
              items={[
                { name: 'Home', url: '/' },
                { name: 'Donate', url: '/donate' },
              ]}
              className="max-w-4xl mx-auto mb-8"
            />
            <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Support Children&apos;s Education
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Your donation directly impacts children&apos;s lives by providing educational resources, 
              school supplies, and learning opportunities. Every contribution, no matter the size, 
              helps build brighter futures.
            </p>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
                <div className="text-gray-700">Children Helped</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
                <div className="text-gray-700">Active Volunteers</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
                <div className="text-gray-700">Cities Reached</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <DonationForm />
          </div>
        </section>
      </div>
    </>
  );
}