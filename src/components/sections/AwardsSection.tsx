import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AwardCard {
  title: string;
  organization: string;
  year: string;
  description: string;
  image: string;
}

const awards: AwardCard[] = [
  {
    title: "National Excellence Award 2025",
    organization: "Tretayug Foundation",
    year: "2025",
    description: "In recognition of dedication, achievements, and contributions that reflect the vision and spirit of Dr. A.P.J. Abdul Kalam.",
    image: "/images/awards/excellence-2025.png"
  },
  {
    title: "All India Best Woman Icon Award",
    organization: "Rashtriya Mahila Jagriti Manch",
    year: "2021",
    description: "Honoring achievements in chosen fields and service to the community.",
    image: "/images/awards/woman-icon.png"
  },
  {
    title: "Samman Patra (Corona Service)",
    organization: "Punjabi Society (Regd)",
    year: "2022",
    description: "Awarded for continuous service and help during the Corona tragedy.",
    image: "/images/awards/punjabi-society.png"
  },
  {
    title: "Prashasti Patra",
    organization: "Mahila Evam Bal Vikas Sangathan",
    year: "2021",
    description: "For participating in and supporting Free Medical Health Checkup Camps.",
    image: "/images/awards/mahila-bal-vikas.png"
  },
  {
    title: "Certificate of Appreciation",
    organization: "R.K. Foundation For Life",
    year: "2021",
    description: "Recognition for active participation in Blood Donation Camps for children with Thalassemia.",
    image: "/images/awards/rk-foundation.png"
  }
];

export function AwardsSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 bg-white overflow-hidden", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-blue-900 mb-6 tracking-tight">
            Awards & Recognition
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mb-8" />
          <p className="text-lg text-gray-600 leading-relaxed">
            Celebrating the milestones and honors that recognize our commitment to excellence
            and our unwavering dedication to serving the community.
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {awards.map((award, index) => (
            <div
              key={index}
              className="group relative flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 flex items-center justify-center p-8 group-hover:bg-blue-50/30 transition-colors duration-500">
                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
                  <Image
                    src={award.image}
                    alt={award.title}
                    fill
                    className="object-contain drop-shadow-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-50 text-blue-600 border border-blue-100">
                    {award.year}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                  {award.title}
                </h3>

                <p className="text-sm font-semibold text-blue-600/80 mb-4 tracking-wide uppercase italic">
                  {award.organization}
                </p>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {award.description}
                </p>

                {/* Footer Decoration */}
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center">
                  <div className="w-8 h-px bg-blue-200" />
                  <span className="mx-3 text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">
                    Official Recognition
                  </span>
                  <div className="flex-grow h-px bg-blue-50" />
                </div>
              </div>

              {/* Hover Accent Animation */}
              <div className="absolute top-0 left-0 w-1.5 h-0 bg-blue-600 group-hover:h-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-20 flex justify-center opacity-30 select-none pointer-events-none">
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-600/40" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AwardsSection;
