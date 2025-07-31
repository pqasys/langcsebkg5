# Future Migration Plan: StudentSubscription → UserSubscription

## Overview

This document outlines the comprehensive migration plan for renaming `StudentSubscription` to `UserSubscription` and updating related naming conventions. This migration should be planned for a **major version update** to minimize impact on existing users.

## Migration Rationale

### Current Issues
- **Confusing Naming**: "Student" prefix suggests student-only usage
- **Misleading API Endpoints**: `/api/student/subscription` works for all users
- **Documentation Overhead**: Requires extensive documentation to clarify usage
- **Developer Confusion**: New developers may assume student-only functionality

### Benefits of Migration
- **Clear Naming**: `UserSubscription` clearly indicates universal usage
- **Intuitive APIs**: `/api/user/subscription` is more accurate
- **Reduced Documentation**: Self-explanatory naming reduces documentation needs
- **Better Maintainability**: Clearer codebase for future development

## Migration Strategy

### Phase 1: Preparation (1-2 weeks)

#### 1.1 Database Backup
```bash
# Create comprehensive backup
mysqldump -u username -p database_name > backup_before_migration.sql
```

#### 1.2 Create Migration Scripts
```sql
-- Create new table structure
CREATE TABLE user_subscriptions (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) UNIQUE NOT NULL,
  studentTierId VARCHAR(191) NOT NULL,
  status VARCHAR(191) DEFAULT 'ACTIVE',
  startDate DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  endDate DATETIME(3) NOT NULL,
  autoRenew BOOLEAN DEFAULT true,
  cancellationReason VARCHAR(191),
  cancelledAt DATETIME(3),
  metadata JSON,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (studentTierId) REFERENCES StudentTier(id)
);

-- Create indexes
CREATE INDEX idx_user_subscriptions_userId ON user_subscriptions(userId);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_endDate ON user_subscriptions(endDate);
```

#### 1.3 Update Prisma Schema
```prisma
// New schema
model UserSubscription {
  id            String   @id @default(cuid())
  userId        String   @unique
  studentTierId String
  status        String   @default("ACTIVE")
  startDate     DateTime @default(now())
  endDate       DateTime
  autoRenew     Boolean  @default(true)
  cancellationReason String?
  cancelledAt   DateTime?
  metadata      Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id])
  studentTier StudentTier @relation(fields: [studentTierId], references: [id])
  logs SubscriptionLog[]
  billingHistory StudentBillingHistory[]

  @@index([userId])
  @@index([status])
  @@index([endDate])
  @@map("user_subscriptions")
}
```

### Phase 2: Data Migration (1 day)

#### 2.1 Data Migration Script
```sql
-- Migrate existing data
INSERT INTO user_subscriptions (
  id, userId, studentTierId, status, startDate, endDate, 
  autoRenew, cancellationReason, cancelledAt, metadata, 
  createdAt, updatedAt
)
SELECT 
  id, studentId, studentTierId, status, startDate, endDate,
  autoRenew, cancellationReason, cancelledAt, metadata,
  createdAt, updatedAt
FROM student_subscriptions;

-- Verify migration
SELECT COUNT(*) FROM student_subscriptions;
SELECT COUNT(*) FROM user_subscriptions;
```

#### 2.2 Update Related Tables
```sql
-- Update foreign key references in billing history
ALTER TABLE student_billing_history 
CHANGE COLUMN subscriptionId subscriptionId VARCHAR(191);

-- Update foreign key references in subscription logs
ALTER TABLE subscription_logs 
CHANGE COLUMN subscriptionId subscriptionId VARCHAR(191);
```

### Phase 3: Code Migration (1-2 weeks)

#### 3.1 Service Layer Updates
```typescript
// Old
export class SubscriptionCommissionService {
  static async getUserSubscriptionStatus(userId: string): Promise<StudentSubscriptionStatus>
  static async createStudentSubscription(studentId: string, ...): Promise<any>
}

// New
export class SubscriptionCommissionService {
  static async getUserSubscriptionStatus(userId: string): Promise<UserSubscriptionStatus>
  static async createUserSubscription(userId: string, ...): Promise<any>
}
```

