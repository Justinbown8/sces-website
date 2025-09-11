// Application constants

export const DONATION_AMOUNTS = [500, 1000, 2500, 5000] as const;

export const GALLERY_CATEGORIES = [
  'All',
  'Events', 
  'Classrooms',
  'Field Visits'
] as const;

export const VOLUNTEER_SKILLS = [
  'Teaching',
  'Tutoring',
  'Event Organization',
  'Photography',
  'Social Media',
  'Fundraising',
  'Administrative Support',
  'Translation',
  'Technology Support',
  'Other'
] as const;

export const AVAILABILITY_OPTIONS = [
  'Weekdays',
  'Weekends', 
  'Evenings',
  'Flexible',
  'Once a week',
  'Twice a week',
  'Monthly events only'
] as const;

export const PAYMENT_METHODS = {
  RAZORPAY: 'razorpay',
  PAYPAL: 'paypal'
} as const;

export const DONATION_FREQUENCIES = {
  ONE_TIME: 'one-time',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
} as const;

export const CONTACT_INFO = {
  phone: '099536 65620',
  address: '877/10 Ward No. 6, Mehrauli New Delhi – 110030',
  email: 'info@sces-ngo.org' // Placeholder
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/sces-ngo', // Update with actual
  instagram: 'https://instagram.com/sces-ngo' // Update with actual
} as const;

export const SEO_DEFAULTS = {
  title: 'Sunrise Children Educational Society - Empowering Children Through Education',
  description: 'SCES is dedicated to providing educational opportunities to underserved children in India. Join us in making a difference through donations and volunteering.',
  keywords: 'NGO, education, children, India, donation, volunteer, Delhi, Mehrauli'
} as const;