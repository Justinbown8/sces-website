import React from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
  gradient?: boolean;
}

export function PlaceholderImage({ 
  width = 800, 
  height = 600, 
  text = "Image Placeholder",
  className,
  gradient = true
}: PlaceholderImageProps) {
  const gradientClass = gradient 
    ? "bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500"
    : "bg-gray-300";

  return (
    <div 
      className={cn(
        "flex items-center justify-center text-white font-semibold text-lg",
        gradientClass,
        className
      )}
      style={{ width, height }}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">📚</div>
        <div>{text}</div>
        <div className="text-sm opacity-75 mt-1">{width} × {height}</div>
      </div>
    </div>
  );
}

export default PlaceholderImage;