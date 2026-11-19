import type { BlogPost } from '@/types';
import type { PublicationDetails } from './seo';
import { literacySEO } from './metadata';

export const literacyPublication: PublicationDetails = {
  datePublished: '2026-11-19',
  dateModified: '2026-11-19',
  author: { type: 'Organization', name: literacySEO.siteName, url: `${literacySEO.siteUrl}/about/` },
};

// Client-side listings need only a summary; the full article/tables render on the server.
export const literacyBlogPost: BlogPost = {
  id: literacySEO.slug,
  title: literacySEO.headline,
  excerpt: literacySEO.description,
  content: literacySEO.description,
  author: literacyPublication.author.name,
  publishDate: new Date(literacyPublication.datePublished),
  updatedAt: new Date(literacyPublication.dateModified),
  tags: ['Education', 'Literacy'],
  featuredImage: new URL(literacySEO.publicationImage).pathname,
  seoTitle: literacySEO.title,
  seoDescription: literacySEO.description,
  keywords: [...literacySEO.keywords],
  canonicalUrl: literacySEO.canonical,
};
