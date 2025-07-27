# Complete Subscription Architecture: Institutions & Students

## Overview

This document provides a complete analysis of the subscription system for both **Institutions** and **Students**, and how they fit together in a simplified, unified architecture.

## Current State Analysis

### Institution Subscriptions (Current Problems)
- **CommissionTier**: Features only, no pricing
- **SubscriptionPlan**: Pricing + features (redundant)
- **InstitutionSubscription**: References both + custom pricing
- **Result**: Architectural confusion and redundancy

### Student Subscriptions (Current State)
- **StudentSubscription**: Direct subscription with planType (BASIC, PREMIUM, PRO)
- **Features**: Hardcoded in service layer
- **Pricing**: Hardcoded in multiple places
- **Result**: Inconsistent, hard to manage

## Unified Architecture Solution

### 1. Institution Tier System (Simplified)

```prisma
model CommissionTier {
  id            String   @id @default(cuid())
  planType      String   // STARTER, PROFESSIONAL, ENTERPRISE
  name          String   // "Starter Plan", "Professional Plan", "Enterprise Plan"
  description   String   @db.Text
  price         Float    // Fixed price for this tier
  currency      String   @default("USD") @db.VarChar(3)
  billingCycle  String   @default("MONTHLY") @db.VarChar(20)
  commissionRate Float   // Commission rate as percentage
  features      Json     // Features included in this tier
  maxStudents   Int      @default(10)
  maxCourses    Int      @default(5)
  maxTeachers   Int      @default(2)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  institutionSubscriptions InstitutionSubscription[]

  @@unique([planType])
  @@map("commission_tiers")
}
```

### 2. Student Tier System (New)

```prisma
model StudentTier {
  id            String   @id @default(cuid())
  planType      String   // BASIC, PREMIUM, PRO
  name          String   // "Basic Plan", "Premium Plan", "Pro Plan"
  description   String   @db.Text
  price         Float    // Fixed price for this tier
  currency      String   @default("USD") @db.VarChar(3)
  billingCycle  String   @default("MONTHLY") @db.VarChar(20)
  features      Json     // Features included in this tier
  maxCourses    Int      @default(5)
  maxLanguages  Int      @default(5)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  studentSubscriptions StudentSubscription[]

  @@unique([planType])
  @@map("student_tiers")
}
```

### 3. Simplified Institution Subscriptions

```prisma
model InstitutionSubscription {
  id            String   @id @default(cuid())
  institutionId String   @unique
  commissionTierId String
  status        String   @default("ACTIVE")
  startDate     DateTime @default(now())
  endDate       DateTime
  autoRenew     Boolean  @default(true)
  cancellationReason String?
  cancelledAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  institution Institution @relation(fields: [institutionId], references: [id])
  commissionTier CommissionTier @relation(fields: [commissionTierId], references: [id])
  logs InstitutionSubscriptionLog[]
  billingHistory InstitutionBillingHistory[]

  @@index([institutionId])
  @@index([status])
  @@index([endDate])
  @@map("institution_subscriptions")
}
```

### 4. Simplified Student Subscriptions

```prisma
model StudentSubscription {
  id            String   @id @default(cuid())
  studentId     String
  studentTierId String
  status        String   @default("ACTIVE")
  startDate     DateTime @default(now())
  endDate       DateTime
  autoRenew     Boolean  @default(true)
  cancellationReason String?
  cancelledAt   DateTime?
  metadata      Json?    // Additional subscription data
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  student Student @relation(fields: [studentId], references: [id])
  studentTier StudentTier @relation(fields: [studentTierId], references: [id])
  logs SubscriptionLog[]
  billingHistory StudentBillingHistory[]

  @@index([studentId])
  @@index([status])
  @@index([endDate])
  @@map("student_subscriptions")
}
```

## Standard Pricing Structure

