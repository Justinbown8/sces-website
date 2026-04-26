import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Card } from '@/components/ui/Card';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="group overflow-hidden flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <Link href={`/blog/${post.id}`} className="flex flex-col h-full">
        {/* Featured Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
              <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          
          {/* Date Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-4 py-2 border border-white/50">
            <span className="text-xs font-bold text-gray-900 tracking-tight">
              {formatDate(post.publishDate)}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-8 flex flex-col flex-grow">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2 min-h-[3rem]">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 leading-relaxed text-sm mb-8 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>

          {/* Footer: Author and Button */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-900 truncate">
                  {post.author}
                </span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  Author
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              Read More
              <svg 
                className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}