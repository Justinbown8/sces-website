import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts, blogAuthors } from '@/config/blog';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { CommentSection } from '@/components/blog/CommentSection';
import { BlogStructuredData } from '@/components/blog/BlogStructuredData';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.id === slug);
  
  if (!post) {
    notFound();
  }

  const author = blogAuthors.find(a => a.name === post.author);
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Convert markdown-style content to HTML (robust implementation)
  const formatContent = (content: string) => {
    let html = content.trim();

    // 1. Handle Horizontal Rules
    html = html.replace(/^\s*---\s*$/gm, '<hr class="my-12 border-gray-200" />');

    // 2. Handle Images: ![alt](url)
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => `
      <div class="my-12 overflow-hidden rounded-[2rem] shadow-2xl group relative">
        <img src="${src}" alt="${alt}" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        ${alt ? `
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <p class="text-white text-sm font-medium italic opacity-90">${alt}</p>
          </div>
        ` : ''}
      </div>
    `);

    // 3. Handle Headings
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-8 mt-16 leading-tight">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl md:text-4xl font-heading font-bold text-gray-900 mb-6 mt-12 leading-snug">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl md:text-3xl font-heading font-bold text-gray-900 mb-4 mt-10 leading-snug">$1</h3>');

    // 4. Handle Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>');

    // 5. Handle Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 font-bold border-b-2 border-blue-200 hover:border-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');

    // 6. Handle Lists (Wrap groups of list items)
    html = html.replace(/^\* (.*$)/gm, '<li class="ml-6 pl-2 list-disc mb-3 text-gray-700">$1</li>');
    html = html.replace(/^- (.*$)/gm, '<li class="ml-6 pl-2 list-disc mb-3 text-gray-700">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-6 pl-2 list-decimal mb-3 text-gray-700">$1</li>');

    // 7. Handle Paragraphs
    const sections = html.split(/\n\n+/);
    html = sections.map(section => {
      const trimmed = section.trim();
      if (!trimmed) return '';
      // If it starts with a tag (like <h1, <div, <li, <hr), return as is
      if (trimmed.startsWith('<h') || 
          trimmed.startsWith('<div') || 
          trimmed.startsWith('<li') || 
          trimmed.startsWith('<hr') || 
          trimmed.startsWith('<ul') || 
          trimmed.startsWith('<ol')) {
        return trimmed;
      }
      return `<p class="text-gray-700 text-lg md:text-xl leading-relaxed mb-8">${trimmed}</p>`;
    }).join('');

    return html;
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <BlogStructuredData post={post} authorImage={author?.image} />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
                { name: post.title, url: `/blog/${slug}` },
              ]}
              className="mb-8"
            />

            {/* Article Header */}
            <header className="mb-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  {author?.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={author.image}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    {author && (
                      <p className="text-sm text-gray-600">{author.role}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(post.publishDate)}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                className="text-gray-700 leading-relaxed"
              />
            </article>

            {/* Share Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <ShareButtons title={post.title} url={currentUrl} />
            </div>

            {/* Author Bio */}
            {author && (
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-start gap-4">
                  {author.image ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={author.image}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">
                        {author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{author.name}</h4>
                    <p className="text-blue-600 font-medium mb-2">{author.role}</p>
                    <p className="text-gray-700">{author.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <CommentSection postId={post.id} />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] bg-gray-200">
                      {relatedPost.featuredImage ? (
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.id === slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | SCES Blog',
    };
  }

  const { generateBlogMetadata } = await import('@/lib/seo');
  
  return generateBlogMetadata({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.id,
    publishedAt: post.publishDate.toISOString(),
    updatedAt: post.publishDate.toISOString(), // Use publishDate as fallback
    author: post.author,
    tags: post.tags,
    featuredImage: post.featuredImage,
  });
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.id,
  }));
}