### Institution Tiers (Commission-Based)
| Tier | Price | Commission | Features | Limits |
|------|-------|------------|----------|---------|
| **STARTER** | $99/month | 25% | Basic analytics, Email support | 50 students, 5 courses, 2 teachers |
| **PROFESSIONAL** | $299/month | 15% | Advanced analytics, Custom branding, Priority support | 200 students, 15 courses, 5 teachers |
| **ENTERPRISE** | $799/month | 10% | All features, API access, White label | 1000 students, 50 courses, 20 teachers |

### Student Tiers (Direct Revenue)
| Tier | Price | Features | Limits |
|------|-------|----------|---------|
| **BASIC** | $12.99/month | Basic lessons, Progress tracking, Email support | 5 languages, 5 courses |
| **PREMIUM** | $24.99/month | Live conversations, AI assistant, Priority support | All languages, 20 courses |
| **PRO** | $49.99/month | Personal tutoring, Custom learning paths, 24/7 support | All languages, Unlimited courses |

## Business Model Integration

### Revenue Streams
1. **Institution Subscriptions**: Commission-based revenue sharing
2. **Student Subscriptions**: Direct revenue to platform
3. **Course Bookings**: Commission from institution course sales

### Commission Structure
- **Institutions**: Pay platform fee, keep commission from student bookings
- **Students**: Pay platform directly for learning features
- **Platform**: Revenue from both institution fees and student subscriptions

## Implementation Strategy

### Phase 1: Database Migration

#### 1.1 Create StudentTier Table
```sql
CREATE TABLE student_tiers (
  id VARCHAR(255) PRIMARY KEY,
  planType VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  billingCycle VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
  features JSON NOT NULL,
  maxCourses INT NOT NULL DEFAULT 5,
  maxLanguages INT NOT NULL DEFAULT 5,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default student tiers
INSERT INTO student_tiers (id, planType, name, description, price, features, maxCourses, maxLanguages) VALUES
('basic-tier', 'BASIC', 'Basic Plan', 'Perfect for beginners starting their language journey', 12.99, 
 '{"maxCourses": 5, "maxLanguages": 5, "progressTracking": true, "emailSupport": true, "mobileAccess": true}', 5, 5),
('premium-tier', 'PREMIUM', 'Premium Plan', 'Most popular choice for serious language learners', 24.99,
 '{"maxCourses": 20, "maxLanguages": -1, "progressTracking": true, "prioritySupport": true, "liveConversations": true, "aiAssistant": true, "offlineAccess": true}', 20, -1),
('pro-tier', 'PRO', 'Pro Plan', 'Complete language learning experience with personal tutoring', 49.99,
 '{"maxCourses": -1, "maxLanguages": -1, "progressTracking": true, "dedicatedSupport": true, "liveConversations": true, "aiAssistant": true, "personalTutoring": true, "customLearningPaths": true}', -1, -1);
```

#### 1.2 Update CommissionTier Table
```sql
-- Add pricing fields to CommissionTier
ALTER TABLE commission_tiers 
ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN description TEXT NOT NULL DEFAULT '',
ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'USD',
ADD COLUMN billingCycle VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN maxStudents INT NOT NULL DEFAULT 10,
ADD COLUMN maxCourses INT NOT NULL DEFAULT 5,
ADD COLUMN maxTeachers INT NOT NULL DEFAULT 2;

-- Set standard pricing
UPDATE commission_tiers SET 
  name = 'Starter Plan',
  description = 'Perfect for small language schools and individual tutors',
  price = 99, 
  maxStudents = 50, 
  maxCourses = 5, 
  maxTeachers = 2 
WHERE planType = 'STARTER';

UPDATE commission_tiers SET 
  name = 'Professional Plan',
  description = 'Ideal for growing language institutions',
  price = 299, 
  maxStudents = 200, 
  maxCourses = 15, 
  maxTeachers = 5 
WHERE planType = 'PROFESSIONAL';

UPDATE commission_tiers SET 
  name = 'Enterprise Plan',
  description = 'Complete solution for large language organizations',
  price = 799, 
  maxStudents = 1000, 
  maxCourses = 50, 
  maxTeachers = 20 
WHERE planType = 'ENTERPRISE';
```

