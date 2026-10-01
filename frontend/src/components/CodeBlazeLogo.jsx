import React from 'react';

export default function CodeBlazeLogo({ size = 32, showText = true, className = '', textClassName = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} style={{ textDecoration: 'none' }}>
      {/* Blazing Code Icon */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          position: 'relative',
          borderRadius: `${Math.round(size * 0.28)}px`,
          background: 'linear-gradient(135deg, #161a29 0%, #0d0f17 100%)',
          border: '1px solid rgba(108, 142, 247, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(108, 142, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Ambient background flame aura */}
        <div
          style={{
            position: 'absolute',
            width: '120%',
            height: '120%',
            background: 'radial-gradient(circle at 50% 60%, rgba(244, 63, 94, 0.35) 0%, rgba(168, 85, 247, 0.25) 45%, rgba(108, 142, 247, 0) 75%)',
            pointerEvents: 'none'
          }}
        />

        {/* SVG Flame + Code Brackets Icon */}
        <svg
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <defs>
            {/* Left Bracket Gradient */}
            <linearGradient id="cb-bracket-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* Right Bracket Gradient */}
            <linearGradient id="cb-bracket-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            {/* Blaze Flame Core Gradient */}
            <linearGradient id="cb-flame-grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Inner Flame Glow */}
            <linearGradient id="cb-inner-flame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Left Bracket `<` */}
          <path
            d="M8.5 10L3.5 16L8.5 22"
            stroke="url(#cb-bracket-left)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Bracket `>` */}
          <path
            d="M23.5 10L28.5 16L23.5 22"
            stroke="url(#cb-bracket-right)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Outer Blaze Flame */}
          <path
            d="M16 4C17.2 7.5 20.5 10 20.5 15C20.5 19 18.2 21.5 16 22C13.8 21.5 11.5 19 11.5 15C11.5 11.8 13.5 9 14.5 7.5C14.8 10 16 11.5 16.5 11.5C17 11.5 16.5 8 16 4Z"
            fill="url(#cb-flame-grad)"
          />

          {/* Inner Fiery Core */}
          <path
            d="M16 13C16.8 14.8 18.2 16.2 18.2 18.2C18.2 20.2 17.2 21.2 16 21.5C14.8 21.2 13.8 20.2 13.8 18.2C13.8 16.5 15 15 15.5 14C15.7 15.2 16.3 15.8 16.6 15.8C16.8 15.8 16.3 14.5 16 13Z"
            fill="url(#cb-inner-flame)"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <div className={`flex items-center tracking-tight leading-none ${textClassName}`}>
          <span style={{ fontSize: `${Math.round(size * 0.58)}px`, fontWeight: 800, color: '#f1f3f9', letterSpacing: '-0.4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Code
          </span>
          <span
            style={{
              fontSize: `${Math.round(size * 0.58)}px`,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6c8ef7 0%, #a855f7 50%, #f43f5e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.4px',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Blaze
          </span>
        </div>
      )}
    </div>
  );
}
