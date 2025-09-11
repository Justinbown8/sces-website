import { ContactInfo, SocialLink, NavigationLink } from '@/types';
import { getHeroSlides, getDonationConfig } from '@/lib/content-manager';
import { getSEOSettings, getEnabledSocialPlatforms, getPaymentSettings } from '@/lib/settings-manager';
import { getEnvVarWithDefault } from '@/lib/env-manager';

// Site-wide configuration (now integrated with settings management)
export const siteConfig = {
  // Basic site information
  get name() {
    return getSEOSettings().structuredData.organizationName;
  },
  
  get description() {
    return getSEOSettings().defaultDescription;
  },
  
  get url() {
    return getEnvVarWithDefault('NEXT_PUBLIC_SITE_URL', 'https://sces-ngo.org');
  },
  
  // Contact information
  contact: {
    phone: "099536 65620",
    address: "877/10 Ward No. 6, Mehrauli New Delhi – 110030",
    email: "info@sces-ngo.org"
  } as ContactInfo,

  // Social media links (now managed by settings)
  get social() {
    return getEnabledSocialPlatforms().map(platform => ({
      platform: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
      url: platform.url,
      icon: platform.platform.toLowerCase()
    })) as SocialLink[];
  },

  // Navigation (static for now, could be made configurable)
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/president", label: "President" },
    { href: "/staff", label: "Staff" },
    { href: "/gallery", label: "Gallery" },
    { href: "/impact", label: "Impact" },
    { href: "/blog", label: "Blog" },
    { href: "/volunteer", label: "Volunteer" },
    { href: "/contact", label: "Contact" }
  ] as NavigationLink[],

  // Content-driven configuration (managed by content system)
  get donationAmounts() {
    return getDonationConfig().presetAmounts;
  },

  get heroSlides() {
    return getHeroSlides();
  },
  
  // Payment configuration (managed by settings system)
  get payments() {
    const paymentSettings = getPaymentSettings();
    return {
      razorpay: {
        keyId: paymentSettings.razorpay.keyId,
        keySecret: paymentSettings.razorpay.keySecret,
        enabled: paymentSettings.razorpay.enabled
      },
      paypal: {
        clientId: paymentSettings.paypal.clientId,
        clientSecret: paymentSettings.paypal.clientSecret,
        enabled: paymentSettings.paypal.enabled,
        environment: paymentSettings.paypal.environment
      },
      defaultCurrency: paymentSettings.defaultCurrency,
      minimumAmount: paymentSettings.minimumAmount,
      maximumAmount: paymentSettings.maximumAmount
    };
  }
};

export default siteConfig;