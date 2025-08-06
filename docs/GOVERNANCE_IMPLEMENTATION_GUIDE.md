# Governance Implementation Guide

## Overview

This document provides a comprehensive guide to the governance implementation for the course booking platform. The governance system ensures proper access control, quota management, and subscription-based enrollment for courses and live classes.

## Architecture Overview

### Core Components

1. **Subscription Management Service** (`lib/subscription-management-service.ts`)
   - Handles subscription upgrades/downgrades
   - Manages quota tracking and validation
   - Implements grace periods and prorated billing

2. **Live Class Governance Service** (`lib/live-class-governance-service.ts`)
   - Validates live class creation
   - Manages instructor availability and limits
   - Controls access to live classes

3. **Platform Course Governance Service** (`lib/platform-course-governance-service.ts`)
   - Manages platform-wide course enrollments
   - Validates subscription-based access
   - Tracks enrollment quotas

4. **Usage Analytics Service** (`lib/usage-analytics-service.ts`)
   - Monitors system health and usage
   - Generates reports and alerts
   - Tracks user behavior patterns

## Database Schema Changes

### New Tables

```sql
-- Subscription logs for tracking changes
CREATE TABLE subscription_logs (
  id VARCHAR(191) PRIMARY KEY,
  subscriptionId VARCHAR(191) NOT NULL,
  action VARCHAR(50) NOT NULL,
  userId VARCHAR(191) NOT NULL,
  reason TEXT,
  metadata JSON,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

-- Audit logs for system monitoring
CREATE TABLE audit_logs (
  id VARCHAR(191) PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  userId VARCHAR(191) NOT NULL,
  resourceType VARCHAR(50),
  resourceId VARCHAR(191),
  details JSON,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

-- System notifications
CREATE TABLE system_notifications (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  isRead BOOLEAN DEFAULT FALSE,
  metadata JSON,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);
```

### Modified Tables

#### StudentTier
```sql
ALTER TABLE student_tiers ADD COLUMN maxLiveClasses INT DEFAULT 10;
ALTER TABLE student_tiers ADD COLUMN maxStudents INT DEFAULT 1;
ALTER TABLE student_tiers ADD COLUMN maxInstructors INT DEFAULT 1;
ALTER TABLE student_tiers ADD COLUMN enrollmentQuota INT DEFAULT 5;
ALTER TABLE student_tiers ADD COLUMN attendanceQuota INT DEFAULT 20;
ALTER TABLE student_tiers ADD COLUMN gracePeriodDays INT DEFAULT 7;
```

#### StudentSubscription
```sql
ALTER TABLE student_subscriptions ADD COLUMN maxEnrollments INT DEFAULT 1;
ALTER TABLE student_subscriptions ADD COLUMN enrollmentQuota INT DEFAULT 1;
ALTER TABLE student_subscriptions ADD COLUMN attendanceQuota INT DEFAULT 10;
ALTER TABLE student_subscriptions ADD COLUMN currentEnrollments INT DEFAULT 0;
ALTER TABLE student_subscriptions ADD COLUMN monthlyEnrollments INT DEFAULT 0;
ALTER TABLE student_subscriptions ADD COLUMN monthlyAttendance INT DEFAULT 0;
```

#### StudentCourseEnrollment
```sql
ALTER TABLE student_course_enrollments ADD COLUMN accessMethod VARCHAR(20) DEFAULT 'DIRECT';
ALTER TABLE student_course_enrollments ADD COLUMN subscriptionTier VARCHAR(20);
ALTER TABLE student_course_enrollments ADD COLUMN enrollmentQuotaUsed BOOLEAN DEFAULT FALSE;
```

## API Endpoints

### Subscription Management

#### GET `/api/student/subscription`
Returns current subscription usage and status.

**Response:**
```json
{
  "success": true,
  "usage": {
    "currentEnrollments": 2,
    "maxEnrollments": 5,
    "monthlyAttendance": 8,
    "maxMonthlyAttendance": 20,
    "enrollmentUsagePercentage": 40,
    "attendanceUsagePercentage": 40,
    "daysUntilReset": 15
  }
}
```

