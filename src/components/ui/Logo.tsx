import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const selectedSize = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;

  return (
    <div className={`relative flex-shrink-0 ${selectedSize} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Sunrise_Children_Educational_Society-removebg-preview.svg"
        alt="SCES Logo"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};

export default Logo;