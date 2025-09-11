/**
 * About Page - Information about SCES NGO
 */

import { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { StructuredData } from '@/components/seo/StructuredData';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - SCES NGO',
  description: 'Learn about Sunrise Children Education Society (SCES), our mission, vision, and commitment to providing quality education to underprivileged children.',
  keywords: ['about SCES', 'NGO mission', 'education for children', 'social impact', 'non-profit organization'],
  openGraph: {
    title: 'About SCES NGO - Empowering Children Through Education',
    description: 'Discover our journey, mission, and impact in providing quality education to underprivileged children across communities.',
    type: 'website',
    url: `${siteConfig.url}/about`,
  },
};

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'About Us', url: '/about' },
];

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Sunrise Children Education Society',
  alternateName: 'SCES NGO',
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  description: 'A non-profit organization dedicated to providing quality education to underprivileged children',
  foundingDate: '2015',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'Delhi',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9876543210',
    contactType: 'customer service',
    email: 'info@scesngo.org',
  },
  sameAs: [
    'https://www.facebook.com/scesngo',
    'https://www.instagram.com/scesngo',
    'https://www.linkedin.com/company/scesngo',
  ],
};

const coreValues = [
  {
    title: 'Education First',
    description: 'We believe education is the fundamental right of every child and the key to breaking the cycle of poverty.',
    icon: '📚',
  },
  {
    title: 'Inclusivity',
    description: 'We ensure that children from all backgrounds, regardless of their circumstances, have access to quality education.',
    icon: '🤝',
  },
  {
    title: 'Community Impact',
    description: 'We work closely with communities to create sustainable educational programs that make lasting change.',
    icon: '🌟',
  },
  {
    title: 'Transparency',
    description: 'We maintain complete transparency in our operations and ensure donors know exactly how their contributions are used.',
    icon: '🔍',
  },
];

const milestones = [
  {
    year: '2015',
    title: 'Foundation',
    description: 'SCES was founded with a vision to provide quality education to underprivileged children.',
  },
  {
    year: '2017',
    title: 'First Learning Center',
    description: 'Established our first learning center, serving 50 children in the local community.',
  },
  {
    year: '2019',
    title: 'Expansion',
    description: 'Expanded to 3 learning centers, reaching over 200 children across different areas.',
  },
  {
    year: '2021',
    title: 'Digital Initiative',
    description: 'Launched digital learning programs to continue education during the pandemic.',
  },
  {
    year: '2023',
    title: 'Impact Milestone',
    description: 'Reached over 1,000 children with our educational programs and support services.',
  },
];

export default function AboutPage() {
  return (
    <>
      <StructuredData data={organizationStructuredData} />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">SCES NGO</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Sunrise Children Education Society (SCES) is dedicated to transforming lives through education, 
              providing hope and opportunities to underprivileged children across communities.
            </p>
            <div className="relative w-full max-w-4xl mx-auto h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <OptimizedImage
                src="/images/about-hero.jpg"
                alt="Children learning in SCES classroom"
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-blue-50 border-blue-200">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To provide quality education, nutritional support, and holistic development opportunities 
                  to underprivileged children, empowering them to break the cycle of poverty and build 
                  a brighter future for themselves and their communities.
                </p>
              </Card>
              
              <Card className="p-8 bg-green-50 border-green-200">
                <h2 className="text-3xl font-bold text-green-900 mb-4">Our Vision</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A world where every child, regardless of their socio-economic background, has access 
                  to quality education and the opportunity to reach their full potential, contributing 
                  to a more equitable and prosperous society.
                </p>
              </Card>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Our Journey */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Journey</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  From a small vision to transforming thousands of lives - discover the milestones that shaped our mission
                </p>
              </div>

              {/* Desktop Timeline */}
              <div className="hidden lg:block max-w-6xl mx-auto">
                <div className="relative">
                  {/* Main timeline line */}
                  <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600"></div>
                  
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative mb-16 last:mb-0">
                      {/* Timeline node */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-blue-600 rounded-full shadow-lg z-10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      
                      {/* Content card */}
                      <div className={`flex items-center ${
                        index % 2 === 0 ? 'justify-start' : 'justify-end'
                      }`}>
                        <div className={`w-5/12 ${
                          index % 2 === 0 ? 'pr-8' : 'pl-8'
                        }`}>
                          <Card className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-l-4 border-blue-600">
                            <div className="flex items-center mb-4">
                              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full font-bold text-lg shadow-md">
                                {milestone.year}
                              </div>
                              <div className="ml-4 flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                            <p className="text-gray-700 leading-relaxed text-lg">{milestone.description}</p>
                            
                            {/* Achievement indicator */}
                            <div className="mt-4 flex items-center text-blue-600">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="font-semibold">Milestone Achieved</span>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Timeline */}
              <div className="lg:hidden max-w-2xl mx-auto">
                <div className="relative">
                  {/* Mobile timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600"></div>
                  
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative mb-12 last:mb-0">
                      {/* Mobile timeline node */}
                      <div className="absolute left-6 w-5 h-5 bg-white border-3 border-blue-600 rounded-full shadow-lg z-10">
                        <div className="absolute inset-1 bg-blue-600 rounded-full"></div>
                      </div>
                      
                      {/* Mobile content */}
                      <div className="ml-20">
                        <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white border-l-4 border-blue-600">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full font-bold text-sm">
                              {milestone.year}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                          
                          {/* Mobile achievement indicator */}
                          <div className="mt-3 flex items-center text-blue-600 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Milestone Achieved</span>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Journey Stats */}
              <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">8 Years of Impact</h3>
                  <p className="text-blue-100">From foundation to transformation</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">2015</div>
                    <div className="text-blue-100 text-sm">Founded</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">15+</div>
                    <div className="text-blue-100 text-sm">Centers</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">1000+</div>
                    <div className="text-blue-100 text-sm">Children</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">50+</div>
                    <div className="text-blue-100 text-sm">Volunteers</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Stats */}
          <section className="py-16 bg-blue-600 rounded-lg text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-blue-50 text-lg">Making a difference in children&apos;s lives every day</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-blue-50">Children Educated</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15</div>
                <div className="text-blue-50">Learning Centers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-50">Volunteers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">8</div>
                <div className="text-blue-50">Years of Service</div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of our journey to transform lives through education. Every contribution, 
              big or small, makes a significant impact in a child&apos;s future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/volunteer">Become a Volunteer</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}