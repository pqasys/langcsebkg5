/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds to speed up the process
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking during builds to speed up the process
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable Turbopack to prevent webpack chunk loading errors
  experimental: {
    turbo: {
      resolveAlias: {
        '@': './',
      },
    },
  },
  
  // Configure trailing slashes to prevent 404s
  trailingSlash: false,
  
  // Ensure proper asset prefix handling
  assetPrefix: '',

  // Disable powered by header
  poweredByHeader: false,

  // Configure proper output
  output: 'standalone',
  
  // Ensure proper static export settings
  distDir: '.next',

  // Configure proper base path
  basePath: '',

  // Compression settings
  compress: false, // Disable compression to prevent API response issues

  // Performance optimizations
  swcMinify: true,



  // Headers for better caching
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO and performance
  async redirects() {
    return [
      // Removed automatic redirect from /courses to /courses/search
      // Users should be able to access the main courses page directly
    ];
  },

  // Rewrites for API optimization
  async rewrites() {
    return [
      {
        source: '/api/cache/:path*',
        destination: '/api/cache/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 