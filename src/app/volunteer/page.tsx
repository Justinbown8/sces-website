import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

export const metadata = pageMetadata.volunteer();

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { name: 'Home', url: '/' },
              { name: 'Volunteer', url: '/volunteer' },
            ]}
            className="mb-8"
          />
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Make a Difference as a{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Volunteer
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join our passionate team of volunteers and help us provide quality education 
              to underserved children. Your time and skills can transform lives.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Children Helped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How You Can Help
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We have various volunteer opportunities that match different skills and time commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <div className="text-blue-600 text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Teaching & Tutoring</h3>
              <p className="text-gray-600">
                Help children with their studies, conduct classes, or provide one-on-one tutoring support.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <div className="text-green-600 text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Creative Activities</h3>
              <p className="text-gray-600">
                Organize arts, crafts, music, and sports activities to develop children&apos;s creative skills.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <div className="text-purple-600 text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Digital Skills</h3>
              <p className="text-gray-600">
                Teach computer skills, help with digital literacy, or assist with online learning platforms.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
              <div className="text-orange-600 text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Administrative Support</h3>
              <p className="text-gray-600">
                Help with documentation, event planning, social media, or fundraising activities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl">
              <div className="text-teal-600 text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mentoring</h3>
              <p className="text-gray-600">
                Provide guidance and emotional support to help children build confidence and life skills.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl">
              <div className="text-yellow-600 text-4xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Support</h3>
              <p className="text-gray-600">
                Help organize and run educational events, workshops, and community outreach programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <VolunteerForm />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Every hour you volunteer helps a child get closer to their dreams. 
            Join us in creating a brighter future through education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#volunteer-form"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Have Questions?
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}