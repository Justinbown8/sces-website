import { siteConfig } from '@/config/site';
import { BlogPost } from '@/types';

// Organization structured data for SCES
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.name,
    alternateName: 'SCES',
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`, // Update when logo is available
    image: `${siteConfig.url}/PIC.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '877/10 Ward No. 6',
      addressLocality: 'Mehrauli',
      addressRegion: 'New Delhi',
      postalCode: '110030',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: siteConfig.social.map(social => social.url),
    foundingDate: '2020', // Update with actual founding date
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    knowsAbout: [
      'Education',
      'Children Welfare',
      'Community Development',
      'Poverty Alleviation',
      'Digital Literacy',
    ],
    seeks: {
      '@type': 'Demand',
      name: 'Educational Support for Underprivileged Children',
    },
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Educational Support',
          description: 'Providing educational opportunities to underserved children',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'School Kit Distribution',
          description: 'Providing essential school supplies to children in need',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Tuition Support',
          description: 'Financial assistance for children\'s education',
        },
      },
    ],
  };
}

// Article structured data for blog posts
export function generateArticleStructuredData(post: BlogPost, authorImage?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? `${siteConfig.url}${post.featuredImage}` : `${siteConfig.url}/PIC.jpg`,
    datePublished: post.publishDate.toISOString(),
    dateModified: post.updatedAt?.toISOString() || post.publishDate.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
      image: authorImage ? `${siteConfig.url}${authorImage}` : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`, // Update when logo is available
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.id}`,
    },
    keywords: post.tags.join(', '),
    articleSection: 'Education',
    about: {
      '@type': 'Thing',
      name: 'Children Education',
    },
  };
}

// Breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.url}`,
    })),
  };
}

// Website structured data
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Donation action structured data
export function generateDonationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    agent: {
      '@type': 'Person',
      name: 'Donor',
    },
    recipient: {
      '@type': 'NGO',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    object: {
      '@type': 'MonetaryGrant',
      name: 'Educational Support Donation',
      description: 'Support children\'s education through SCES programs',
    },
    instrument: {
      '@type': 'WebPage',
      url: `${siteConfig.url}/donate`,
      name: 'Donation Page',
    },
  };
}

// FAQ structured data (for future use)
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}