#### POST `/api/student/subscription/upgrade`
Upgrades user subscription with prorated billing.

**Request:**
```json
{
  "newTierId": "tier_id",
  "reason": "Need more enrollments",
  "immediateUpgrade": true
}
```

### Platform Course Enrollment

#### POST `/api/student/platform-courses/enroll`
Enrolls user in a platform course with governance validation.

**Request:**
```json
{
  "courseId": "course_id",
  "enrollmentType": "SUBSCRIPTION"
}
```

#### GET `/api/student/platform-courses`
Returns platform course access information.

### Live Class Management

#### POST `/api/institution/live-classes`
Creates a new live class with governance validation.

**Request:**
```json
{
  "title": "Advanced JavaScript",
  "description": "Learn advanced JS concepts",
  "sessionType": "LIVE_CLASS",
  "language": "English",
  "level": "ADVANCED",
  "maxParticipants": 15,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:30:00Z",
  "instructorId": "instructor_id"
}
```

#### POST `/api/student/live-classes/enroll`
Enrolls student in a live class with access validation.

## Usage Examples

### Checking Subscription Usage

```typescript
import { SubscriptionManagementService } from '@/lib/subscription-management-service';

// Check if user can enroll in a course
const canEnroll = await SubscriptionManagementService.canEnrollInCourse(
  userId, 
  courseId
);

if (canEnroll) {
  // Proceed with enrollment
} else {
  // Show upgrade prompt
}
```

### Creating Live Class with Governance

```typescript
import { LiveClassGovernanceService } from '@/lib/live-class-governance-service';

const sessionData = {
  title: 'Python Basics',
  description: 'Introduction to Python programming',
  sessionType: 'LIVE_CLASS',
  language: 'English',
  level: 'BEGINNER',
  maxParticipants: 20,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  instructorId: 'instructor_id',
  institutionId: 'institution_id'
};

const result = await LiveClassGovernanceService.createLiveClassWithGovernance(sessionData);

if (result.success) {
  console.log('Live class created:', result.sessionId);
} else {
  console.log('Creation failed:', result.errors);
}
```

### Platform Course Enrollment

```typescript
import { PlatformCourseGovernanceService } from '@/lib/platform-course-governance-service';

const result = await PlatformCourseGovernanceService.enrollInPlatformCourse({
  userId: 'user_id',
  courseId: 'course_id',
  enrollmentType: 'SUBSCRIPTION'
});

if (result.success) {
  console.log('Enrolled successfully:', result.enrollmentId);
} else {
  console.log('Enrollment failed:', result.error);
}
```

## Dashboard Components

### Subscription Usage Dashboard

```tsx
import SubscriptionUsageDashboard from '@/components/subscription/SubscriptionUsageDashboard';

<SubscriptionUsageDashboard
  usageMetrics={usageMetrics}
  subscriptionInfo={subscriptionInfo}
  onUpgrade={handleUpgrade}
/>
```

### Live Class Governance Dashboard

```tsx
import LiveClassGovernanceDashboard from '@/components/live-classes/LiveClassGovernanceDashboard';

<LiveClassGovernanceDashboard
  stats={liveClassStats}
  availability={instructorAvailability}
  onCreateClass={handleCreateClass}
  onViewConflicts={handleViewConflicts}
/>
```

### Platform Course Enrollment Component

```tsx
import PlatformCourseEnrollment from '@/components/platform-courses/PlatformCourseEnrollment';

<PlatformCourseEnrollment
  course={courseData}
  validation={enrollmentValidation}
  onEnroll={handleEnroll}
  onUpgrade={handleUpgrade}
/>
```

## Monitoring and Analytics

### System Health Monitoring

