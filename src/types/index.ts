// Core types for SCES website

export interface NavigationLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface ContactInfo {
  phone: string;
  address: string;
  email?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface CTAButton {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  ctaPrimary: CTAButton;
  ctaSecondary?: CTAButton;
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  caption?: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  content: string;
  image?: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  studentName: string;
  age: number | null;
  location: string;
  image: string;
  story: string;
  beforeImage?: string;
  afterImage?: string;
  quote: string;
  achievements: string[];
  timeline: {
    year: number;
    event: string;
  }[];
}

export interface StaffMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  updatedAt?: Date;
  tags: string[];
  featuredImage?: string;
  /** Optional custom meta title (falls back to `title`). Keep ~55-60 chars. */
  seoTitle?: string;
  /** Optional custom meta description (falls back to `excerpt`). Keep <=160 chars. */
  seoDescription?: string;
  /** Optional SEO keywords for this post (added to page keywords / OG tags). */
  keywords?: string[];
}

export interface DonationData {
  amount: number;
  currency: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  donor: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod: string;
}

export interface VolunteerApplication {
  name: string;
  email: string;
  phone: string;
  city: string;
  availability: string;
  skills: string[];
  message: string;
  agreedToTerms: boolean;
}