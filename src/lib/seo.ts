import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const siteTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const siteDescription = description || siteConfig.description;
  const siteUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const siteImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}/PIC.jpg`;

  const metadata: Metadata = {
    title: siteTitle,
    description: siteDescription,
    keywords: [
      'NGO',
      'education',
      'children',
      'India',
      'donation',
      'volunteer',
      'SCES',
      'Sunrise Children Educational Society',
      'Delhi',
      'Mehrauli',
      'educational opportunities',
      'underserved children',
      ...(tags || []),
    ],
    authors: authors?.map(name => ({ name })) || [{ name: 'SCES Team' }],
    creator: 'SCES',
    publisher: 'Sunrise Children Educational Society',
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type,
      locale: 'en_US',
      url: siteUrl,
      title: siteTitle,
      description: siteDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: siteImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: authors || ['SCES Team'],
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [siteImage],
      creator: '@sces_ngo', // Update with actual Twitter handle
    },
    alternates: {
      canonical: siteUrl,
    },
  };

  return metadata;
}

export const defaultMetadata = generateMetadata();

// Page-specific metadata generators
export const pageMetadata = {
  home: () => generateMetadata({
    title: 'Home',
    description: 'Sunrise Children Educational Society - Providing educational opportunities to underserved children in India. Join our mission to create brighter futures through education.',
    url: '/',
  }),

  about: () => generateMetadata({
    title: 'About Us',
    description: 'Learn about SCES mission, vision, and our commitment to providing quality education to children in need across India.',
    url: '/about',
  }),

  president: () => generateMetadata({
    title: 'Meet Our President',
    description: 'Get to know the leadership behind SCES and our vision for transforming children\'s lives through education.',
    url: '/president',
  }),

  staff: () => generateMetadata({
    title: 'Our Team',
    description: 'Meet the dedicated team members who work tirelessly to provide educational opportunities to children across India.',
    url: '/staff',
  }),

  gallery: () => generateMetadata({
    title: 'Photo Gallery',
    description: 'Explore our photo gallery showcasing events, classrooms, and field visits that highlight our impact on children\'s education.',
    url: '/gallery',
  }),

  impact: () => generateMetadata({
    title: 'Our Impact',
    description: 'Discover the real stories and testimonials from children and families whose lives have been transformed through SCES programs.',
    url: '/impact',
  }),

  blog: () => generateMetadata({
    title: 'Blog',
    description: 'Stay updated with the latest news, stories, and insights from SCES educational programs and community impact.',
    url: '/blog',
  }),

  donate: () => generateMetadata({
    title: 'Donate Now',
    description: 'Make a difference in a child\'s life. Your donation helps provide school kits, tuition support, and digital access to education.',
    url: '/donate',
  }),

  volunteer: () => generateMetadata({
    title: 'Become a Volunteer',
    description: 'Join our team of dedicated volunteers and help us provide educational opportunities to children in need across India.',
    url: '/volunteer',
  }),

  contact: () => generateMetadata({
    title: 'Contact Us',
    description: 'Get in touch with SCES. Find our contact information, address, and ways to connect with our team.',
    url: '/contact',
  }),
};

// Blog post metadata generator
export function generateBlogMetadata({
  title,
  excerpt,
  slug,
  publishedAt,
  updatedAt,
  author,
  tags,
  featuredImage,
}: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  featuredImage?: string;
}) {
  return generateMetadata({
    title,
    description: excerpt,
    url: `/blog/${slug}`,
    type: 'article',
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    authors: [author],
    tags,
    image: featuredImage,
  });
}