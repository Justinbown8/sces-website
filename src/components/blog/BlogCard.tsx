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
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.id}`}>
        {/* Featured Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          
          {/* Date Badge */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-sm font-semibold text-gray-900">
              {formatDate(post.publishDate)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Author and Read More */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {post.author}
              </span>
            </div>

            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
              Read More
              <svg 
                className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}