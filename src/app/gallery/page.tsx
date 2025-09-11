import { Gallery } from '@/components/gallery/Gallery';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

export const metadata = pageMetadata.gallery();

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              Our Gallery
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 mb-8">
              Capturing moments of joy, learning, and growth in our educational journey
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                📚 Classroom Activities
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                🎉 Special Events
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                🌍 Field Visits
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { name: 'Home', url: '/' },
              { name: 'Gallery', url: '/gallery' },
            ]}
            className="max-w-7xl mx-auto mb-8"
          />
          <Gallery 
            className="max-w-7xl mx-auto"
            showFilter={true}
            initialCategory="All"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-yellow-400 to-orange-500 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">
            Be Part of Our Story
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join us in creating more beautiful memories and making a difference in children&apos;s lives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Support Our Mission
            </a>
            <a
              href="/volunteer"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}