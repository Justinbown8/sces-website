import Link from 'next/link';
import { ShareButtons } from '@/components/blog/ShareButtons';
import LiteracyArticle from './article';
import { literacySEO, serializeLiteracySchema } from './seo';
import { literacyPublication } from './publication';

export default function PublishedLiteracyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-5 pt-8 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link className="text-blue-700 underline" href="/" prefetch={false}>Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link className="text-blue-700 underline" href="/blog/" prefetch={false}>Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{literacySEO.headline}</li>
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeLiteracySchema({ mode: 'publication', publication: literacyPublication }) }} />
      <LiteracyArticle imagePath={new URL(literacySEO.publicationImage).pathname} publication={literacyPublication} />
      <div className="mx-auto max-w-5xl px-5 pb-12 [&>div]:flex-wrap">
        <ShareButtons title={literacySEO.headline} url={literacySEO.canonical} />
      </div>
    </div>
  );
}
