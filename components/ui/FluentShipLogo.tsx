'use client';

import React from 'react';

interface FluentShipLogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'default' | 'white' | 'gradient';
}

const FluentShipLogo: React.FC<FluentShipLogoProps> = ({
  width = 200,
  height = 150,
  className = '',
  variant = 'default'
}) => {
  // Generate unique IDs for gradients to avoid conflicts
  const uniqueId = React.useId();
  const boatGradientId = `boatGradient-${uniqueId}`;
  const sailGradientId = `sailGradient-${uniqueId}`;

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          boat: '#FFFFFF',
          sail: '#FFFFFF',
          mast: '#FFFFFF',
          figures: '#667eea',
          water: '#FFFFFF'
        };
      case 'gradient':
        return {
          boat: `url(#${boatGradientId})`,
          sail: `url(#${sailGradientId})`,
          mast: '#34495E',
          figures: '#ECF0F1',
          water: '#3498DB'
        };
      default:
        return {
          boat: '#667eea',
          sail: '#3498DB',
          mast: '#34495E',
          figures: '#ECF0F1',
          water: '#3498DB'
        };
    }
  };

  const colors = getColors();

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 300 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Always render defs to ensure consistent structure */}
      <defs>
        <linearGradient id={boatGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id={sailGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#3498DB', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#2980B9', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Hull of the boat */}
      <path 
        d="M50 140 Q100 170 150 170 Q200 170 250 140 L50 140 Z" 
        fill={colors.boat}
      />

      {/* Mast */}
      <rect 
        x="145" 
        y="60" 
        width="10" 
        height="80" 
        fill={colors.mast}
      />

      {/* Sail shaped like a speech bubble */}
      <path 
        d="M150 60 L150 120 Q180 110 190 90 Q180 80 165 70 L150 60 Z" 
        fill={colors.sail}
      />

      {/* Three figures (circles for heads, rectangles for bodies) */}
      <circle cx="90" cy="135" r="7" fill={colors.figures}/>
      <rect x="86" y="135" width="8" height="12" fill={colors.figures}/>

      <circle cx="130" cy="135" r="7" fill={colors.figures}/>
      <rect x="126" y="135" width="8" height="12" fill={colors.figures}/>

      <circle cx="170" cy="135" r="7" fill={colors.figures}/>
      <rect x="166" y="135" width="8" height="12" fill={colors.figures}/>

      {/* Water waves - always render but with conditional opacity */}
      <path 
        d="M30 180 Q80 170 130 180 Q180 190 230 180 Q280 170 330 180" 
        fill="none" 
        stroke={colors.water} 
        strokeWidth="2" 
        opacity={variant === 'gradient' ? "0.6" : "0"}
      />
      <path 
        d="M40 190 Q90 180 140 190 Q190 200 240 190 Q290 180 340 190" 
        fill="none" 
        stroke={colors.water} 
        strokeWidth="1" 
        opacity={variant === 'gradient' ? "0.4" : "0"}
      />
    </svg>
  );
};

export default FluentShipLogo; 