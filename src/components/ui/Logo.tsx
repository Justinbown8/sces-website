import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SCES Rising Sun Logo"
    >
      {/* Sun rays */}
      <g className="text-yellow-500">
        <path d="M50 5 L50 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M73.5 13.4 L68.3 21.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M86.6 26.5 L78.3 31.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M95 50 L85 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M86.6 73.5 L78.3 68.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M73.5 86.6 L68.3 78.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 95 L50 85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M26.5 86.6 L31.7 78.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13.4 73.5 L21.7 68.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 50 L15 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13.4 26.5 L21.7 31.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M26.5 13.4 L31.7 21.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Sun circle with gradient */}
      <defs>
        <radialGradient id="sunGradient" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
      </defs>
      
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="url(#sunGradient)"
        className="drop-shadow-md"
      />
      
      {/* Inner highlight */}
      <circle
        cx="45"
        cy="45"
        r="8"
        fill="rgba(255, 255, 255, 0.3)"
        className="opacity-60"
      />
    </svg>
  );
};

export default Logo;