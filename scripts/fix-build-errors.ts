#!/usr/bin/env tsx

/**
 * Script to fix build-time API errors by adding fallback data
 * This prevents build failures when database/external services are unavailable
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const API_ROUTES_DIR = 'app/api';

// List of API routes that need build-time error handling
const ROUTES_TO_FIX = [
  'admin/payments',
  'admin/payments/pending-count',
  'admin/institutions',
  'admin/stats',
  'admin/performance',
  'admin/subscriptions',
  'admin/subscriptions/stats',
  'admin/settings/notifications/stats',
  'admin/settings/notifications/logs',
  'admin/settings/notifications/templates',
  'admin/question-banks',
  'admin/question-templates',
  'admin/live-classes',
  'admin/live-conversations',
  'admin/design-configs',
  'admin/design-configs/approve',
  'admin/tags',
  'admin/tags/analytics',
  'admin/users',
  'admin/revenue',
  'admin/performance/metrics',
  'admin/performance/health',
  'admin/system-health',
  'institution/payments',
  'institution/settings/payment-approval',
  'institution/settings/discount',
  'institution/stats',
  'institution/students',
  'institution/shared-questions',
  'institution/question-banks',
  'institution/question-templates',
  'institution/quizzes',
  'institution/live-classes',
  'institution/subscription',
  'institution/subscription/billing-history',
  'institution/subscriptions',
  'institution/analytics/stats',
  'institution/analytics/quiz-analytics',
  'institution/collaboration/stats',
  'institution/commission-rate',
  'institution/info',
  'institution/profile',
  'institution/instructors',
  'institution/design-configs',
  'institution/current',
  'institution/setup',
  'student/dashboard',
  'student/dashboard/stats',
  'student/dashboard/achievements',
  'student/dashboard/recent-modules',
  'student/dashboard/quiz-stats',
  'student/dashboard/courses',
  'student/progress',
  'student/progress-visualization',
  'student/learning-path',
  'student/recommendations',
  'student/subscription',
  'student/subscription/billing-history',
  'student/courses',
  'student/live-classes',
  'student/notifications',
  'student/profile',
  'student/calendar/events',
  'student/quiz',
  'student/exercises',
  'student/enrollments',
  'student/payments',
  'student/payments/initiate',
  'student/payments/process',
  'student/settings',
  'student/achievements',
  'student/achievements/leaderboard',
  'student/points/balance',
  'student/points/history',
  'student/points/earn',
  'student/rewards/available',
  'student/rewards/redeem',
  'student/connections/status',
  'student/connections/stats',
  'student/connections/requests',
  'student/connections/request',
  'student/connections/respond',
  'student/connections/achievements',
  'courses',
  'courses/search',
  'courses/public',
  'courses/by-country',
  'courses/slug',
  'institutions',
  'institutions/slug',
  'categories',
  'tags',
  'tags/public',
  'tags/analytics',
  'locations',
  'search',
  'stats',
  'notifications',
  'notifications/preferences',
  'notifications/send',
  'notifications/subscribe',
  'notifications/unsubscribe',
  'bookings',
  'bookings/update',
  'certificates',
  'certificates/stats',
  'certificates/verify',
  'ratings',
  'live-conversations',
  'live-conversations/usage',
  'live-sessions/attendance',
  'video-sessions',
  'video-sessions/analytics',
  'video-sessions/create',
  'video-sessions/institution',
  'community/announcements',
  'community/stats',
  'community/circles',
  'community/clubs',
  'community/badge-counts',
  'connections/achievements',
  'connections/points',
  'connections/rewards',
  'connections/status',
  'connections/stats',
  'connections/requests',
  'connections/request',
  'connections/respond',
  'language-proficiency-test',
  'platform-courses/enroll',
  'subscription/trial',
  'subscription/upgrade',
  'subscription/usage',
  'subscriptions/create',
  'payments',
  'upload',
  'images',
  'design-configs',
  'design-configs/public',
  'design-configs/default',
  'features/live-classes',
  'cron/payment-reminders',
  'cron/process-payment-attempts',
  'cron/reminders',
  'cron/trial-expiration',
  'webhooks/stripe',
  'webhooks/post-trial-payment',
  'webrtc',
  'revalidate',
  'socket',
  'placeholder',
  'debug',
  'test',
  'test-connection',
  'test-db',
  'test-session',
  'test-session-establishment'
];

function addBuildTimeErrorHandling(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // Skip if already has build-time error handling
    if (content.includes('isBuildTime()') || content.includes('_buildTime')) {
      return false;
    }

    // Add import if not present
    let newContent = content;
    if (!content.includes('isBuildTime')) {
      const importMatch = content.match(/import.*from.*['"]@\/lib\/.*['"];?\n/);
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
        newContent = content.slice(0, lastImportIndex) + 
                    "import { isBuildTime } from '@/lib/build-error-handler';\n" +
                    content.slice(lastImportIndex);
      } else {
        // Add after the first import
        const firstImportIndex = content.indexOf('import');
        const firstImportEnd = content.indexOf('\n', firstImportIndex) + 1;
        newContent = content.slice(0, firstImportEnd) + 
                    "import { isBuildTime } from '@/lib/build-error-handler';\n" +
                    content.slice(firstImportEnd);
      }
    }

    // Add build-time check in GET function
    const getFunctionMatch = newContent.match(/export async function GET\([^)]*\)\s*\{[^}]*try\s*\{/);
    if (getFunctionMatch) {
      const matchIndex = newContent.indexOf(getFunctionMatch[0]);
      const tryIndex = newContent.indexOf('try', matchIndex);
      const tryBraceIndex = newContent.indexOf('{', tryIndex);
      
      const buildTimeCheck = `
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }

`;
      
      newContent = newContent.slice(0, tryBraceIndex + 1) + 
                  buildTimeCheck + 
                  newContent.slice(tryBraceIndex + 1);
    }

    writeFileSync(filePath, newContent);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

function processApiRoutes(): void {
  console.log('🔧 Fixing build-time API errors...');
  
  let fixedCount = 0;
  let skippedCount = 0;
  
  for (const route of ROUTES_TO_FIX) {
    const routePath = join(API_ROUTES_DIR, route, 'route.ts');
    
    if (existsSync(routePath)) {
      if (addBuildTimeErrorHandling(routePath)) {
        console.log(`✅ Fixed: ${route}`);
        fixedCount++;
      } else {
        console.log(`⏭️  Skipped (already fixed): ${route}`);
        skippedCount++;
      }
    } else {
      console.log(`❌ Not found: ${route}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Fixed: ${fixedCount} routes`);
  console.log(`   Skipped: ${skippedCount} routes`);
  console.log(`   Total processed: ${ROUTES_TO_FIX.length} routes`);
}

// Run the script
if (require.main === module) {
  processApiRoutes();
}

export { processApiRoutes };