#### 3.2 API Route Updates
```typescript
// Old: /api/student/subscription
// New: /api/user/subscription

// Update route handlers
export async function GET(request: NextRequest) {
  // Update method calls
  const status = await SubscriptionCommissionService.getUserSubscriptionStatus(userId);
  const subscription = await SubscriptionCommissionService.createUserSubscription(userId, ...);
}
```

#### 3.3 Interface Updates
```typescript
// Old
export interface StudentSubscriptionStatus {
  hasActiveSubscription: boolean;
  // ...
}

// New
export interface UserSubscriptionStatus {
  hasActiveSubscription: boolean;
  // ...
}
```

### Phase 4: Testing and Validation (1 week)

#### 4.1 Comprehensive Testing
- Unit tests for all service methods
- Integration tests for API endpoints
- End-to-end tests for subscription flows
- Performance testing for database queries

#### 4.2 Data Validation
```sql
-- Verify data integrity
SELECT COUNT(*) FROM user_subscriptions us
LEFT JOIN user u ON us.userId = u.id
WHERE u.id IS NULL;

-- Verify no data loss
SELECT COUNT(*) FROM student_subscriptions;
SELECT COUNT(*) FROM user_subscriptions;
```

### Phase 5: Deployment and Cleanup (1 day)

#### 5.1 Deployment Steps
1. Deploy new code with both old and new endpoints
2. Run data migration
3. Switch traffic to new endpoints
4. Monitor for errors
5. Remove old endpoints after validation

#### 5.2 Cleanup
```sql
-- Remove old table after validation
DROP TABLE student_subscriptions;
```

## Rollback Plan

### Database Rollback
```sql
-- If migration fails, restore from backup
DROP TABLE user_subscriptions;
RESTORE FROM backup_before_migration.sql;
```

### Code Rollback
```bash
# Git rollback to previous version
git revert <migration-commit-hash>
```

## Impact Assessment

### High Impact Areas
- **Database Schema**: Table rename and column changes
- **Service Layer**: Method signature changes
- **API Routes**: Endpoint path changes
- **TypeScript Interfaces**: Type definition updates

### Medium Impact Areas
- **Utility Scripts**: 20+ scripts need updates
- **Test Files**: All tests need updates
- **Documentation**: All docs need updates

### Low Impact Areas
- **UI Components**: Most use API endpoints
- **Configuration**: No direct model references

## Timeline

### Week 1-2: Preparation
- Database backup
- Migration script creation
- Prisma schema updates
- Development environment setup

### Week 3: Data Migration
- Execute data migration
- Validate data integrity
- Update related tables

### Week 4-5: Code Migration
- Update service layer
- Update API routes
- Update interfaces
- Update utility scripts

### Week 6: Testing
- Comprehensive testing
- Performance validation
- Data integrity checks

### Week 7: Deployment
- Deploy to staging
- Deploy to production
- Monitor and validate
- Cleanup old code

## Risk Mitigation

### Data Loss Prevention
- Multiple database backups
- Migration validation scripts
- Rollback procedures

### Service Disruption Prevention
- Gradual traffic switching
- Feature flags for new endpoints
- Comprehensive monitoring

### Code Quality Assurance
- Extensive testing
- Code review process
- Documentation updates

## Success Criteria

### Functional Requirements
- ✅ All subscription operations work correctly
- ✅ No data loss during migration
- ✅ API endpoints return correct responses
- ✅ Performance remains acceptable

### Non-Functional Requirements
- ✅ Zero downtime deployment
- ✅ Backward compatibility during transition
- ✅ Comprehensive documentation
- ✅ Clear rollback procedures

## Post-Migration Tasks

### Documentation Updates
- Update API documentation
- Update developer guides
- Update deployment procedures

### Monitoring
- Monitor subscription operations
- Monitor API performance
- Monitor error rates

### Cleanup
- Remove deprecated code
- Update CI/CD pipelines
- Archive old documentation

## Conclusion

This migration plan provides a comprehensive approach to updating the subscription architecture while minimizing risk and ensuring data integrity. The phased approach allows for careful validation at each step and provides clear rollback procedures if issues arise.

The migration should be planned for a major version update to minimize impact on existing users and provide adequate time for testing and validation. 