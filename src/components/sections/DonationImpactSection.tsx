import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ImpactCardData {
  amount: number;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  color: string;
}

interface DonationImpactSectionProps {
  className?: string;
}

const impactCards: ImpactCardData[] = [
  {
    amount: 500,
    title: "School Kits",
    description: "Provide essential school supplies to help children succeed in their studies",
    icon: "🎒",
    benefits: [
      "Notebooks and textbooks",
      "Pens, pencils, and erasers",
      "School bag and supplies",
      "Basic geometry set"
    ],
    color: "from-blue-500 to-blue-600"
  },
  {
    amount: 1000,
    title: "Tuition Support",
    description: "Fund one month of quality tutoring for a child in need",
    icon: "📚",
    benefits: [
      "One-on-one tutoring sessions",
      "Subject-specific guidance",
      "Homework assistance",
      "Progress tracking"
    ],
    color: "from-green-500 to-green-600"
  },
  {
    amount: 2500,
    title: "Digital Access",
    description: "Bridge the digital divide with technology and internet access",
    icon: "💻",
    benefits: [
      "Tablet or laptop access",
      "Internet connectivity",
      "Digital learning resources",
      "Online course enrollment"
    ],
    color: "from-purple-500 to-purple-600"
  }
];

export function DonationImpactSection({ className }: DonationImpactSectionProps) {
  return (
    <section className={cn("py-16 bg-gray-50", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
            How Your Donation Helps
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Every rupee you donate makes a direct impact on a child's education. 
            See how your contribution transforms lives and creates opportunities.
          </p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {impactCards.map((card, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card Container */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full">
                {/* Card Header with Gradient */}
                <div className={cn(
                  "bg-gradient-to-r text-white p-6 text-center relative overflow-hidden",
                  card.color
                )}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-white transform rotate-12 scale-150"></div>
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-3 relative z-10">
                    {card.icon}
                  </div>
                  
                  {/* Amount */}
                  <div className="text-3xl font-bold mb-2 relative z-10">
                    ₹{card.amount.toLocaleString()}
                  </div>
                  
                  {/* Title */}
                  <div className="text-xl font-semibold relative z-10">
                    {card.title}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      What's Included:
                    </h4>
                    <ul className="space-y-2">
                      {card.benefits.map((benefit, benefitIndex) => (
                        <li 
                          key={benefitIndex}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Donate Button */}
                  <Button 
                    variant="primary" 
                    className="w-full group-hover:shadow-lg transition-shadow duration-300"
                    asChild
                  >
                    <Link href={`/donate?amount=${card.amount}`}>
                      Donate ₹{card.amount}
                    </Link>
                  </Button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Popular Badge for middle card */}
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Make a Custom Donation?
            </h3>
            <p className="text-gray-600 mb-6">
              Every amount makes a difference. Choose your own donation amount 
              and help us continue our mission of providing education to all children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/donate">
                  Make Custom Donation
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  Learn More About Our Work
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DonationImpactSection;