import React from 'react';

interface OosabLogoProps {
  tone?: 'light' | 'dark';
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
}

export const OosabLogo: React.FC<OosabLogoProps> = ({
  tone = 'light',
  size = 30,
  showWordmark = true,
  wordmarkClassName = 'text-lg sm:text-[21px]',
  className = '',
}) => {
  const isDarkSurface = tone === 'dark';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M 6.33 20.10 A 10.5 10.5 0 0 1 20.10 6.33"
          className={isDarkSurface ? 'stroke-[#7FE85B]' : 'stroke-[#0B3B2E]'}
          strokeWidth="4.4"
          strokeLinecap="round"
        />
        <path
          d="M 25.67 11.90 A 10.5 10.5 0 0 1 11.90 25.67"
          stroke="#5EE048"
          strokeWidth="4.4"
          strokeLinecap="round"
        />
        <rect
          x="16"
          y="11.6"
          width="6.2"
          height="6.2"
          rx="1.5"
          transform="rotate(45 16 11.6)"
          className={isDarkSurface ? 'fill-[#E5EFEA]' : 'fill-[#1F6F54]'}
        />
      </svg>
      {showWordmark && (
        <span
          className={`font-display font-bold tracking-[0.12em] ${
            isDarkSurface ? 'text-[#F1F5F4]' : 'text-[#0E1715]'
          } ${wordmarkClassName}`}
        >
          OOSAB
        </span>
      )}
    </span>
  );
};
