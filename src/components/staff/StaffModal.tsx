'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { StaffMember } from '@/types';

interface StaffModalProps {
  member: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StaffModal({ member, isOpen, onClose }: StaffModalProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            {/* Photo */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {!imageError ? (
                <Image
                  src={member.image || '/placeholder-avatar.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Role */}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {member.name}
              </h2>
              <p className="text-xl text-blue-600 font-semibold">
                {member.role}
              </p>
            </div>
          </div>

          {/* Full Bio */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {member.bio}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/volunteer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Join Our Team
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}