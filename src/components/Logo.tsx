interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

export function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const logoSrc = variant === 'full' ? '/logo.svg' : '/logo-icon.svg';

  return (
    <img 
      src={logoSrc} 
      alt="LiquidX Logo" 
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}

// Inline SVG version for better control
export function LogoInline({ className = '' }: { className?: string }) {
  return (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4DA2FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
        </linearGradient>
        
        <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1f2937', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Liquid flow background */}
      <path 
        d="M 10 24 Q 20 20, 32 24 T 54 24" 
        stroke="url(#liquidGrad)" 
        strokeWidth="2" 
        fill="none" 
        opacity="0.5"
      >
        <animate 
          attributeName="d" 
          dur="3s" 
          repeatCount="indefinite"
          values="M 10 24 Q 20 20, 32 24 T 54 24;
                  M 10 24 Q 20 28, 32 24 T 54 24;
                  M 10 24 Q 20 20, 32 24 T 54 24"
        />
      </path>
      
      <path 
        d="M 10 32 Q 20 28, 32 32 T 54 32" 
        stroke="url(#liquidGrad)" 
        strokeWidth="2" 
        fill="none" 
        opacity="0.5"
      >
        <animate 
          attributeName="d" 
          dur="3s" 
          repeatCount="indefinite"
          begin="0.5s"
          values="M 10 32 Q 20 28, 32 32 T 54 32;
                  M 10 32 Q 20 36, 32 32 T 54 32;
                  M 10 32 Q 20 28, 32 32 T 54 32"
        />
      </path>

      {/* "LX" Icon */}
      <g>
        {/* L */}
        <path 
          d="M 16 14 L 16 38 L 28 38" 
          stroke="url(#darkGrad)" 
          strokeWidth="5" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* X */}
        <path 
          d="M 34 14 L 52 38 M 52 14 L 34 38" 
          stroke="url(#darkGrad)" 
          strokeWidth="5" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Flow indicators */}
        <circle cx="30" cy="26" r="2" fill="#4DA2FF" />
        <circle cx="54" cy="26" r="2" fill="#4DA2FF">
          <animate 
            attributeName="opacity" 
            values="0.3;1;0.3" 
            dur="2s" 
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
