'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { cn } from '@/lib/utils';

interface Metric {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon: string;
  caption: string;
}

const metrics: Metric[] = [
  {
    value: 5000,
    label: 'Children Helped',
    suffix: '+',
    icon: '👨‍🎓',
    caption: 'Education, care & opportunity'
  },
  {
    value: 50,
    label: 'Volunteers',
    suffix: '+',
    icon: '🤝',
    caption: 'Hands building brighter futures'
  },
  {
    value: 10,
    label: 'Cities Reached',
    suffix: '+',
    icon: '🏙️',
    caption: 'Growing communities nationwide'
  }
];

export function ImpactStats({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={cn(
        'relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-10 sm:py-14 lg:px-14',
        'bg-gradient-to-br from-[#1E3A8A] via-[#1d4ed8] to-[#3B82F6]',
        'shadow-2xl shadow-blue-900/30',
        className
      )}
    >
      {/* Ambient brand glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#FFD700]/25 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[#FF8C00]/25 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.45),transparent_62%)]" />
      </div>

      {/* Kicker */}
      <div
        className={cn(
          'relative text-center transition-all duration-700 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#FFE066] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700] animate-pulse" />
          Our Impact in Numbers
        </span>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-blue-100/80 sm:text-base">
          Real change, measured in lives touched, hands raised and communities transformed.
        </p>
      </div>

      {/* Stats */}
      <div className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5 lg:gap-8">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            style={{ transitionDelay: `${index * 140}ms` }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-7 text-center backdrop-blur-sm',
              'transition-all duration-700 ease-out',
              'hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-950/30',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}
          >
            {/* Hover sheen */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-sheen"
            />

            {/* Top accent */}
            <span
              aria-hidden
              className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/80 to-transparent"
            />

            {/* Icon */}
            <div className="relative mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF8C00] shadow-lg shadow-orange-500/40 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-3xl animate-float" role="img" aria-label={metric.label}>
                {metric.icon}
              </span>
            </div>

            {/* Counter */}
            <div className="font-heading text-4xl font-bold leading-none tracking-tight text-transparent sm:text-5xl bg-gradient-to-r from-[#FFE066] via-[#FFD700] to-[#FF8C00] bg-clip-text">
              <AnimatedCounter
                end={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
                duration={2200}
              />
            </div>

            {/* Label */}
            <div className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-50 sm:text-base">
              {metric.label}
            </div>

            {/* Caption */}
            <p className="mt-2 text-xs text-blue-100/70 sm:text-sm">{metric.caption}</p>

            {/* Bottom accent */}
            <span
              aria-hidden
              className="mx-auto mt-5 block h-0.5 w-10 rounded-full bg-[#FFD700]/60 transition-all duration-500 group-hover:w-20 group-hover:bg-[#FFD700]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImpactStats;
