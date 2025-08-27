# Live Class Subscription System

## Overview

The Live Class Subscription System enforces that all live class lessons are exactly 60 minutes in duration and tracks user subscription usage based on total hours attended rather than session count. This ensures fair usage tracking and consistent lesson durations.

## Key Features

### 1. Fixed Lesson Duration
- **Standard Duration**: All live class sessions must be exactly 60 minutes
- **Enforcement**: System validates duration during session creation
- **Error Handling**: Prevents creation of sessions with incorrect duration

### 2. Hour-Based Usage Tracking
- **Basic Subscription**: 4 hours per month (4 x 60-minute lessons)
- **Premium Subscription**: 8 hours per month (8 x 60-minute lessons)
- **Accurate Tracking**: Based on actual hours attended, not session count
- **Monthly Reset**: Usage resets at the beginning of each month

### 3. Attendance Recording
- **Automatic Tracking**: Records when users attend sessions
- **Duration Calculation**: Tracks actual time spent in sessions
- **Historical Data**: Maintains attendance history for analytics

## Database Schema

### VideoSessionAttendance Model
```prisma
model VideoSessionAttendance {
  id        String    @id @default(uuid()) @db.VarChar(36)
  userId    String    @db.VarChar(36)
  sessionId String    @db.VarChar(36)
  attended  Boolean   @default(false)
  attendedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  user    user         @relation(fields: [userId], references: [id], onDelete: Cascade)
  session VideoSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@unique([userId, sessionId])
  @@index([userId])
  @@index([sessionId])
  @@index([attendedAt])
  @@index([createdAt])
  @@map("video_session_attendances")
}
```

## API Endpoints

### 1. Get Current Usage
```http
GET /api/subscription/usage
```
Returns current month's subscription usage for the authenticated user.

**Response:**
```json
{
  "userId": "user-id",
  "month": "2024-01",
  "totalHoursAttended": 2.5,
  "maxHoursAllowed": 4,
  "remainingHours": 1.5,
  "sessionsAttended": 2,
  "lastAttendanceDate": "2024-01-15T10:00:00Z"
}
```

### 2. Check Attendance Eligibility
```http
POST /api/subscription/check-attendance
Content-Type: application/json

{
  "sessionId": "session-id"
}
```
Checks if user can attend a specific session based on subscription limits.

**Response:**
```json
{
  "canAttend": true,
  "usage": {
    "totalHoursAttended": 2.5,
    "maxHoursAllowed": 4,
    "remainingHours": 1.5
  }
}
```

### 3. Record Attendance
```http
POST /api/subscription/record-attendance
Content-Type: application/json

{
  "sessionId": "session-id",
  "attended": true
}
```
Records user attendance for a session.

### 4. Get Usage History
```http
GET /api/subscription/history?months=6
```
Returns subscription usage history for the specified number of months.

### 5. Admin Statistics
```http
GET /api/admin/subscription-statistics?month=2024-01
```
Returns subscription usage statistics for admin dashboard.

## Service Layer

### LiveClassSubscriptionService

#### Key Methods

1. **getUserSubscriptionUsage(userId: string)**
   - Gets current month's usage for a user
   - Calculates remaining hours based on subscription type

2. **canUserAttendSession(userId: string, sessionId: string)**
   - Validates session duration (must be 60 minutes)
   - Checks if user has sufficient remaining hours
   - Returns detailed eligibility information

3. **recordSessionAttendance(userId: string, sessionId: string, attended: boolean)**
   - Records or updates attendance for a session
   - Validates session duration before recording

4. **validateSessionDuration(durationMinutes: number)**
   - Validates that session duration is exactly 60 minutes
   - Returns validation result with error message if invalid

5. **getSubscriptionStatistics(month?: string)**
   - Returns comprehensive statistics for admin dashboard
   - Includes user distribution, usage patterns, and top users

## Usage Examples

### Creating a Live Class Session
```typescript
// Session creation will automatically validate duration
const sessionData = {
  title: "Spanish Conversation Practice",
  duration: 60, // Must be exactly 60 minutes
  startTime: new Date("2024-01-20T10:00:00Z"),
  endTime: new Date("2024-01-20T11:00:00Z"), // 60 minutes later
  // ... other fields
};

// Validation will occur automatically
const durationValidation = LiveClassSubscriptionService.validateSessionDuration(60);
if (!durationValidation.isValid) {
  throw new Error(durationValidation.reason);
}
```

### Checking User Eligibility
```typescript
// Before allowing user to join a session
const eligibility = await LiveClassSubscriptionService.canUserAttendSession(
  userId,
  sessionId
);

if (!eligibility.canAttend) {
  // Show error message to user
  console.log(eligibility.reason);
  return;
}

// User can attend the session
```

### Recording Attendance
```typescript
// After user completes a session
await LiveClassSubscriptionService.recordSessionAttendance(
  userId,
  sessionId,
  true // attended
);
```

## UI Components

### SubscriptionUsageDisplay
A React component that displays:
- Current month usage with progress bar
- Remaining hours
- Usage warnings and alerts
- Historical usage data
- Upgrade prompts when limits are reached

**Usage:**
```tsx
<SubscriptionUsageDisplay 
  showHistory={true} 
  userId={currentUser.id} 
/>
```

## Business Rules

### 1. Duration Enforcement
- All live class sessions must be exactly 60 minutes
- No exceptions or variations allowed
- System prevents creation of sessions with incorrect duration

### 2. Subscription Limits
- **Basic Plan**: 4 hours per month
- **Premium Plan**: 8 hours per month
- Usage is tracked by actual hours attended
- Partial attendance is not supported (all-or-nothing)

### 3. Monthly Reset
- Usage resets on the first day of each month
- Historical data is preserved for analytics
- Users can view their usage history

### 4. Attendance Tracking
- Attendance is recorded when user joins a session
- System tracks actual session duration
- No credit for partial attendance

## Error Handling

### Common Error Scenarios

1. **Invalid Session Duration**
   ```
   Error: Live class sessions must be exactly 60 minutes duration. Current duration: 45 minutes.
   ```

2. **Insufficient Hours**
   ```
   Error: Insufficient subscription hours. You have 0.5 hours remaining, but this session requires 1 hours.
   ```

3. **Session Not Found**
   ```
   Error: Session session-id not found
   ```

## Performance Considerations

### Caching
- Usage data is cached to reduce database queries
- Cache invalidation occurs when attendance is recorded
- Historical data is cached separately

### Database Indexes
- Optimized indexes on user, session, and date fields
- Composite indexes for efficient queries
- Regular cleanup of old attendance records

## Monitoring and Analytics

### Key Metrics
- Monthly usage patterns
- User engagement rates
- Subscription upgrade conversions
- Session attendance rates

### Admin Dashboard
- Real-time usage statistics
- User distribution by subscription type
- Top users by hours used
- Monthly trend analysis

## Future Enhancements

### Planned Features
1. **Flexible Duration Support**: Allow different session durations for premium users
2. **Partial Attendance**: Track partial session attendance
3. **Usage Alerts**: Proactive notifications when approaching limits
4. **Rollover Hours**: Allow unused hours to carry over to next month
5. **Family Plans**: Shared subscription limits for family accounts

### Integration Points
1. **Payment System**: Automatic billing based on usage
2. **Notification System**: Usage alerts and reminders
3. **Analytics Platform**: Detailed usage analytics
4. **Mobile App**: Real-time usage tracking
