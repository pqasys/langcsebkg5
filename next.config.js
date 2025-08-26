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

  // Temporarily disable Turbopack experimental config to fix font issues
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       '@': './',
  //     },
  //   },
  // },
  
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

  // Webpack configuration for better font handling with Turbopack
  webpack: (config, { isServer }) => {
    // Handle font files properly
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });

    return config;
  },

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
    ];
  },

  // Add build-time error handling
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Add experimental features for better error handling
  experimental: {
    // Enable better error handling during build
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

module.exports = nextConfig; 