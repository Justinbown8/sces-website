import type { Metadata } from 'next';
import data from './data.json';
import { literacySEO } from './metadata';

export { literacySEO } from './metadata';

export const literacySources = [
  { id: 'source-plfs-report', title: 'NSO Annual Report PLFS 2025', url: data.sources.main_pdf_url, note: 'January-December 2025; released 27 March 2026. Table (7), PDF pp. 85-87; definition p. 549; comparison warning p. 38. Revised file dated 29 May 2026.' },
  { id: 'source-plfs-table', title: 'Original MoSPI Table (7) workbook', url: data.sources.original_table_xlsx_url, note: 'Age seven-plus columns B, D and F; combined panel rows 94-130. All 36 areas cross-checked against the PDF.' },
  { id: 'source-plfs-release', title: 'Official PLFS 2025 release note', url: data.sources.original_press_note_url, note: 'Dated 27 March 2026 inside the document; filename dates are not substituted for release dates.' },
  { id: 'source-census-final', title: 'Census 2011 final Primary Census Abstract', url: data.census_2011_reference_not_mixed_into_main_dataset.final_source_xlsx_url, note: 'Reference 2011; national Data rows 2-4. Effective rates computed from literates and population aged seven-plus. Original final release date not independently established.' },
  { id: 'source-census-provisional', title: 'Census 2011 provisional population presentation', url: data.census_2011_reference_not_mixed_into_main_dataset.provisional_source_pdf_url, note: '31 March 2011; literacy slide 44. Not the final PCA percentages.' },
  { id: 'source-census-definition', title: 'Census 2011 literacy instructions', url: 'https://censusindia.gov.in/nada/index.php/catalog/43493/download/47199/IM_AH_HH_English_2011.pdf', note: 'Paragraphs 6.80-6.82, printed p. 56 / PDF p. 61; Census reference 2011.' },
  { id: 'source-census-notice', title: 'MHA announcement of Census 2027', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2133845', note: '4 June 2025; identifies 2011 as the last Census. Subsequent schedules are not new literacy results.' },
  { id: 'source-samagra', title: 'Official Samagra Shiksha overview', url: 'https://www.dsel-education.gov.in/offerings/schemes-and-services/details/samagra-shiksha-QzM4gTMtQWa', note: 'Undated Ministry overview; integrated school-education objectives, not an impact evaluation.' },
  { id: 'source-nep', title: 'National Education Policy 2020', url: 'https://dsel-education.gov.in/static/uploads/2026/07/acd5cc42e662ae55f66f419ee6db4b4f.pdf', note: 'Policy reference 2020; paragraphs 2.2 and 21.4-21.5. The migrated file path does not change the policy year.' },
  { id: 'source-ullas', title: 'Parliamentary reply on the New India Literacy Programme', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1911807', note: '29 March 2023; target age 15+, FY 2022-23 to FY 2026-27, five components.' },
  { id: 'source-full-literacy', title: 'Ministry explanation of the full-literacy benchmark', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2049494', note: '28 August 2024; 95% policy benchmark and broader literacy conception, not literal 100%.' },
  { id: 'source-tripura', title: 'Tripura literacy declaration: age-group qualification', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2139103', note: '23 June 2025; explicitly describes the age-15-plus declaration benchmark. Kept out of the survey ranking.' },
  { id: 'source-pm-shri', title: 'Cabinet approval of PM SHRI schools', url: 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-a-new-centrally-sponsored-scheme-pm-shri-schools-pm-schools-for-rising-india/', note: '7 September 2022; selected exemplar schools and mentoring objectives, not proven population-literacy impact.' },
  { id: 'source-nipun', title: 'Current parliamentary explanation of NIPUN Bharat', url: 'https://dsel-education.gov.in/static/uploads/2026/08/a1ce870529a9aaa65737cf0ae0ddf166.pdf', note: '27 July 2026; early-years foundational literacy and numeracy objective.' },
] as const;

export interface PublicationDetails {
  datePublished: string;
  dateModified: string;
  author: { type: 'Person' | 'Organization'; name: string; url: string };
}

type PageContext =
  | { mode: 'preview'; origin: string }
  | { mode: 'publication'; publication: PublicationDetails };

function pageDetails(context: PageContext) {
  if (context.mode === 'preview') {
    const origin = new URL(context.origin);
    if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) {
      throw new Error('The editorial preview must use a loopback origin.');
    }
    return {
      draft: true,
      origin: origin.origin,
      url: new URL(literacySEO.previewPath, origin).href,
      image: new URL(literacySEO.previewImagePath, origin).href,
      modified: data.research_as_of,
    };
  }

  const { datePublished, dateModified, author } = context.publication;
  if (!author.name.trim() || !author.url || !Number.isFinite(Date.parse(datePublished)) || !Number.isFinite(Date.parse(dateModified))) {
    throw new Error('Publication requires an approved author and actual publication/modification dates.');
  }
  new URL(author.url);
  if (Date.parse(dateModified) < Date.parse(datePublished)) {
    throw new Error('Page modification date cannot precede first publication.');
  }
  return {
    draft: false,
    origin: literacySEO.siteUrl,
    url: literacySEO.canonical,
    image: literacySEO.publicationImage,
    modified: dateModified,
  };
}

export function createLiteracyMetadata(context: PageContext): Metadata {
  const page = pageDetails(context);
  const publication = context.mode === 'publication' ? context.publication : undefined;
  return {
    metadataBase: new URL(page.origin),
    title: { absolute: literacySEO.title },
    description: literacySEO.description,
    keywords: [...literacySEO.keywords],
    authors: publication ? [{ name: publication.author.name, url: publication.author.url }] : null,
    publisher: literacySEO.siteName,
    alternates: { canonical: page.draft ? null : page.url },
    robots: page.draft ? 'noindex,follow,noimageindex' : 'index,follow',
    openGraph: {
      title: literacySEO.title,
      description: literacySEO.description,
      type: 'article',
      url: page.url,
      siteName: literacySEO.siteName,
      locale: 'en_IN',
      images: [{ url: page.image, width: 1200, height: 630, alt: literacySEO.imageAlt }],
      modifiedTime: page.modified,
      ...(publication ? { publishedTime: publication.datePublished, authors: [publication.author.url] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: literacySEO.title,
      description: literacySEO.description,
      images: [{ url: page.image, alt: literacySEO.imageAlt }],
    },
  };
}

export function createLiteracySchema(context: PageContext) {
  const page = pageDetails(context);
  const publication = context.mode === 'publication' ? context.publication : undefined;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${page.url}#article`,
        url: page.url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': page.url },
        headline: literacySEO.headline,
        description: literacySEO.description,
        image: { '@type': 'ImageObject', url: page.image, width: 1200, height: 630, caption: literacySEO.imageCaption },
        dateCreated: data.research_as_of,
        dateModified: page.modified,
        creativeWorkStatus: page.draft ? 'Draft' : 'Published',
        inLanguage: 'en-IN',
        articleSection: 'Education statistics',
        publisher: { '@type': 'NGO', name: literacySEO.siteName, url: literacySEO.siteUrl },
        citation: literacySources.map(source => source.url),
        ...(publication ? {
          datePublished: publication.datePublished,
          author: { '@type': publication.author.type, name: publication.author.name, url: publication.author.url },
        } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${page.url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: new URL('/', page.origin).href },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: new URL('/blog/', page.origin).href },
          { '@type': 'ListItem', position: 3, name: literacySEO.headline, item: page.url },
        ],
      },
    ],
  };
}

export function serializeLiteracySchema(context: PageContext) {
  return JSON.stringify(createLiteracySchema(context)).replace(/</g, '\\u003c');
}
