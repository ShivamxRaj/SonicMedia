import React from 'react';

/** Original SonicMedia brand mark: a flowing S-wave with forward motion. */
export default function SonicLogo({ size = 42, className = '' }) {
  const gradientId = `sonic-logo-gradient-${size}`;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="SonicMedia logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="4" x2="57" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4B5FD" />
          <stop offset="0.52" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="19" fill={`url(#${gradientId})`} />
      <rect x="2.75" y="2.75" width="58.5" height="58.5" rx="18.25" stroke="white" strokeOpacity="0.24" strokeWidth="1.5" />
      <path
        d="M43.5 18.5C39.8 14.7 31.6 14 25.7 16.4C20.6 18.5 18.9 22 21.1 25.5C23 28.5 27.4 29.6 33.2 31.1C39.5 32.7 43.3 35.2 42.4 39.7C41.3 45.3 33.3 48.2 26.3 46.6C22.8 45.8 20.2 44.2 18.7 42"
        stroke="white"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      <path d="M43.2 18.5L49 18.5L45.9 23.4" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18.8" cy="42" r="2.4" fill="white" />
    </svg>
  );
}
