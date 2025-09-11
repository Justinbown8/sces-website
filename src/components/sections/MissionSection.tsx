import React from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { cn } from '@/lib/utils';

interface MetricProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: string;
}

interface MissionSectionProps {
  className?: string;
}

const metrics: MetricProps[] = [
  {
    value: 500,
    label: "Children Helped",
    suffix: "+",
    icon: "👨‍🎓"
  },
  {
    value: 50,
    label: "Volunteers",
    suffix: "+",
    icon: "🤝"
  },
  {
    value: 10,
    label: "Cities Reached",
    suffix: "+",
    icon: "🏙️"
  }
];

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
          
          {/* Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="text-center group"
              >
                {/* Icon */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {metric.icon}
                </div>
                
                {/* Counter */}
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text mb-2">
                  <AnimatedCounter
                    end={metric.value}
                    suffix={metric.suffix}
                    prefix={metric.prefix}
                    duration={2500}
                  />
                </div>
                
                {/* Label */}
                <div className="text-gray-600 font-medium text-lg">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Impact Statement */}
          <div className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <p className="text-lg font-medium text-gray-800">
              "Education is the most powerful weapon which you can use to change the world." 
              <span className="block text-base text-gray-600 mt-2 italic">- Nelson Mandela</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionSection;