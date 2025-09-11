import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import SocialIcon from '@/components/ui/SocialIcons';
import { siteConfig } from '@/config/site';
import { SocialLink } from '@/types';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={`bg-gray-900 text-white ${className}`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Organization Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Logo size="lg" className="text-yellow-400" />
                <div>
                  <h3 className="text-xl font-bold font-heading">
                    Sunrise Children Educational Society
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Empowering children through education
                  </p>
                </div>
              </div>
              
              <p className="text-gray-200 mb-6 leading-relaxed max-w-md">
                SCES is dedicated to providing quality educational opportunities to underserved 
                children across India. Every donation and volunteer effort helps us create 
                brighter futures for the next generation.
              </p>

              {/* Quick Donate CTA */}
              <div className="mb-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-semibold"
                  asChild
                >
                  <Link href="/donate">
                    Make a Difference Today
                  </Link>
                </Button>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300 mr-2">Follow us:</span>
                {siteConfig.social.map((social: SocialLink) => (
                  <Link
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    <SocialIcon platform={social.icon} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold font-heading mb-6">Quick Links</h4>
              <nav 
                className="space-y-3"
                role="navigation"
                aria-label="Footer navigation"
              >
                {siteConfig.navigation.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-200 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/volunteer"
                  className="block text-gray-200 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                >
                  Become a Volunteer
                </Link>
              </nav>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold font-heading mb-6">Contact Us</h4>
              <address className="space-y-4 not-italic">
                
                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <SocialIcon platform="phone" className="text-gray-300 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-200">
                      <a 
                        href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                        className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                        aria-label={`Call us at ${siteConfig.contact.phone}`}
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </p>
                    <p className="text-sm text-gray-300">Call us anytime</p>
                  </div>
                </div>

                {/* Email */}
                {siteConfig.contact.email && (
                  <div className="flex items-start space-x-3">
                    <SocialIcon platform="email" className="text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-200">
                        <a 
                          href={`mailto:${siteConfig.contact.email}`}
                          className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                          aria-label={`Send email to ${siteConfig.contact.email}`}
                        >
                          {siteConfig.contact.email}
                        </a>
                      </p>
                      <p className="text-sm text-gray-400">Send us an email</p>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start space-x-3">
                  <SocialIcon platform="address" className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 leading-relaxed">
                      {siteConfig.contact.address}
                    </p>
                    <p className="text-sm text-gray-400">Visit our office</p>
                  </div>
                </div>

              </address>
            </div>

          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Sunrise Children Educational Society. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
              >
                Terms of Service
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;