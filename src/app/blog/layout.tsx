import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata.blog();

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}