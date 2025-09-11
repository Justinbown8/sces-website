import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { StructuredData } from '@/components/seo/StructuredData';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';

export const metadata = pageMetadata.contact();

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Contact Us', url: '/contact' },
];

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact SCES NGO',
  description: 'Get in touch with Sunrise Children Education Society for inquiries, donations, or volunteer opportunities',
  url: `${siteConfig.url}/contact`,
};

export default function ContactPage() {
  return (
    <>
      <StructuredData data={organizationStructuredData} />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact <span className="text-blue-600">SCES</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              We&apos;d love to hear from you. Whether you want to donate, volunteer, or learn more about our programs, 
              we&apos;re here to help make a difference together.
            </p>
          </section>

          {/* Contact Information */}
          <section className="py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Address */}
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mehrauli, New Delhi<br />
                  Delhi, India<br />
                  110030
                </p>
              </Card>

              {/* Phone */}
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  <a href="tel:+919876543210" className="hover:text-blue-600 transition-colors">
                    +91 98765 43210
                  </a><br />
                  <span className="text-sm text-gray-600">Mon - Fri, 9:00 AM - 6:00 PM</span>
                </p>
              </Card>

              {/* Email */}
              <Card className="p-8 text-center hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  <a href="mailto:info@scesngo.org" className="hover:text-blue-600 transition-colors">
                    info@scesngo.org
                  </a><br />
                  <a href="mailto:support@scesngo.org" className="hover:text-blue-600 transition-colors">
                    support@scesngo.org
                  </a>
                </p>
              </Card>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                <p className="text-lg text-gray-700">
                  Have a question or want to get involved? We&apos;d love to hear from you.
                </p>
              </div>

              <Card className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="donation">Donation Inquiry</option>
                      <option value="volunteer">Volunteer Opportunity</option>
                      <option value="partnership">Partnership</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Support Request</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="min-w-[200px]"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl text-blue-100">
                Join us in transforming lives through education
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-blue-600 border-white hover:bg-blue-50 min-w-[200px]"
              >
                <a href="/donate">Donate Now</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600 min-w-[200px]"
              >
                <a href="/volunteer">Become a Volunteer</a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}