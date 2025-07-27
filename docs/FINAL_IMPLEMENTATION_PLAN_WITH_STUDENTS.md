# Final Implementation Plan: Unified Subscription Architecture

## Overview

This document provides the complete implementation plan for the unified subscription architecture that includes both **Institution** and **Student** subscriptions with fixed pricing tiers.

## Architecture Summary

### Current Problems
1. **Institution Subscriptions**: Redundant `CommissionTier` and `SubscriptionPlan` tables
2. **Student Subscriptions**: Hardcoded pricing scattered across multiple files
3. **Admin Management**: Complex interface managing multiple pricing sources
4. **Data Inconsistency**: Custom pricing per institution creates confusion

### Unified Solution
1. **CommissionTier**: Single source for institution pricing, features, and limits
2. **StudentTier**: New table for student pricing, features, and limits
3. **Fixed Pricing**: No custom pricing - standardized tiers only
4. **Unified Admin**: Single interface for both subscription types

## Database Migration Plan

### Phase 1: Create StudentTier Table

```sql
-- Create student_tiers table
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
 '{"maxCourses": 5, "maxLanguages": 5, "progressTracking": true, "emailSupport": true, "mobileAccess": true, "basicLessons": true}', 5, 5),
('premium-tier', 'PREMIUM', 'Premium Plan', 'Most popular choice for serious language learners', 24.99,
 '{"maxCourses": 20, "maxLanguages": -1, "progressTracking": true, "prioritySupport": true, "liveConversations": true, "aiAssistant": true, "offlineAccess": true, "videoLessons": true, "culturalContent": true}', 20, -1),
('pro-tier', 'PRO', 'Pro Plan', 'Complete language learning experience with personal tutoring', 49.99,
 '{"maxCourses": -1, "maxLanguages": -1, "progressTracking": true, "dedicatedSupport": true, "liveConversations": true, "aiAssistant": true, "personalTutoring": true, "customLearningPaths": true, "certificationPrep": true, "advancedAnalytics": true, "groupStudySessions": true}', -1, -1);
```

### Phase 2: Update CommissionTier Table

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

-- Set standard pricing for institution tiers
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

### Phase 3: Update Subscription Tables

```sql
-- Add tier references to subscription tables
ALTER TABLE institution_subscriptions 
ADD COLUMN commissionTierId VARCHAR(255);

ALTER TABLE student_subscriptions 
ADD COLUMN studentTierId VARCHAR(255);

-- Link existing subscriptions to tiers
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

-- Drop SubscriptionPlan table (no longer needed)
DROP TABLE subscription_plans;
```

## Prisma Schema Updates

### Updated Models

```prisma
// New StudentTier model
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

// Updated CommissionTier model
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

// Updated InstitutionSubscription model
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

// Updated StudentSubscription model
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

## Backend API Updates

### 1. Create StudentTier API

```typescript
// app/api/admin/settings/student-tiers/route.ts
export async function GET() {
  try {
    const studentTiers = await prisma.studentTier.findMany({
      orderBy: { planType: 'asc' }
    });
    return NextResponse.json(studentTiers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch student tiers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentTier = await prisma.studentTier.create({
      data: body
    });
    return NextResponse.json(studentTier);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student tier' }, { status: 500 });
  }
}
```

### 2. Update CommissionTier API

```typescript
// app/api/admin/settings/commission-tiers/route.ts
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const updatedTier = await prisma.commissionTier.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json(updatedTier);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update commission tier' }, { status: 500 });
  }
}
```

### 3. Update Subscription Services

```typescript
// lib/subscription-service.ts
export class SubscriptionService {
  static async createInstitutionSubscription(institutionId: string, tierId: string) {
    const tier = await prisma.commissionTier.findUnique({
      where: { id: tierId }
    });
    
    if (!tier) throw new Error('Invalid tier');
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    return await prisma.institutionSubscription.create({
      data: {
        institutionId,
        commissionTierId: tierId,
        endDate,
        status: 'ACTIVE'
      },
      include: { commissionTier: true }
    });
  }
  
