'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { navigateUtils } from '@/lib/navigation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isChunkError: boolean;
}

export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isChunkError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a chunk loading error
    const isChunkError = 
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('ChunkLoadError') ||
      error.message.includes('_next/static/chunks');

    return {
      hasError: true,
      error,
      isChunkError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChunkErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error reporting service if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  handleRetry = () => {
    // Clear the error state
    this.setState({
      hasError: false,
      error: undefined,
      isChunkError: false,
    });

    // Force a page reload to clear any cached chunks
    if (typeof window !== 'undefined') {
      navigateUtils.reload();
    }
  };

  handleClearCache = () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      // Clear all caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        // Reload the page after clearing cache
        navigateUtils.reload();
      });
    } else {
      // Fallback to simple reload
      navigateUtils.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-auto p-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">
                {this.state.isChunkError ? 'Loading Error' : 'Something went wrong'}
              </AlertTitle>
              <AlertDescription className="text-red-700 mt-2">
                {this.state.isChunkError ? (
                  <>
                    We encountered an issue loading the page content. This usually happens when:
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>The page was recently updated</li>
                      <li>Your browser cache is outdated</li>
                      <li>There was a temporary network issue</li>
                    </ul>
                  </>
                ) : (
                  'An unexpected error occurred. Please try refreshing the page.'
                )}
              </AlertDescription>
            </Alert>

            <div className="mt-6 space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              {this.state.isChunkError && (
                <Button 
                  onClick={this.handleClearCache}
                  className="w-full"
                  variant="outline"
                >
                  Clear Cache & Reload
                </Button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-4 bg-gray-100 rounded-md">
                <summary className="cursor-pointer font-medium text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useChunkErrorHandler() {
  const handleChunkError = (error: Error) => {
    if (
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('ChunkLoadError')
    ) {
      // Clear cache and reload
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        }).then(() => {
          navigateUtils.reload();
        });
      } else {
        navigateUtils.reload();
      }
    }
  };

  return { handleChunkError };
}

// Global error handler for chunk loading errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.error?.name === 'ChunkLoadError' ||
      event.message?.includes('Loading chunk') ||
      event.message?.includes('ChunkLoadError')
    ) {
      // // // // // // console.warn('Chunk loading error detected, attempting recovery...');
      
      // Try to reload the page after a short delay
      setTimeout(() => {
        navigateUtils.reload();
      }, 1000);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.name === 'ChunkLoadError' ||
      event.reason?.message?.includes('Loading chunk') ||
      event.reason?.message?.includes('ChunkLoadError')
    ) {
      console.warn('Unhandled chunk loading error, attempting recovery...');
      event.preventDefault();
      
      setTimeout(() => {
        navigateUtils.reload();
      }, 1000);
    }
  });
} 