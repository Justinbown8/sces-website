import { Button } from '@/components/ui/Button';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { AwardsSection } from '@/components/sections/AwardsSection';
import { MissionSection } from '@/components/sections/MissionSection';
import { DonationImpactSection } from '@/components/sections/DonationImpactSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import { TransparencySection } from '@/components/sections/TransparencySection';
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

      {/* Awards & Recognition Section */}
      <AwardsSection />

      {/* Mission Section */}
      <MissionSection />

      {/* Donation Impact Section */}
      <DonationImpactSection />

      {/* Financial Transparency Section */}
      <TransparencySection />

      {/* Testimonials Section */}
      <ClientOnly fallback={<div className="py-16 bg-gradient-to-br from-yellow-50 to-white" />}>
        <TestimonialSection 
          layout="carousel"
          title="Voices from Our Community"
          subtitle="Hear from the families and communities we've had the privilege to serve"
        />
      </ClientOnly>

      {/* Call to Action */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-3">
            Ready to Make a Difference?
          </h2>
          <p className="text-base sm:text-lg lg:text-lg text-gray-600 mb-6">
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