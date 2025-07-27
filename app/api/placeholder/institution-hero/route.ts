import { NextResponse } from 'next/server'

export async function GET() {
  // Create a larger SVG placeholder for institution hero sections
  const svg = `
    <svg width="1200" height="384" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1E40AF;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(0,0,0,0.1);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="384" fill="url(#grad1)"/>
      <rect width="1200" height="384" fill="url(#grad2)"/>
      
      <!-- Background pattern -->
      <g opacity="0.1">
        <circle cx="100" cy="100" r="2" fill="white"/>
        <circle cx="300" cy="150" r="1.5" fill="white"/>
        <circle cx="500" cy="80" r="2.5" fill="white"/>
        <circle cx="700" cy="200" r="1" fill="white"/>
        <circle cx="900" cy="120" r="2" fill="white"/>
        <circle cx="1100" cy="180" r="1.5" fill="white"/>
        <circle cx="200" cy="300" r="1" fill="white"/>
        <circle cx="400" cy="250" r="2" fill="white"/>
        <circle cx="600" cy="320" r="1.5" fill="white"/>
        <circle cx="800" cy="280" r="2.5" fill="white"/>
        <circle cx="1000" cy="350" r="1" fill="white"/>
      </g>
      
      <g transform="translate(600,192)">
        <!-- Large building icon -->
        <rect x="-50" y="-30" width="100" height="60" fill="white" opacity="0.95" rx="6"/>
        <rect x="-40" y="-20" width="15" height="15" fill="#3B82F6"/>
        <rect x="-20" y="-20" width="15" height="15" fill="#3B82F6"/>
        <rect x="0" y="-20" width="15" height="15" fill="#3B82F6"/>
        <rect x="20" y="-20" width="15" height="15" fill="#3B82F6"/>
        <rect x="40" y="-20" width="15" height="15" fill="#3B82F6"/>
        <rect x="-40" y="0" width="15" height="15" fill="#3B82F6"/>
        <rect x="-20" y="0" width="15" height="15" fill="#3B82F6"/>
        <rect x="0" y="0" width="15" height="15" fill="#3B82F6"/>
        <rect x="20" y="0" width="15" height="15" fill="#3B82F6"/>
        <rect x="40" y="0" width="15" height="15" fill="#3B82F6"/>
        <!-- Door -->
        <rect x="-8" y="8" width="16" height="22" fill="#1D4ED8"/>
        <!-- Text -->
        <text x="0" y="50" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
          Institution
        </text>
        <text x="0" y="70" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" opacity="0.8">
          Add your main image
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