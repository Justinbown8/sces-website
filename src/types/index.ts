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
  tags: string[];
  featuredImage?: string;
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