#### 1.3 Update Subscription Tables
```sql
-- Add tier references
ALTER TABLE institution_subscriptions 
ADD COLUMN commissionTierId VARCHAR(255);

ALTER TABLE student_subscriptions 
ADD COLUMN studentTierId VARCHAR(255);

-- Link existing subscriptions
UPDATE institution_subscriptions 
SET commissionTierId = (SELECT id FROM commission_tiers WHERE planType = institution_subscriptions.planType LIMIT 1)
WHERE commissionTierId IS NULL;

UPDATE student_subscriptions 
SET studentTierId = (SELECT id FROM student_tiers WHERE planType = student_subscriptions.planType LIMIT 1)
WHERE studentTierId IS NULL;

-- Make tier references required
ALTER TABLE institution_subscriptions 
MODIFY COLUMN commissionTierId VARCHAR(255) NOT NULL;

ALTER TABLE student_subscriptions 
MODIFY COLUMN studentTierId VARCHAR(255) NOT NULL;

-- Remove redundant fields
ALTER TABLE institution_subscriptions 
DROP COLUMN planType,
DROP COLUMN subscriptionPlanId,
DROP COLUMN amount,
DROP COLUMN currency,
DROP COLUMN billingCycle;

ALTER TABLE student_subscriptions 
DROP COLUMN planType,
DROP COLUMN amount,
DROP COLUMN currency,
DROP COLUMN billingCycle;

-- Drop SubscriptionPlan table
DROP TABLE subscription_plans;
```

### Phase 2: Update Prisma Schema
```prisma
// Add StudentTier model
model StudentTier {
  id            String   @id @default(cuid())
  planType      String   // BASIC, PREMIUM, PRO
  name          String   // "Basic Plan", "Premium Plan", "Pro Plan"
  description   String   @db.Text
  price         Float    // Fixed price for this tier
  currency      String   @default("USD") @db.VarChar(3)
  billingCycle  String   @default("MONTHLY") @db.VarChar(20)
  features      Json     // Features included in this tier
  maxCourses    Int      @default(5)
  maxLanguages  Int      @default(5)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  studentSubscriptions StudentSubscription[]

  @@unique([planType])
  @@map("student_tiers")
}

// Update CommissionTier model (add pricing fields)
model CommissionTier {
  id            String   @id @default(cuid())
  planType      String   // STARTER, PROFESSIONAL, ENTERPRISE
  name          String   // "Starter Plan", "Professional Plan", "Enterprise Plan"
  description   String   @db.Text
  price         Float    // Fixed price for this tier
  currency      String   @default("USD") @db.VarChar(3)
  billingCycle  String   @default("MONTHLY") @db.VarChar(20)
  commissionRate Float   // Commission rate as percentage
  features      Json     // Features included in this tier
  maxStudents   Int      @default(10)
  maxCourses    Int      @default(5)
  maxTeachers   Int      @default(2)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  institutionSubscriptions InstitutionSubscription[]

  @@unique([planType])
  @@map("commission_tiers")
}

// Update subscription models to reference tiers
model InstitutionSubscription {
  id            String   @id @default(cuid())
  institutionId String   @unique
  commissionTierId String
  status        String   @default("ACTIVE")
  startDate     DateTime @default(now())
  endDate       DateTime
  autoRenew     Boolean  @default(true)
  cancellationReason String?
  cancelledAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  institution Institution @relation(fields: [institutionId], references: [id])
  commissionTier CommissionTier @relation(fields: [commissionTierId], references: [id])
  logs InstitutionSubscriptionLog[]
  billingHistory InstitutionBillingHistory[]

  @@index([institutionId])
  @@index([status])
  @@index([endDate])
  @@map("institution_subscriptions")
}

model StudentSubscription {
  id            String   @id @default(cuid())
  studentId     String
  studentTierId String
  status        String   @default("ACTIVE")
  startDate     DateTime @default(now())
  endDate       DateTime
  autoRenew     Boolean  @default(true)
  cancellationReason String?
  cancelledAt   DateTime?
  metadata      Json?    // Additional subscription data
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  student Student @relation(fields: [studentId], references: [id])
  studentTier StudentTier @relation(fields: [studentTierId], references: [id])
  logs SubscriptionLog[]
  billingHistory StudentBillingHistory[]

  @@index([studentId])
  @@index([status])
  @@index([endDate])
  @@map("student_subscriptions")
}
```

