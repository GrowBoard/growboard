import * as React from 'react';

export function GrowboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="boardBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2b38" />
          <stop offset="100%" stopColor="#0f0f15" />
        </linearGradient>
        <linearGradient id="activeBtn" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00C9FF" />
          <stop offset="100%" stopColor="#92FE9D" />
        </linearGradient>
        <linearGradient id="inactiveBtn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d1d26" />
          <stop offset="100%" stopColor="#131319" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={12} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx={0}
            dy={16}
            stdDeviation={24}
            floodColor="#000000"
            floodOpacity={0.6}
          />
        </filter>
      </defs>
      <rect
        x={40}
        y={40}
        width={432}
        height={432}
        rx={80}
        fill="url(#boardBg)"
        filter="url(#shadow)"
      />
      <rect
        x={40}
        y={40}
        width={432}
        height={432}
        rx={80}
        fill="none"
        stroke="#46495c"
        strokeWidth={4}
      />
      <rect
        x={44}
        y={44}
        width={424}
        height={424}
        rx={76}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.08}
        strokeWidth={2}
      />
      <rect
        x={96}
        y={96}
        width={88}
        height={88}
        rx={24}
        fill="url(#inactiveBtn)"
        stroke="#292936"
        strokeWidth={2}
      />
      <rect
        x={96}
        y={212}
        width={88}
        height={88}
        rx={24}
        fill="url(#inactiveBtn)"
        stroke="#292936"
        strokeWidth={2}
      />
      <rect
        x={212}
        y={328}
        width={88}
        height={88}
        rx={24}
        fill="url(#inactiveBtn)"
        stroke="#292936"
        strokeWidth={2}
      />
      <rect
        x={328}
        y={328}
        width={88}
        height={88}
        rx={24}
        fill="url(#inactiveBtn)"
        stroke="#292936"
        strokeWidth={2}
      />
      <g filter="url(#glow)">
        <rect
          x={96}
          y={328}
          width={88}
          height={88}
          rx={24}
          fill="url(#activeBtn)"
        />
        <rect
          x={212}
          y={212}
          width={88}
          height={88}
          rx={24}
          fill="url(#activeBtn)"
        />
        <rect
          x={328}
          y={96}
          width={88}
          height={88}
          rx={24}
          fill="url(#activeBtn)"
        />
        <rect
          x={212}
          y={96}
          width={88}
          height={88}
          rx={24}
          fill="url(#activeBtn)"
        />
        <rect
          x={328}
          y={212}
          width={88}
          height={88}
          rx={24}
          fill="url(#activeBtn)"
        />
      </g>
      <g
        stroke="#ffffff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.9}
      >
        <polyline points="140,372 256,256 372,140" />
        <polyline points="256,140 372,140 372,256" />
        <circle cx={140} cy={372} r={8} fill="#ffffff" stroke="none" />
        <circle cx={256} cy={256} r={8} fill="#ffffff" stroke="none" />
        <circle cx={372} cy={140} r={8} fill="#ffffff" stroke="none" />
      </g>
      <rect
        x={40}
        y={40}
        width={432}
        height={432}
        rx={80}
        fill="url(#activeBtn)"
        opacity={0.05}
        pointerEvents="none"
      />
    </svg>
  );
}
