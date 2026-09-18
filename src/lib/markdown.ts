// Shared markdown helpers for the blog pipeline.
// Single source of truth for heading slugs so the rendered heading IDs and
// the Table of Contents entries never drift apart.

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

// Escape a value for safe use inside an HTML attribute or text node.
// Entity characters are built via char codes so this file survives any
// HTML-entity normalisation in editors or pipelines.
const AMP = String.fromCharCode(38);

export const escapeHtml = (text: string) =>
  text
    .replace(/&/g, AMP + 'amp;')
    .replace(/"/g, AMP + 'quot;')
    .replace(/</g, AMP + 'lt;')
    .replace(/>/g, AMP + 'gt;');

// Slugify heading text for anchor IDs: lowercase, alphanumerics and hyphens;
// strips ampersands, punctuation and other symbols.
export const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Strip markdown emphasis markers from heading text for TOC display.
const stripEmphasis = (text: string) =>
  text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1');

// Parse H2/H3 headings from raw markdown for the Table of Contents.
export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const headingLine = /^(#{2,3})\s+(.*)$/;

  for (const line of content.split('\n')) {
    const match = line.match(headingLine);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const raw = match[2].trim();
    headings.push({ id: slugifyHeading(raw), text: stripEmphasis(raw), level });
  }

  return headings;
}