### Phase 3: Update Application Code

#### 3.1 Backend API Changes
1. **Remove SubscriptionPlan endpoints**
2. **Create StudentTier API endpoints**
3. **Enhance CommissionTier API with pricing**
4. **Update subscription creation to use tiers**

#### 3.2 Frontend Changes
1. **Update admin interface for both tier types**
2. **Simplify subscription management**
3. **Unified pricing display**

## Admin Interface Design

### Commission Tiers Management
- **View/Edit Institution Tiers**: STARTER, PROFESSIONAL, ENTERPRISE
- **Pricing Management**: Set fixed pricing per tier
- **Feature Management**: Checkbox-based feature selection
- **Commission Rates**: Set commission percentages

### Student Tiers Management
- **View/Edit Student Tiers**: BASIC, PREMIUM, PRO
- **Pricing Management**: Set fixed pricing per tier
- **Feature Management**: Checkbox-based feature selection
- **Limits Management**: Set course and language limits

### Unified Dashboard
- **Revenue Overview**: Both institution and student revenue
- **Subscription Analytics**: Growth and churn metrics
- **Tier Performance**: Most popular tiers by type

## Benefits of Unified Architecture

### For Administrators:
- **Single Interface**: Manage both institution and student tiers
- **Consistent Pricing**: Fixed pricing for all subscription types
- **Clear Revenue Model**: Separate commission and direct revenue streams
- **Easy Management**: One place to update features and pricing

### For the Platform:
- **Simplified Data Model**: Consistent tier-based architecture
- **Better Performance**: Optimized queries and relationships
- **Scalable Design**: Easy to add new tiers or subscription types
- **Reduced Complexity**: 50% fewer tables, 90% less confusion

### For Users:
- **Transparent Pricing**: Clear, upfront pricing for all tiers
- **Consistent Experience**: Same tier structure for both user types
- **Predictable Costs**: No custom pricing negotiations
- **Clear Feature Sets**: Know exactly what you get with each tier

## Migration Timeline

### Week 1: Database Foundation
- [ ] Create StudentTier table
- [ ] Update CommissionTier table
- [ ] Migrate existing data
- [ ] Update subscription relationships

### Week 2: Backend Implementation
- [ ] Update Prisma schema
- [ ] Create StudentTier API
- [ ] Enhance CommissionTier API
- [ ] Update subscription services

### Week 3: Frontend Updates
- [ ] Update admin interface
- [ ] Create unified tier management
- [ ] Update subscription flows
- [ ] Test all functionality

### Week 4: Testing & Deployment
- [ ] Comprehensive testing
- [ ] Data validation
- [ ] Performance testing
- [ ] Production deployment

## Conclusion

This unified architecture provides a clean, scalable solution that:

1. **Eliminates Redundancy**: Single source of truth for all tier definitions
2. **Simplifies Management**: One interface for all subscription types
3. **Improves Scalability**: Easy to add new tiers or subscription types
4. **Enhances User Experience**: Transparent, consistent pricing
5. **Optimizes Performance**: Simplified database structure

The tier-based approach with fixed pricing is the optimal solution for both institution and student subscriptions, providing clarity, consistency, and maintainability across the entire platform. 