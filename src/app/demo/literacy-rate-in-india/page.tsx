import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function previewOrigin() {
  if (process.env.NODE_ENV !== 'development') notFound();
  const host = (await headers()).get('host');
  if (!host) notFound();
  const origin = new URL(`http://${host}`);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) notFound();
  return origin.origin;
}

export async function generateMetadata(): Promise<Metadata> {
  const origin = await previewOrigin();
  const { createLiteracyMetadata } = await import('@/content/drafts/literacy-rate-in-india/seo');
  return createLiteracyMetadata({ mode: 'preview', origin });
}

export default async function LiteracyDraftPreview() {
  const origin = await previewOrigin();
  const { default: LiteracyArticle } = await import('@/content/drafts/literacy-rate-in-india/article');
  const { literacySEO, serializeLiteracySchema } = await import('@/content/drafts/literacy-rate-in-india/seo');

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-5 pt-8">
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950" role="note">
          <strong>Local Editorial Draft, Not Published.</strong> AI-assisted research and preparation; human author/reviewer
          approval and first publication date are pending. This preview and its image return 404 in production and are not
          included in the public blog or sitemap.
        </p>
        <nav aria-label="Breadcrumb" className="mt-5 text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="text-blue-700 underline" href="/" prefetch={false}>Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link className="text-blue-700 underline" href="/blog/" prefetch={false}>Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{literacySEO.headline}</li>
          </ol>
        </nav>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeLiteracySchema({ mode: 'preview', origin }) }} />
      <LiteracyArticle imagePath={literacySEO.previewImagePath} />
    </div>
  );
}
