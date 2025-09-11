'use client';

import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

interface FundAllocation {
  category: string;
  percentage: number;
  description: string;
  color: string;
  icon: string;
}

interface FundsBreakdownProps {
  totalAmount?: number;
  showAnimation?: boolean;
}

const FUND_ALLOCATIONS: FundAllocation[] = [
  {
    category: 'Educational Programs',
    percentage: 65,
    description: 'Direct educational support, school supplies, and learning materials',
    color: 'bg-blue-500',
    icon: '📚',
  },
  {
    category: 'Teacher Training',
    percentage: 15,
    description: 'Training and development programs for educators',
    color: 'bg-green-500',
    icon: '👩‍🏫',
  },
  {
    category: 'Infrastructure',
    percentage: 12,
    description: 'Classroom facilities, digital learning tools, and equipment',
    color: 'bg-purple-500',
    icon: '🏫',
  },
  {
    category: 'Administrative',
    percentage: 8,
    description: 'Operational costs and program management',
    color: 'bg-orange-500',
    icon: '📊',
  },
];

export default function FundsBreakdown({ totalAmount, showAnimation = true }: FundsBreakdownProps) {
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>(
    showAnimation ? new Array(FUND_ALLOCATIONS.length).fill(0) : FUND_ALLOCATIONS.map(f => f.percentage)
  );

  useEffect(() => {
    if (!showAnimation) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      setAnimatedPercentages(
        FUND_ALLOCATIONS.map(allocation => 
          Math.round(allocation.percentage * easedProgress)
        )
      );

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedPercentages(FUND_ALLOCATIONS.map(f => f.percentage));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [showAnimation]);

  const calculateAmount = (percentage: number): number => {
    if (!totalAmount) return 0;
    return Math.round((totalAmount * percentage) / 100);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Where Your Funds Go</h3>
        <p className="text-gray-600">
          We are committed to transparency in how we use donations to maximize impact for children&apos;s education.
        </p>
      </div>

      <div className="space-y-6">
        {FUND_ALLOCATIONS.map((allocation, index) => {
          const animatedPercentage = animatedPercentages[index];
          const amount = calculateAmount(allocation.percentage);
          
          return (
            <div key={allocation.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label={allocation.category}>
                    {allocation.icon}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{allocation.category}</h4>
                    <p className="text-sm text-gray-600">{allocation.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {animatedPercentage}%
                  </div>
                  {totalAmount && (
                    <div className="text-sm text-gray-600">
                      ₹{amount.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${allocation.color} transition-all duration-300 ease-out rounded-full`}
                  style={{ 
                    width: `${animatedPercentage}%`,
                    transition: showAnimation ? 'width 0.1s ease-out' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 mt-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h5 className="font-semibold text-blue-900 mb-1">Transparency Commitment</h5>
            <p className="text-sm text-blue-800">
              We publish annual reports detailing our financial activities and impact metrics. 
              Every donation is tracked and allocated according to these percentages to ensure 
              maximum benefit for the children we serve.
            </p>
          </div>
        </div>
      </div>

      {totalAmount && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="text-center">
            <h5 className="font-semibold text-green-900 mb-2">Your Donation Impact</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-bold text-green-800">₹{calculateAmount(65).toLocaleString('en-IN')}</div>
                <div className="text-green-700">Direct Education Support</div>
              </div>
              <div>
                <div className="font-bold text-green-800">₹{calculateAmount(15).toLocaleString('en-IN')}</div>
                <div className="text-green-700">Teacher Development</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}