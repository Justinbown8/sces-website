'use client';

import { useState } from 'react';
import { StaffMember } from '@/types';
import { StaffCard } from './StaffCard';
import { StaffModal } from './StaffModal';

interface StaffSectionProps {
  staff: StaffMember[];
  title?: string;
  subtitle?: string;
}

export function StaffSection({ 
  staff, 
  title = "Meet Our Team",
  subtitle = "Dedicated professionals working to transform lives through education"
}: StaffSectionProps) {
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewBio = (member: StaffMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Staff Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member, index) => (
              <StaffCard
                key={index}
                member={member}
                onViewBio={handleViewBio}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-6">
              Interested in joining our mission? We're always looking for passionate individuals.
            </p>
            <a
              href="/volunteer"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join Our Team
            </a>
          </div>
        </div>
      </div>

      {/* Staff Modal */}
      <StaffModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}