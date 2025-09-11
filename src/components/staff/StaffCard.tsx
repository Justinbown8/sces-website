'use client';

import { useState } from 'react';
import Image from 'next/image';
import { StaffMember } from '@/types';
import { Card } from '@/components/ui/Card';

interface StaffCardProps {
  member: StaffMember;
  onViewBio: (member: StaffMember) => void;
}

export function StaffCard({ member, onViewBio }: StaffCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <div className="p-6">
        {/* Staff Photo */}
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
          {!imageError ? (
            <Image
              src={member.image || '/placeholder-avatar.jpg'}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
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

        {/* Staff Info */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {member.name}
          </h3>
          <p className="text-blue-600 font-semibold">
            {member.role}
          </p>
          
          {/* Short Bio Preview */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {member.bio.substring(0, 120)}...
          </p>

          {/* View Full Bio Button */}
          <button
            onClick={() => onViewBio(member)}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
          >
            Read Full Bio
            <svg 
              className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}