import { BlogPost } from '@/types';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateArticleStructuredData, generateFAQStructuredData } from '@/lib/structured-data';

interface BlogStructuredDataProps {
  post: BlogPost;
  authorImage?: string;
}

export function BlogStructuredData({ post, authorImage }: BlogStructuredDataProps) {
  const structuredData = generateArticleStructuredData(post, authorImage);

  return (
    <>
      <StructuredData data={structuredData} />
      {post.faqs && post.faqs.length > 0 && (
        <StructuredData data={generateFAQStructuredData(post.faqs)} />
      )}
    </>
  );
}
