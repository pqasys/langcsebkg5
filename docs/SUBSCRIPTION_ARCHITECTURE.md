# Subscription Architecture Documentation

## Overview

The current subscription system is designed to handle subscriptions for **ALL user types**, not just students. While the naming suggests it's student-specific, the architecture is actually flexible and supports various user roles.

## Current Architecture

### Key Models

#### StudentSubscription (Actually UserSubscription)
```prisma
model StudentSubscription {
  id            String   @id @default(cuid())
  studentId     String   @unique  // Actually stores any user ID
  studentTierId String
  status        String   @default("ACTIVE")
  // ... other fields
}
```

**Important Notes:**
- The `studentId` field actually stores **any user ID**, not just student IDs
- This model handles subscriptions for all user types
- The naming is historical and should be considered for future refactoring

### Supported User Types

The subscription system supports the following user types:

1. **Students** - Regular course-taking users
2. **Admins** - Platform administrators with premium access
3. **Institution Staff** - Staff members with personal subscriptions
4. **Regular Users** - Any user who wants premium features

## Service Methods

### getUserSubscriptionStatus(userId: string)
```typescript
/**
 * Get subscription status for a user (student or non-student)
 * 
 * IMPORTANT: This method handles subscriptions for ALL user types:
 * - Students: Regular course-taking users
 * - Admins: Platform administrators with premium access  
 * - Institution Staff: Staff members with personal subscriptions
 * - Regular Users: Any user who wants premium features
 * 
 * The 'studentId' field in StudentSubscription actually stores any user ID,
 * not just student IDs. This naming is historical and should be considered
 * for future refactoring to UserSubscription.
 */
```

### createStudentSubscription(studentId: string, ...)
```typescript
/**
 * Create or update user subscription (currently named for historical reasons)
 * 
 * IMPORTANT: This method creates subscriptions for ALL user types, not just students:
 * - Students: Regular course-taking users
 * - Admins: Platform administrators with premium access
 * - Institution Staff: Staff members with personal subscriptions  
 * - Regular Users: Any user who wants premium features
 * 
 * The 'studentId' parameter actually accepts any user ID, not just student IDs.
 * This naming is historical and should be considered for future refactoring.
 * 
 * @param studentId - The user ID (can be any user type, not just students)
 * @param planType - The subscription plan type
 * @param billingCycle - Monthly or annual billing
 * @param userId - The ID of the user performing the action (for logging)
 * @param startTrial - Whether to start a trial subscription
 * @param amount - Optional custom amount (overrides tier pricing)
 */
```

## Validation

### User Existence Validation
All subscription operations now validate that users exist before proceeding:

```typescript
// Validate that the user exists before checking subscription
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, role: true }
});

if (!user) {
  throw new Error(`User not found: ${userId}`);
}
```

### Acting User Validation
For subscription creation, both the target user and acting user are validated:

```typescript
// Validate that the user exists before creating subscription
const user = await prisma.user.findUnique({
  where: { id: studentId },
  select: { id: true, role: true, name: true }
});

if (!user) {
  throw new Error(`User not found: ${studentId}. Cannot create subscription for non-existent user.`);
}

// Validate that the acting user exists
const actingUser = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, role: true }
});

if (!actingUser) {
  throw new Error(`Acting user not found: ${userId}. Cannot create subscription with invalid acting user.`);
}
```

## API Endpoints

### Student Subscription API
- **GET** `/api/student/subscription` - Get subscription status
- **POST** `/api/student/subscription` - Create subscription
- **PUT** `/api/student/subscription` - Update subscription
- **DELETE** `/api/student/subscription` - Cancel subscription

**Note:** Despite the "student" naming, these endpoints work for all user types.

## Current Usage Examples

### Creating a Subscription for an Admin
```typescript
// This works for admins, not just students
await SubscriptionCommissionService.createStudentSubscription(
  adminUserId,  // Can be any user ID
  'PREMIUM',
  'MONTHLY',
  adminUserId,
  false
);
```

### Checking Subscription Status for Institution Staff
```typescript
// This works for institution staff, not just students
const status = await SubscriptionCommissionService.getUserSubscriptionStatus(
  staffUserId  // Can be any user ID
);
```

## Future Migration Plan

### Phase 1: Documentation and Validation (Current)
- ✅ Document current flexible usage
- ✅ Add user existence validation
- ✅ Clarify naming conventions

### Phase 2: Schema Refactoring (Future Major Version)
- Rename `StudentSubscription` to `UserSubscription`
- Rename `studentId` field to `userId`
- Update all related foreign keys and references
- Migrate existing data

### Phase 3: Code Updates (Future Major Version)
- Update all service method names
- Update API endpoint paths
- Update all TypeScript interfaces
- Update all documentation

## Migration Strategy

### Database Migration
```sql
-- Future migration steps:
-- 1. Create new table
CREATE TABLE user_subscriptions (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) UNIQUE NOT NULL,
  -- ... other fields
);

-- 2. Migrate data
INSERT INTO user_subscriptions 
SELECT * FROM student_subscriptions;

-- 3. Update foreign keys
ALTER TABLE student_billing_history 
CHANGE COLUMN subscriptionId subscriptionId VARCHAR(191);
```

### Code Migration
```typescript
// Future method signature:
static async createUserSubscription(
  userId: string,  // Clearer naming
  planType: 'BASIC' | 'PREMIUM' | 'PRO',
  // ... other parameters
): Promise<UserSubscriptionStatus>
```

## Benefits of Current Architecture

### Advantages
- ✅ **Flexible**: Supports all user types
- ✅ **Working**: Current system functions correctly
- ✅ **No Breaking Changes**: Maintains backward compatibility
- ✅ **Low Risk**: No migration risks

### Disadvantages
- ❌ **Confusing Naming**: "Student" prefix is misleading
- ❌ **Documentation Overhead**: Requires extensive documentation
- ❌ **Future Maintenance**: May confuse new developers

## Recommendations

### Immediate Actions (Completed)
1. ✅ Document current flexible usage
2. ✅ Add user existence validation
3. ✅ Clarify naming in comments

### Future Actions (Major Version Update)
1. Consider full migration to `UserSubscription`
2. Update all naming conventions
3. Improve API endpoint naming
4. Update documentation

## Conclusion

The current architecture works correctly and supports all user types. While the naming is confusing, the functionality is robust and flexible. The recommended approach is to:

1. **Keep the current architecture** for now
2. **Document the flexible usage** clearly
3. **Add proper validation** to prevent errors
4. **Plan for future migration** in a major version update

This approach minimizes risk while maintaining functionality and preparing for future improvements. 