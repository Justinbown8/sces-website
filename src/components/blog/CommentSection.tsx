'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: Date;
  approved: boolean;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: newComment.author,
        content: newComment.content,
        date: new Date(),
        approved: false // Comments need moderation
      };

      setComments([...comments, comment]);
      setNewComment({ author: '', email: '', content: '' });
      setIsSubmitting(false);
      setShowForm(false);
      
      // Show success message
      alert('Thank you for your comment! It will be reviewed before being published.');
    }, 1000);
  };

  const approvedComments = comments.filter(comment => comment.approved);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({approvedComments.length})
      </h3>

      {/* Existing Comments */}
      {approvedComments.length > 0 ? (
        <div className="space-y-6 mb-8">
          {approvedComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                <span className="text-sm text-gray-700">
                  {comment.date.toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-600">Be the first to comment on this post!</p>
        </div>
      )}

      {/* Comment Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Comment
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="author"
                required
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={newComment.email}
                onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <textarea
              id="content"
              required
              rows={4}
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Share your thoughts..."
            />
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Your comment will be reviewed before being published. Please be respectful and constructive.
          </p>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Comment'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}