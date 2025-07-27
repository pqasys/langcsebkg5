import { NextResponse } from "next/server";
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);

// Performance monitoring
interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  queryCount?: number;
  cacheHits?: number;
  cacheMisses?: number;
}

class APIOptimizer {
  private static instance: APIOptimizer;
  private metrics: Map<string, PerformanceMetrics> = new Map();

  static getInstance(): APIOptimizer {
    if (!APIOptimizer.instance) {
      APIOptimizer.instance = new APIOptimizer();
    }
    return APIOptimizer.instance;
  }

  // Start performance tracking
  startTracking(requestId: string): void {
    this.metrics.set(requestId, {
      startTime: Date.now(),
      queryCount: 0,
      cacheHits: 0,
      cacheMisses: 0
    });
  }

  // End performance tracking
  endTracking(requestId: string): PerformanceMetrics | null {
    const metric = this.metrics.get(requestId);
    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      this.metrics.delete(requestId);
      return metric;
    }
    return null;
  }

  // Optimize response with compression and caching
  async optimizeResponse(
    data: unknown,
    options: {
      compress?: boolean;
      cache?: boolean;
      maxAge?: number;
      etag?: string;
      requestId?: string;
    } = {}
  ): Promise<NextResponse> {
    const {
      compress = true,
      cache = true,
      maxAge = 300, // 5 minutes
      etag,
      requestId
    } = options;

    let responseBody = JSON.stringify(data);
    let contentType = 'application/json';

    // Compress response if enabled and data is large enough
    if (compress && responseBody.length > 1024) {
      try {
        const compressed = await gzip(responseBody);
        responseBody = compressed.toString('base64');
        contentType = 'application/json+gzip';
      } catch (error) {
    console.error('Error occurred:', error);
        // // // // // // console.warn('Compression failed, falling back to uncompressed:', error);
      }
    }

    const response = new NextResponse(responseBody, {
      headers: {
        'Content-Type': contentType,
        'X-Response-Time': requestId ? 
          `${this.metrics.get(requestId)?.duration || 0}ms` : 'unknown',
        'X-Cache-Status': cache ? 'enabled' : 'disabled',
        ...(cache && {
          'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
          'ETag': etag || `"${Date.now()}"`,
          'Vary': 'Accept-Encoding'
        })
      }
    });

    return response;
  }

  // Add performance headers
  addPerformanceHeaders(response: NextResponse, metrics: PerformanceMetrics): NextResponse {
    response.headers.set('X-Response-Time', `${metrics.duration}ms`);
    response.headers.set('X-Query-Count', `${metrics.queryCount || 0}`);
    response.headers.set('X-Cache-Hits', `${metrics.cacheHits || 0}`);
    response.headers.set('X-Cache-Misses', `${metrics.cacheMisses || 0}`);
    return response;
  }

  // Generate ETag for caching
  generateETag(data: unknown): string {
    const content = JSON.stringify(data);
    const hash = require('crypto').createHash('md5').update(content).digest('hex');
    return `"${hash}"`;
  }

  // Check if client has cached version
  checkETag(request: Request, etag: string): boolean {
    const ifNoneMatch = request.headers.get('if-none-match');
    return ifNoneMatch === etag;
  }

  // Return 304 Not Modified if ETag matches
  returnNotModified(etag: string): NextResponse {
    return new NextResponse(null, {
      status: 304,
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
}

// Response optimization helpers
export const responseOptimizer = {
  // Optimize JSON response
  async json(data: unknown, options: {
    status?: number;
    compress?: boolean;
    cache?: boolean;
    maxAge?: number;
    requestId?: string;
  } = {}): Promise<NextResponse> {
    const optimizer = APIOptimizer.getInstance();
    const response = await optimizer.optimizeResponse(data, options);
    
    if (options.requestId) {
      const metrics = optimizer.endTracking(options.requestId);
      if (metrics) {
        optimizer.addPerformanceHeaders(response, metrics);
      }
    }

    return response;
  },

  // Optimize with ETag caching
  async cachedJson(
    data: unknown,
    request: Request,
    options: {
      status?: number;
      maxAge?: number;
      requestId?: string;
    } = {}
  ): Promise<NextResponse> {
    const optimizer = APIOptimizer.getInstance();
    const etag = optimizer.generateETag(data);

    // Check if client has cached version
    if (optimizer.checkETag(request, etag)) {
      return optimizer.returnNotModified(etag);
    }

    const response = await optimizer.optimizeResponse(data, {
      ...options,
      etag,
      cache: true
    });

    if (options.requestId) {
      const metrics = optimizer.endTracking(options.requestId);
      if (metrics) {
        optimizer.addPerformanceHeaders(response, metrics);
      }
    }

    return response;
  },

  // Start performance tracking
  startTracking(requestId: string): void {
    APIOptimizer.getInstance().startTracking(requestId);
  },

  // Error response with performance data
  error(
    error: string | Error,
    status: number = 500,
    requestId?: string
  ): NextResponse {
    const optimizer = APIOptimizer.getInstance();
    const errorData = {
      error: error instanceof Error ? error.message : error,
      timestamp: new Date().toISOString(),
      status
    };

    const response = new NextResponse(JSON.stringify(errorData), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

    if (requestId) {
      const metrics = optimizer.endTracking(requestId);
      if (metrics) {
        optimizer.addPerformanceHeaders(response, metrics);
      }
    }

    return response;
  }
};

export { APIOptimizer };

// Simple compression wrapper for NextResponse
export async function compressResponse(response: NextResponse): Promise<NextResponse> {
  const responseBody = await response.text();
  
  // Only compress if response is large enough and is JSON
  if (responseBody.length > 1024 && response.headers.get('content-type')?.includes('application/json')) {
    try {
      const compressed = await gzip(responseBody);
      const compressedResponse = new NextResponse(compressed, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'Content-Type': 'application/json+gzip',
          'Content-Encoding': 'gzip',
          'Content-Length': compressed.length.toString()
        }
      });
      return compressedResponse;
    } catch (error) {
    console.error('Error occurred:', error);
      console.warn('Compression failed, returning original response:', error);
    }
  }
  
  return response;
} 