```typescript
import { UsageAnalyticsService } from '@/lib/usage-analytics-service';

// Monitor system health
const health = await UsageAnalyticsService.monitorSystemHealth();

// Get platform usage stats
const stats = await UsageAnalyticsService.getPlatformUsageStats();

// Get users approaching limits
const users = await UsageAnalyticsService.getUsersApproachingLimits();
```

### Monthly Quota Reset

The system automatically resets monthly quotas on the first day of each month at 2 AM:

```bash
# Run manually for testing
npx ts-node scripts/reset-monthly-quotas.ts
```

## Testing

### Integration Tests

Run the comprehensive integration test suite:

```bash
npx ts-node scripts/test-governance-integration.ts
```

### Manual Testing

1. **Subscription Upgrade Flow:**
   - Create a user with basic subscription
   - Attempt to enroll in courses beyond quota
   - Verify upgrade prompts appear
   - Test upgrade process

2. **Live Class Creation:**
   - Create instructor account
   - Attempt to create live classes
   - Verify governance validation
   - Test scheduling conflicts

3. **Platform Course Enrollment:**
   - Create platform courses
   - Test enrollment with different subscription tiers
   - Verify quota enforcement

## Configuration

### Environment Variables

```env
# Governance settings
GOVERNANCE_ENABLED=true
QUOTA_ENFORCEMENT=true
GRACE_PERIOD_DAYS=7

# Monitoring
ANALYTICS_ENABLED=true
ALERT_THRESHOLD_PERCENTAGE=80

# Cron jobs
MONTHLY_RESET_ENABLED=true
RESET_TIME_HOUR=2
```

### Default Subscription Tiers

The system creates three default subscription tiers:

1. **Basic Plan** ($12.99/month)
   - 3 course enrollments
   - 10 live class attendances
   - 7-day grace period

2. **Premium Plan** ($24.99/month)
   - 10 course enrollments
   - 30 live class attendances
   - 14-day grace period

3. **Enterprise Plan** ($49.99/month)
   - 25 course enrollments
   - 100 live class attendances
   - 30-day grace period

## Troubleshooting

### Common Issues

1. **Migration Errors:**
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   
   # Run migration manually
   npx ts-node scripts/migrate-subscription-governance.ts
   ```

2. **Service Errors:**
   - Check database connectivity
   - Verify Prisma client is up to date
   - Check environment variables

3. **Component Errors:**
   - Ensure all UI components are properly imported
   - Check for missing dependencies
   - Verify TypeScript types

### Debug Mode

Enable debug logging:

```typescript
// In your service files
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Governance debug:', { userId, action, result });
}
```

## Performance Considerations

1. **Database Indexing:**
   - Index on `student_subscriptions.studentId`
   - Index on `student_course_enrollments.studentId`
   - Index on `video_session_participants.userId`

2. **Caching:**
   - Cache subscription status for 5 minutes
   - Cache usage metrics for 1 minute
   - Use Redis for distributed caching

3. **Batch Operations:**
   - Use batch updates for quota resets
   - Implement bulk enrollment validation
   - Optimize analytics queries

## Security Considerations

1. **Access Control:**
   - Validate user permissions before operations
   - Implement rate limiting on API endpoints
   - Log all governance actions

2. **Data Validation:**
   - Validate all input data
   - Sanitize user inputs
   - Implement proper error handling

3. **Audit Trail:**
   - Log all subscription changes
   - Track enrollment modifications
   - Monitor system access

## Future Enhancements

1. **Advanced Analytics:**
   - Machine learning for usage prediction
   - Automated quota optimization
   - Predictive upgrade suggestions

2. **Enhanced Governance:**
   - Dynamic quota adjustment
   - Seasonal usage patterns
   - Custom governance rules

3. **Integration Features:**
   - Third-party payment providers
   - External analytics tools
   - API for external systems

## Support

For questions or issues with the governance implementation:

1. Check the troubleshooting section
2. Review the integration tests
3. Consult the API documentation
4. Contact the development team

---

**Last Updated:** January 2024
**Version:** 1.0.0 