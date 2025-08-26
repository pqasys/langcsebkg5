/**
 * Utility to check if code is running during build time
 */

export function isBuildTime(): boolean {
  // Check if we're in a build environment
  return process.env.NODE_ENV === 'production' && 
         (process.env.NEXT_PHASE === 'phase-production-build' || 
          process.env.NEXT_PHASE === 'phase-production-optimize' ||
          process.env.NEXT_PHASE === 'phase-production-compile');
}
