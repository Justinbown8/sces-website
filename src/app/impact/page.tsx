import React from 'react';
import TestimonialSection from '@/components/sections/TestimonialSection';
import ImpactStoriesSection from '@/components/sections/ImpactStoriesSection';
import { Button } from '@/components/ui/Button';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata = pageMetadata.impact();

export default function ImpactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-800 via-blue-600 to-yellow-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Stories of Hope &amp; Transformation
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Every child has a story. Every family has dreams. Through education and community support, 
            we&apos;re helping write new chapters filled with hope, opportunity, and success.
          </p>
        </div>
      </section>

      {/* Impact Stories Section */}
      <ImpactStoriesSection />

      {/* Testimonials Section */}
      <TestimonialSection 
        layout="carousel"
        title="Voices from Our Community"
        subtitle="Hear directly from the families, students, and community members whose lives have been touched by SCES"
      />

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              These numbers represent real lives transformed through education
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-white/90">Children Educated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-white/90">Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">15</div>
              <div className="text-white/90">Communities Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-white/90">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-6">
            Be Part of the Next Success Story
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Your support can help us create more stories of transformation. 
            Join us in building brighter futures for children in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              gradient={true}
              shine={true}
              className="min-w-[200px]"
              asChild
            >
              <Link href="/donate">Support Education</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px]"
              asChild
            >
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}