import { NextResponse } from 'next/server'

export async function GET() {
  // Create a simple SVG placeholder for institution cards (3:1 aspect ratio)
  const svg = `
    <svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#grad1)"/>
      <g transform="translate(300,100)">
        <!-- Building icon -->
        <rect x="-30" y="-20" width="60" height="40" fill="white" opacity="0.9" rx="4"/>
        <rect x="-25" y="-15" width="10" height="10" fill="#3B82F6"/>
        <rect x="-10" y="-15" width="10" height="10" fill="#3B82F6"/>
        <rect x="5" y="-15" width="10" height="10" fill="#3B82F6"/>
        <rect x="20" y="-15" width="10" height="10" fill="#3B82F6"/>
        <rect x="-25" y="0" width="10" height="10" fill="#3B82F6"/>
        <rect x="-10" y="0" width="10" height="10" fill="#3B82F6"/>
        <rect x="5" y="0" width="10" height="10" fill="#3B82F6"/>
        <rect x="20" y="0" width="10" height="10" fill="#3B82F6"/>
        <!-- Door -->
        <rect x="-5" y="5" width="10" height="15" fill="#1D4ED8"/>
        <!-- Text -->
        <text x="0" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
          Institution
        </text>
      </g>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
} 