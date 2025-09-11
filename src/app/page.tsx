import { Button } from '@/components/ui/Button';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { MissionSection } from '@/components/sections/MissionSection';
import { DonationImpactSection } from '@/components/sections/DonationImpactSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import { ClientOnly } from '@/components/ui/ClientOnly';
import { siteConfig } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata = pageMetadata.home();

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <ClientOnly fallback={<div className="h-96 bg-gradient-to-r from-blue-600 to-blue-700" />}>
        <HeroCarousel slides={siteConfig.heroSlides} />
      </ClientOnly>

      {/* Mission Section */}
      <MissionSection />

      {/* Donation Impact Section */}
      <DonationImpactSection />

      {/* Testimonials Section */}
      <ClientOnly fallback={<div className="py-16 bg-gradient-to-br from-yellow-50 to-white" />}>
        <TestimonialSection 
          layout="carousel"
          title="Voices from Our Community"
          subtitle="Hear from the families and communities we've had the privilege to serve"
        />
      </ClientOnly>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your contribution, no matter the size, helps us provide education to children in need.
          </p>
          <Button variant="primary" size="md" asChild>
            <Link href="/donate">Start Your Impact Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}