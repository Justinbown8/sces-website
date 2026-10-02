import React from 'react';
import { ImpactStats } from '@/components/sections/ImpactStats';
import { cn } from '@/lib/utils';

interface MissionSectionProps {
  className?: string;
}

export function MissionSection({ className }: MissionSectionProps) {
  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Mission Header */}
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
            Our Mission
          </h2>
          
          {/* Mission Content */}
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-12">
            <p>
              At Sunrise Children Educational Society, we believe that education is the key to breaking 
              the cycle of poverty. We work tirelessly to provide educational resources, support, and 
              opportunities to children who need them most.
            </p>
            
            <p>
              Our dedicated team of volunteers and educators are committed to creating lasting change 
              in underserved communities across India. Through innovative programs, direct support, 
              and community engagement, we ensure that every child has access to quality education 
              regardless of their economic background.
            </p>
            
            <p>
              Together, we are building a brighter future where education empowers children to reach 
              their full potential and contribute meaningfully to society. Every donation, every 
              volunteer hour, and every act of support brings us closer to our vision of universal 
              educational access.
            </p>
          </div>
        </div>

        {/* Metrics Display */}
        <ImpactStats className="max-w-6xl mx-auto" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Additional Impact Statement */}
          <div className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <p className="text-lg font-medium text-gray-800">
              &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo; 
              <span className="block text-base text-gray-600 mt-2 italic">- Nelson Mandela</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionSection;