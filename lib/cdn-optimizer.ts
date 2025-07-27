// CDN Optimizer for static assets and content delivery
import { NextRequest, NextResponse } from 'next/server';

// CDN Configuration
interface CDNConfig {
  provider: 'cloudflare' | 'aws-cloudfront' | 'vercel' | 'custom';
  domain: string;
  apiKey?: string;
  zoneId?: string;
  region?: string;
  cacheControl: {
    static: string;
    images: string;
    api: string;
    html: string;
  };
  compression: boolean;
  minification: boolean;
  imageOptimization: boolean;
}

// Asset types for different caching strategies
enum AssetType {
  STATIC = 'static',
  IMAGE = 'image',
  API = 'api',
  HTML = 'html',
  FONT = 'font',
  SCRIPT = 'script',
  STYLE = 'style'
}

// CDN URL generator
class CDNUrlGenerator {
  private config: CDNConfig;

  constructor(config: CDNConfig) {
    this.config = config;
  }

  // Generate CDN URL for static assets
  generateCDNUrl(path: string, assetType: AssetType = AssetType.STATIC): string {
    if (!this.config.domain) {
      return path; // Fallback to original path
    }

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Add version query parameter for cache busting
    const version = this.getAssetVersion(assetType);
    const separator = cleanPath.includes('?') ? '&' : '?';
    
    return `https://${this.config.domain}/${cleanPath}${separator}v=${version}`;
  }

  // Generate optimized image URL
  generateImageUrl(path: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  } = {}): string {
    if (!this.config.domain || !this.config.imageOptimization) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const params = new URLSearchParams();

    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format) params.append('f', options.format);
    if (options.fit) params.append('fit', options.fit);

    const version = this.getAssetVersion(AssetType.IMAGE);
    params.append('v', version);

    return `https://${this.config.domain}/${cleanPath}?${params.toString()}`;
  }

  // Get asset version for cache busting
  private getAssetVersion(assetType: AssetType): string {
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)); // Hour-based versioning
    
    switch (assetType) {
      case AssetType.STATIC:
        return `static-${timestamp}`;
      case AssetType.IMAGE:
        return `img-${timestamp}`;
      case AssetType.API:
        return `api-${timestamp}`;
      case AssetType.HTML:
        return `html-${timestamp}`;
      default:
        return `v-${timestamp}`;
    }
  }
}

// CDN Cache Manager
class CDNCacheManager {
  private config: CDNConfig;

  constructor(config: CDNConfig) {
    this.config = config;
  }

  // Get cache control header for asset type
  getCacheControl(assetType: AssetType): string {
    switch (assetType) {
      case AssetType.STATIC:
        return this.config.cacheControl.static;
      case AssetType.IMAGE:
        return this.config.cacheControl.images;
      case AssetType.API:
        return this.config.cacheControl.api;
      case AssetType.HTML:
        return this.config.cacheControl.html;
      case AssetType.FONT:
        return 'public, max-age=31536000, immutable'; // 1 year for fonts
      case AssetType.SCRIPT:
      case AssetType.STYLE:
        return 'public, max-age=86400, stale-while-revalidate=604800'; // 1 day with 1 week stale
      default:
        return 'public, max-age=3600'; // 1 hour default
    }
  }

  // Add CDN headers to response
  addCDNHeaders(response: NextResponse, assetType: AssetType): NextResponse {
    const cacheControl = this.getCacheControl(assetType);
    
    response.headers.set('Cache-Control', cacheControl);
    response.headers.set('CDN-Cache-Control', cacheControl);
    
    if (this.config.compression) {
      response.headers.set('Vary', 'Accept-Encoding');
    }

    // Add CDN provider specific headers
    if (this.config.provider === 'cloudflare') {
      response.headers.set('CF-Cache-Status', 'DYNAMIC');
    } else if (this.config.provider === 'aws-cloudfront') {
      response.headers.set('X-Cache', 'Miss from cloudfront');
    }

    return response;
  }
}

// CDN Purge Manager
class CDNPurgeManager {
  private config: CDNConfig;

  constructor(config: CDNConfig) {
    this.config = config;
  }

  // Purge CDN cache for specific paths
  async purgeCache(paths: string[]): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'cloudflare':
          return await this.purgeCloudflare(paths);
        case 'aws-cloudfront':
          return await this.purgeCloudFront(paths);
        case 'vercel':
          return await this.purgeVercel(paths);
        default:
          // // // // // // console.warn('CDN purge not implemented for provider:', this.config.provider);
          return false;
      }
    } catch (error) {
      console.error('CDN purge error:', error);
      return false;
    }
  }

  // Purge Cloudflare cache
  private async purgeCloudflare(paths: string[]): Promise<boolean> {
    if (!this.config.apiKey || !this.config.zoneId) {
      console.warn('Cloudflare API key or zone ID not configured');
      return false;
    }

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: paths.map(path => `https://${this.config.domain}${path}`)
      })
    });

    const result = await response.json();
    return result.success;
  }

  // Purge AWS CloudFront cache
  private async purgeCloudFront(paths: string[]): Promise<boolean> {
    // Implementation would require AWS SDK
    // // // // // // console.log('CloudFront purge not implemented - requires AWS SDK');
    return false;
  }

  // Purge Vercel cache
  private async purgeVercel(paths: string[]): Promise<boolean> {
    // Vercel automatically handles cache invalidation
    console.log('Vercel cache purge not needed - automatic invalidation');
    return true;
  }
}

