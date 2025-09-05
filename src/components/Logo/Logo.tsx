import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className || ''}`}>
      <svg
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.logoSvg}
      >
        {/* Color palette icon */}
        <g className={styles.palette}>
          {/* Main palette shape */}
          <path
            d="M8 6C8 3.79086 9.79086 2 12 2H28C30.2091 2 32 3.79086 32 6V18C32 20.2091 30.2091 22 28 22H20L16 26L12 22H12C9.79086 22 8 20.2091 8 18V6Z"
            fill="var(--gray-100)"
            stroke="var(--gray-300)"
            strokeWidth="1"
          />
          
          {/* Color swatches */}
          <rect x="12" y="6" width="4" height="4" rx="1" fill="#3B82F6" />
          <rect x="18" y="6" width="4" height="4" rx="1" fill="#10B981" />
          <rect x="24" y="6" width="4" height="4" rx="1" fill="#F59E0B" />
          
          <rect x="12" y="12" width="4" height="4" rx="1" fill="#EF4444" />
          <rect x="18" y="12" width="4" height="4" rx="1" fill="#8B5CF6" />
          <rect x="24" y="12" width="4" height="4" rx="1" fill="#EC4899" />
        </g>
        
        {/* Text */}
        <g className={styles.text}>
          <text
            x="44"
            y="12"
            fontSize="11"
            fontWeight="600"
            fill="var(--gray-800)"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Color
          </text>
          <text
            x="44"
            y="24"
            fontSize="11"
            fontWeight="400"
            fill="var(--gray-600)"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Shader
          </text>
        </g>
        
        {/* Decorative gradient line */}
        <defs>
          <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="20%" stopColor="#10B981" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#EF4444" />
            <stop offset="80%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <rect
          x="44"
          y="28"
          width="32"
          height="2"
          rx="1"
          fill="url(#gradientLine)"
          className={styles.gradientLine}
        />
      </svg>
    </div>
  );
};

export default Logo;