  static async createStudentSubscription(studentId: string, tierId: string) {
    const tier = await prisma.studentTier.findUnique({
      where: { id: tierId }
    });
    
    if (!tier) throw new Error('Invalid tier');
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    return await prisma.studentSubscription.create({
      data: {
        studentId,
        studentTierId: tierId,
        endDate,
        status: 'ACTIVE'
      },
      include: { studentTier: true }
    });
  }
}
```

## Frontend Updates

### 1. Unified Admin Interface

```typescript
// app/admin/settings/tiers/page.tsx
export default function TiersManagementPage() {
  const [activeTab, setActiveTab] = useState<'institution' | 'student'>('institution');
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('institution')}
          className={`px-4 py-2 rounded ${activeTab === 'institution' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Institution Tiers
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`px-4 py-2 rounded ${activeTab === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Student Tiers
        </button>
      </div>
      
      {activeTab === 'institution' && <InstitutionTiersManager />}
      {activeTab === 'student' && <StudentTiersManager />}
    </div>
  );
}
```

### 2. Tier Management Components

```typescript
// components/admin/InstitutionTiersManager.tsx
export function InstitutionTiersManager() {
  const [tiers, setTiers] = useState([]);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Institution Tiers</h2>
      {tiers.map(tier => (
        <TierCard
          key={tier.id}
          tier={tier}
          type="institution"
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}

// components/admin/StudentTiersManager.tsx
export function StudentTiersManager() {
  const [tiers, setTiers] = useState([]);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Student Tiers</h2>
      {tiers.map(tier => (
        <TierCard
          key={tier.id}
          tier={tier}
          type="student"
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
```

### 3. Updated Subscription Flows

```typescript
// components/SubscriptionPlanSelector.tsx
export function SubscriptionPlanSelector({ type }: { type: 'institution' | 'student' }) {
  const [tiers, setTiers] = useState([]);
  
  useEffect(() => {
    const fetchTiers = async () => {
      const endpoint = type === 'institution' ? '/api/admin/settings/commission-tiers' : '/api/admin/settings/student-tiers';
      const response = await fetch(endpoint);
      const data = await response.json();
      setTiers(data);
    };
    fetchTiers();
  }, [type]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map(tier => (
        <TierCard key={tier.id} tier={tier} type={type} />
      ))}
    </div>
  );
}
```

## Migration Scripts

### 1. Data Migration Script

```typescript
// scripts/migrate-to-unified-tiers.ts
async function migrateToUnifiedTiers() {
  console.log('🔄 Starting migration to unified tier system...');
  
  // 1. Create student tiers
  const studentTiers = [
    {
      planType: 'BASIC',
      name: 'Basic Plan',
      description: 'Perfect for beginners starting their language journey',
      price: 12.99,
      features: {
        maxCourses: 5,
        maxLanguages: 5,
        progressTracking: true,
        emailSupport: true,
        mobileAccess: true
      }
    },
    // ... PREMIUM and PRO tiers
  ];
  
  for (const tier of studentTiers) {
    await prisma.studentTier.upsert({
      where: { planType: tier.planType },
      update: tier,
      create: tier
    });
  }
  
  // 2. Update commission tiers with pricing
  const commissionTiers = [
    {
      planType: 'STARTER',
      name: 'Starter Plan',
      price: 99,
      maxStudents: 50,
      maxCourses: 5,
      maxTeachers: 2
    },
    // ... PROFESSIONAL and ENTERPRISE tiers
  ];
  
  for (const tier of commissionTiers) {
    await prisma.commissionTier.update({
      where: { planType: tier.planType },
      data: tier
    });
  }
  
  // 3. Link existing subscriptions
  const institutionSubscriptions = await prisma.institutionSubscription.findMany();
  for (const sub of institutionSubscriptions) {
    const tier = await prisma.commissionTier.findFirst({
      where: { planType: sub.planType }
    });
    if (tier) {
      await prisma.institutionSubscription.update({
        where: { id: sub.id },
        data: { commissionTierId: tier.id }
      });
    }
  }
  
  const studentSubscriptions = await prisma.studentSubscription.findMany();
  for (const sub of studentSubscriptions) {
    const tier = await prisma.studentTier.findFirst({
      where: { planType: sub.planType }
    });
    if (tier) {
      await prisma.studentSubscription.update({
        where: { id: sub.id },
        data: { studentTierId: tier.id }
      });
    }
  }
  
  console.log('✅ Migration completed successfully!');
}
```

### 2. Validation Script

```typescript
// scripts/validate-unified-tiers.ts
async function validateUnifiedTiers() {
  console.log('🔍 Validating unified tier system...');
  
  // Check all institution subscriptions have tier references
  const institutionSubs = await prisma.institutionSubscription.findMany({
    include: { commissionTier: true }
  });
  
  const orphanedInstitutionSubs = institutionSubs.filter(sub => !sub.commissionTier);
  if (orphanedInstitutionSubs.length > 0) {
    console.log(`❌ Found ${orphanedInstitutionSubs.length} institution subscriptions without tier references`);
  }
  
  // Check all student subscriptions have tier references
  const studentSubs = await prisma.studentSubscription.findMany({
    include: { studentTier: true }
  });
  
  const orphanedStudentSubs = studentSubs.filter(sub => !sub.studentTier);
  if (orphanedStudentSubs.length > 0) {
    console.log(`❌ Found ${orphanedStudentSubs.length} student subscriptions without tier references`);
  }
  
  // Verify tier pricing
  const commissionTiers = await prisma.commissionTier.findMany();
  const studentTiers = await prisma.studentTier.findMany();
  
  console.log(`✅ Found ${commissionTiers.length} institution tiers with pricing`);
  console.log(`✅ Found ${studentTiers.length} student tiers with pricing`);
  
  console.log('✅ Validation completed!');
}
```

## Testing Strategy

### 1. Unit Tests

```typescript
// tests/subscription-service.test.ts
describe('SubscriptionService', () => {
  test('should create institution subscription with tier pricing', async () => {
    const subscription = await SubscriptionService.createInstitutionSubscription(
      'institution-id',
      'tier-id'
    );
    
    expect(subscription.commissionTier).toBeDefined();
    expect(subscription.commissionTier.price).toBeGreaterThan(0);
  });
  
  test('should create student subscription with tier pricing', async () => {
    const subscription = await SubscriptionService.createStudentSubscription(
      'student-id',
      'tier-id'
    );
    
    expect(subscription.studentTier).toBeDefined();
    expect(subscription.studentTier.price).toBeGreaterThan(0);
  });
});
```

### 2. Integration Tests

```typescript
// tests/api/tiers.test.ts
describe('Tiers API', () => {
  test('should fetch institution tiers with pricing', async () => {
    const response = await request(app)
      .get('/api/admin/settings/commission-tiers')
      .expect(200);
    
    expect(response.body).toHaveLength(3);
    expect(response.body[0].price).toBeDefined();
  });
  
  test('should fetch student tiers with pricing', async () => {
    const response = await request(app)
      .get('/api/admin/settings/student-tiers')
      .expect(200);
    
    expect(response.body).toHaveLength(3);
    expect(response.body[0].price).toBeDefined();
  });
});
```

## Deployment Checklist

### Pre-Deployment
- [ ] Backup current database
- [ ] Run migration scripts in staging
- [ ] Test all subscription flows
- [ ] Validate data integrity
- [ ] Update documentation

### Deployment
- [ ] Run database migrations
- [ ] Deploy updated backend code
- [ ] Deploy updated frontend code
- [ ] Run validation scripts
- [ ] Monitor for errors

### Post-Deployment
- [ ] Verify admin interface works
- [ ] Test subscription creation flows
- [ ] Check billing calculations
- [ ] Monitor performance metrics
- [ ] Update user documentation

## Benefits Summary

### For Administrators
- ✅ Single interface for both subscription types
- ✅ Fixed pricing eliminates confusion
- ✅ Easy to update pricing and features
- ✅ Clear revenue projections
- ✅ No custom pricing negotiations

### For the Platform
- ✅ Unified data model reduces complexity
- ✅ Consistent tier structure improves maintainability
- ✅ Better performance with simplified queries
- ✅ Scalable architecture for future growth
- ✅ Reduced bug surface area

### For Users
- ✅ Transparent, upfront pricing
- ✅ Consistent experience across user types
- ✅ Predictable costs and features
- ✅ Clear value proposition for each tier

## Timeline

### Week 1: Foundation
- [ ] Database migrations
- [ ] Prisma schema updates
- [ ] Basic API endpoints

### Week 2: Backend
- [ ] Complete API implementation
- [ ] Service layer updates
- [ ] Migration scripts

### Week 3: Frontend
- [ ] Admin interface updates
- [ ] Subscription flow updates
- [ ] Component refactoring

### Week 4: Testing & Deployment
- [ ] Comprehensive testing
- [ ] Performance validation
- [ ] Production deployment

This unified architecture provides a clean, scalable solution that works seamlessly for both institutions and students, with fixed pricing and simplified management. 