// Main CDN Optimizer class
export class CDNOptimizer {
  private config: CDNConfig;
  private urlGenerator: CDNUrlGenerator;
  private cacheManager: CDNCacheManager;
  private purgeManager: CDNPurgeManager;

  constructor(config?: Partial<CDNConfig>) {
    this.config = {
      provider: (process.env.CDN_PROVIDER as any) || 'vercel',
      domain: process.env.CDN_DOMAIN || '',
      apiKey: process.env.CDN_API_KEY,
      zoneId: process.env.CDN_ZONE_ID,
      region: process.env.CDN_REGION,
      cacheControl: {
        static: 'public, max-age=31536000, immutable', // 1 year
        images: 'public, max-age=86400, stale-while-revalidate=604800', // 1 day with 1 week stale
        api: 'public, max-age=300, stale-while-revalidate=600', // 5 minutes with 10 minutes stale
        html: 'public, max-age=0, must-revalidate' // No cache for HTML
      },
      compression: true,
      minification: true,
      imageOptimization: true,
      ...config
    };

    this.urlGenerator = new CDNUrlGenerator(this.config);
    this.cacheManager = new CDNCacheManager(this.config);
    this.purgeManager = new CDNPurgeManager(this.config);
  }

  // Optimize static asset URLs
  optimizeAssetUrl(path: string, assetType: AssetType = AssetType.STATIC): string {
    return this.urlGenerator.generateCDNUrl(path, assetType);
  }

  // Optimize image URLs with transformation options
  optimizeImageUrl(path: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  } = {}): string {
    return this.urlGenerator.generateImageUrl(path, options);
  }

  // Add CDN headers to Next.js response
  addCDNHeaders(response: NextResponse, assetType: AssetType): NextResponse {
    return this.cacheManager.addCDNHeaders(response, assetType);
  }

  // Purge CDN cache
  async purgeCache(paths: string[]): Promise<boolean> {
    return await this.purgeManager.purgeCache(paths);
  }

  // Optimize Next.js request/response
  optimizeRequest(request: NextRequest, assetType: AssetType): NextRequest {
    // Add CDN-specific headers to request
    const optimizedRequest = request.clone();
    
    if (this.config.compression) {
      optimizedRequest.headers.set('Accept-Encoding', 'gzip, deflate, br');
    }

    return optimizedRequest;
  }

  // Optimize Next.js response
  optimizeResponse(response: NextResponse, assetType: AssetType): NextResponse {
    return this.addCDNHeaders(response, assetType);
  }

  // Get CDN configuration
  getConfig(): CDNConfig {
    return { ...this.config };
  }

  // Check if CDN is enabled
  isEnabled(): boolean {
    return !!this.config.domain;
  }

  // Get CDN domain
  getDomain(): string {
    return this.config.domain;
  }
}

// Middleware for CDN optimization
export function createCDNMiddleware(optimizer: CDNOptimizer) {
  return function cdnMiddleware(request: NextRequest) {
    if (!optimizer.isEnabled()) {
      return NextResponse.next();
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Determine asset type based on path
    let assetType = AssetType.STATIC;
    
    if (pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
      assetType = AssetType.IMAGE;
    } else if (pathname.match(/\.(js|mjs)$/i)) {
      assetType = AssetType.SCRIPT;
    } else if (pathname.match(/\.(css)$/i)) {
      assetType = AssetType.STYLE;
    } else if (pathname.match(/\.(woff|woff2|ttf|eot)$/i)) {
      assetType = AssetType.FONT;
    } else if (pathname.startsWith('/api/')) {
      assetType = AssetType.API;
    } else if (pathname.match(/\.(html|htm)$/i) || pathname === '/') {
      assetType = AssetType.HTML;
    }

    // Optimize request
    const optimizedRequest = optimizer.optimizeRequest(request, assetType);
    
    return NextResponse.next({
      request: optimizedRequest
    });
  };
}

// Utility functions for common CDN operations
export const cdnUtils = {
  // Optimize image for different screen sizes
  getResponsiveImageUrls(basePath: string, sizes: number[]): Record<string, string> {
    const optimizer = new CDNOptimizer();
    const urls: Record<string, string> = {};

    sizes.forEach(size => {
      urls[`${size}w`] = optimizer.optimizeImageUrl(basePath, { width: size, format: 'webp' });
    });

    return urls;
  },

  // Generate srcset for responsive images
  generateSrcSet(basePath: string, sizes: number[]): string {
    const urls = cdnUtils.getResponsiveImageUrls(basePath, sizes);
    return Object.entries(urls)
      .map(([size, url]) => `${url} ${size}`)
      .join(', ');
  },

  // Optimize multiple assets
  optimizeAssets(assets: Array<{ path: string; type: AssetType }>): Record<string, string> {
    const optimizer = new CDNOptimizer();
    const optimized: Record<string, string> = {};

    assets.forEach(({ path, type }) => {
      optimized[path] = optimizer.optimizeAssetUrl(path, type);
    });

    return optimized;
  }
};

// Export types and enums
export { AssetType };
export type { CDNConfig };

// Default CDN optimizer instance
export const cdnOptimizer = new CDNOptimizer(); 