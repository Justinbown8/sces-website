'use client';

import { BlogCard } from '@/components/blog/BlogCard';
import { BlogFilter } from '@/components/blog/BlogFilter';
import { blogPosts, blogCategories } from '@/config/blog';
import { useState } from 'react';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.tags.includes(activeCategory));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Our Blog
            </h1>
            <p className="text-xl lg:text-2xl text-blue-50 leading-relaxed">
              Stories, insights, and updates from our mission to transform education 
              and empower children across India.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter */}
            <BlogFilter
              categories={blogCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Blog Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600">
                  No blog posts match the selected category. Try selecting a different category.
                </p>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive the latest stories, updates, and insights 
                about our educational programs and community impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}