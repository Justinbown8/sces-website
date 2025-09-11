'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  triggerOnView?: boolean;
}

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  triggerOnView = true
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Ensure component is mounted before starting animations (prevents hydration issues)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Don't animate until component is mounted (prevents hydration mismatch)
    if (!isMounted) return;

    if (!triggerOnView) {
      animateCounter();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          animateCounter();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, triggerOnView, isMounted]);

  const animateCounter = () => {
    let startTime: number | null = null;
    const startValue = start;
    const endValue = end;
    const totalChange = endValue - startValue;

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (totalChange * easeOutQuart));
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Show initial value during SSR and before hydration
  if (!isMounted) {
    return (
      <span 
        ref={counterRef}
        className={cn('tabular-nums', className)}
      >
        {prefix}{start.toLocaleString()}{suffix}
      </span>
    );
  }

  return (
    <span 
      ref={counterRef}
      className={cn('tabular-nums', className)}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default AnimatedCounter;