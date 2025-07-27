import { NextResponse } from 'next/server'

export async function GET() {
  // Create a simple SVG placeholder for institution facilities (1:1 aspect ratio)
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F3F4F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E5E7EB;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad1)" rx="8"/>
      <g transform="translate(200,200)">
        <!-- Classroom icon -->
        <rect x="-40" y="-30" width="80" height="60" fill="#9CA3AF" opacity="0.8" rx="6"/>
        <!-- Windows -->
        <rect x="-30" y="-20" width="12" height="12" fill="#6B7280"/>
        <rect x="-12" y="-20" width="12" height="12" fill="#6B7280"/>
        <rect x="6" y="-20" width="12" height="12" fill="#6B7280"/>
        <rect x="24" y="-20" width="12" height="12" fill="#6B7280"/>
        <!-- Door -->
        <rect x="-8" y="10" width="16" height="20" fill="#4B5563"/>
        <!-- Chairs -->
        <rect x="-25" y="5" width="8" height="6" fill="#6B7280" rx="2"/>
        <rect x="-13" y="5" width="8" height="6" fill="#6B7280" rx="2"/>
        <rect x="-1" y="5" width="8" height="6" fill="#6B7280" rx="2"/>
        <rect x="11" y="5" width="8" height="6" fill="#6B7280" rx="2"/>
        <rect x="23" y="5" width="8" height="6" fill="#6B7280" rx="2"/>
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