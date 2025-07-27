import { NextResponse } from 'next/server'

export async function GET() {
  // Create a simple SVG placeholder for institution logos (1:1 aspect ratio)
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F3F4F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E5E7EB;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#grad1)" rx="8"/>
      <g transform="translate(100,100)">
        <!-- Building icon -->
        <rect x="-25" y="-20" width="50" height="40" fill="#9CA3AF" opacity="0.8" rx="4"/>
        <rect x="-20" y="-15" width="8" height="8" fill="#6B7280"/>
        <rect x="-8" y="-15" width="8" height="8" fill="#6B7280"/>
        <rect x="4" y="-15" width="8" height="8" fill="#6B7280"/>
        <rect x="16" y="-15" width="8" height="8" fill="#6B7280"/>
        <rect x="-20" y="-2" width="8" height="8" fill="#6B7280"/>
        <rect x="-8" y="-2" width="8" height="8" fill="#6B7280"/>
        <rect x="4" y="-2" width="8" height="8" fill="#6B7280"/>
        <rect x="16" y="-2" width="8" height="8" fill="#6B7280"/>
        <!-- Door -->
        <rect x="-4" y="8" width="8" height="12" fill="#4B5563"/>
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