# Live Class 60-Minute Duration Migration

## Overview

This document describes the migration process to ensure all existing live classes (VideoSession records) conform to the 60-minute duration requirement.

## Background

As part of the platform's standardization, all live class lessons must have a fixed duration of 60 minutes. This ensures:
- Consistent user experience
- Proper subscription usage tracking (based on hours, not session count)
- Simplified scheduling and management

## Migration Scripts

### 1. Node.js Migration Script

**File**: `scripts/migrate-live-classes.js`

**Usage**:
```bash
npm run migrate:live-classes
```

**Features**:
- Comprehensive logging with emojis and clear progress indicators
- Detailed error reporting
- Verification of migration results
- Skips already conforming sessions
- Excludes cancelled sessions

### 2. Alternative Migration Script

**File**: `scripts/migrate-live-classes-to-60min.js`

**Usage**:
```bash
node scripts/migrate-live-classes-to-60min.js
```

**Features**:
- Simpler implementation
- Basic logging
- Error handling

### 3. SQL Migration

**File**: `prisma/migrations/20241220_000000_migrate_live_classes_to_60min/migration.sql`

**Usage**:
```bash
npx prisma migrate deploy
```

## What the Migration Does

For each VideoSession record, the migration:

1. **Calculates the correct endTime**: `startTime + 60 minutes`
2. **Updates the duration field**: Sets to `60` minutes
3. **Updates the updatedAt timestamp**: Records when the change was made
4. **Skips cancelled sessions**: Only processes active/scheduled sessions
5. **Skips already conforming sessions**: Avoids unnecessary updates

## Database Changes

The migration updates these fields in the `video_sessions` table:

```sql
UPDATE video_sessions 
SET 
  endTime = DATE_ADD(startTime, INTERVAL 60 MINUTE),
  duration = 60,
  updatedAt = NOW()
WHERE 
  (endTime != DATE_ADD(startTime, INTERVAL 60 MINUTE) OR duration != 60)
  AND status != 'CANCELLED';
```

## Verification

After running the migration, you can verify the results:

1. **Check migration logs**: The script provides detailed output
2. **Database query**: 
   ```sql
   SELECT COUNT(*) as non_conforming 
   FROM video_sessions 
   WHERE (duration != 60 OR endTime != DATE_ADD(startTime, INTERVAL 60 MINUTE))
   AND status != 'CANCELLED';
   ```
3. **Admin dashboard**: Check live classes in the admin interface

## Rollback

If needed, you can rollback the migration by:

1. **Restoring from backup**: If you have a database backup from before the migration
2. **Manual correction**: Update specific sessions that need different durations
3. **Custom script**: Create a rollback script if you have the original values

## Impact on Existing Data

### Sessions Already Running
- **Past sessions**: No impact (already completed)
- **Current sessions**: May need manual adjustment if in progress
- **Future sessions**: Will be updated to 60-minute duration

### User Experience
- **Scheduled sessions**: Users will see updated end times
- **Notifications**: May need to send updated notifications
- **Calendar integrations**: May need to refresh calendar events

### Subscription Tracking
- **Usage calculation**: Now based on actual hours attended
- **Monthly limits**: Enforced as total hours, not session count
- **Billing**: More accurate based on actual time spent

## Best Practices

1. **Run during low traffic**: Execute migration during off-peak hours
2. **Backup first**: Always backup the database before running migrations
3. **Test in staging**: Test the migration on a staging environment first
4. **Monitor logs**: Watch for any errors during migration
5. **Verify results**: Check that all sessions were updated correctly

## Troubleshooting

### Common Issues

1. **Permission errors**: Ensure database user has UPDATE permissions
2. **Connection timeouts**: For large datasets, consider batching updates
3. **Data inconsistencies**: Check for sessions with invalid start/end times

### Error Handling

The migration script includes comprehensive error handling:
- Individual session errors don't stop the entire migration
- Detailed error logging for debugging
- Summary report at the end

## Related Documentation

- [Live Class 60-Minute Duration Implementation](./LIVE_CLASS_60_MINUTE_DURATION_IMPLEMENTATION.md)
- [Live Class Subscription System](./LIVE_CLASS_SUBSCRIPTION_SYSTEM.md)
- [Subscription Plan Management](./SUBSCRIPTION_PLAN_MANAGEMENT.md)
