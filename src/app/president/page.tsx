import Image from 'next/image';
import { presidentInfo } from '@/config/president';
import { Card } from '@/components/ui/Card';
import { pageMetadata } from '@/lib/seo';

export default function PresidentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* President Photo */}
              <div className="relative">
                <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                  <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={presidentInfo.image}
                      alt={`${presidentInfo.name}, ${presidentInfo.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-xl"></div>
                </div>
              </div>

              {/* President Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {presidentInfo.name}
                  </h1>
                  <p className="text-xl text-blue-600 font-semibold">
                    {presidentInfo.title}
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-4">
                  {presidentInfo.bio.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Signature */}
                {presidentInfo.signature && (
                  <div className="pt-4">
                    <div className="relative w-48 h-16">
                      <Image
                        src={presidentInfo.signature}
                        alt={`${presidentInfo.name}'s signature`}
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Our Vision
            </h2>
            <blockquote className="text-xl lg:text-2xl text-blue-100 leading-relaxed italic">
              "{presidentInfo.visionStatement}"
            </blockquote>
          </div>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
              Key Initiatives
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {presidentInfo.keyInitiatives.map((initiative, index) => {
                const [title, description] = initiative.split(': ');
                return (
                  <Card key={index} className="h-full">
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {title}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-grow">
                        {description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Together, we can create lasting change in the lives of children who need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Support Our Cause
              </a>
              <a
                href="/volunteer"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Become a Volunteer
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Metadata for SEO
export const metadata = pageMetadata.president();