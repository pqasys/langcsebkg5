# Subscription Architecture Redesign Proposal

## Current Problem

The current architecture has redundant and confusing relationships:

### Current Schema Issues:
1. **CommissionTier** defines features but NO pricing
2. **SubscriptionPlan** defines pricing AND features (redundant)
3. **InstitutionSubscription** references both `planType` AND `subscriptionPlanId`
4. Features are duplicated between CommissionTier and SubscriptionPlan

## Proposed Solution: Simplified Architecture

### Option 1: CommissionTier as Template (Recommended)

**CommissionTier becomes the master template:**
```prisma
model CommissionTier {
  id            String   @id @default(cuid())
  planType      String   // STARTER, PROFESSIONAL, ENTERPRISE
  name          String   // "Starter Plan", "Professional Plan", etc.
  description   String   @db.Text
  commissionRate Float   // Commission rate as percentage
  features      Json     // Features included in this tier
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  institutionSubscriptions InstitutionSubscription[]

  @@unique([planType])
  @@map("commission_tiers")
}
```

**InstitutionSubscription simplified:**
```prisma
model InstitutionSubscription {
  id            String   @id @default(cuid())
  institutionId String   @unique
  commissionTierId String // Reference to CommissionTier
  status        String   @default("ACTIVE")
  startDate     DateTime @default(now())
  endDate       DateTime
  billingCycle  String   @default("MONTHLY")
  amount        Float    // Custom amount for this institution
  currency      String   @default("USD")
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

**Remove SubscriptionPlan table entirely.**

### Option 2: SubscriptionPlan as Master (Alternative)

**SubscriptionPlan becomes the master:**
```prisma
model SubscriptionPlan {
  id            String   @id @default(cuid())
  name          String   @db.VarChar(100)
  description   String   @db.Text
  planType      String   // STARTER, PROFESSIONAL, ENTERPRISE
  price         Float
  currency      String   @default("USD") @db.VarChar(3)
  billingCycle  String   @default("MONTHLY") @db.VarChar(20)
  features      Json     // Array of feature strings
  maxStudents   Int      @default(10)
  maxCourses    Int      @default(5)
  maxTeachers   Int      @default(2)
  commissionRate Float   // Commission rate as percentage
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  institutionSubscriptions InstitutionSubscription[]

  @@index([isActive])
  @@index([billingCycle])
  @@index([planType])
  @@map("subscription_plans")
}
```

**Remove CommissionTier table entirely.**

## Recommended Approach: Option 1

### Benefits of Option 1 (CommissionTier as Master):

1. **Simpler Architecture**: One source of truth for plan definitions
2. **Flexible Pricing**: Each institution can have custom pricing while maintaining feature consistency
3. **Commission Focus**: Emphasizes the commission-based business model
4. **Easier Management**: Admin manages commission tiers, not individual subscription plans
5. **Better Scalability**: Easy to add new plan types without creating multiple subscription plans

### Implementation Steps:

1. **Database Migration:**
   ```sql
   -- Add missing fields to CommissionTier
   ALTER TABLE commission_tiers 
   ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT '',
   ADD COLUMN description TEXT NOT NULL DEFAULT '';
   
   -- Update existing records
   UPDATE commission_tiers SET name = CONCAT(planType, ' Plan') WHERE name = '';
   UPDATE commission_tiers SET description = CONCAT('Standard ', planType, ' plan with ', commissionRate, '% commission') WHERE description = '';
   
   -- Add commissionTierId to InstitutionSubscription
   ALTER TABLE institution_subscriptions 
   ADD COLUMN commissionTierId VARCHAR(255);
   
   -- Link existing subscriptions to commission tiers
   UPDATE institution_subscriptions 
   SET commissionTierId = (SELECT id FROM commission_tiers WHERE planType = institution_subscriptions.planType LIMIT 1)
   WHERE commissionTierId IS NULL;
   
   -- Make commissionTierId required
   ALTER TABLE institution_subscriptions 
   MODIFY COLUMN commissionTierId VARCHAR(255) NOT NULL;
   
   -- Add foreign key constraint
   ALTER TABLE institution_subscriptions 
   ADD CONSTRAINT fk_institution_subscription_commission_tier 
   FOREIGN KEY (commissionTierId) REFERENCES commission_tiers(id);
   
   -- Remove redundant fields
   ALTER TABLE institution_subscriptions 
   DROP COLUMN planType,
   DROP COLUMN subscriptionPlanId;
   
   -- Drop SubscriptionPlan table
   DROP TABLE subscription_plans;
   ```

2. **Update Prisma Schema:**
   ```prisma
   model CommissionTier {
     id            String   @id @default(cuid())
     planType      String   // STARTER, PROFESSIONAL, ENTERPRISE
     name          String   @db.VarChar(100)
     description   String   @db.Text
     commissionRate Float   // Commission rate as percentage
     features      Json     // Features included in this tier
     isActive      Boolean  @default(true)
     createdAt     DateTime @default(now())
     updatedAt     DateTime @updatedAt

     // Relations
     institutionSubscriptions InstitutionSubscription[]

     @@unique([planType])
     @@map("commission_tiers")
   }

   model InstitutionSubscription {
     id            String   @id @default(cuid())
     institutionId String   @unique
     commissionTierId String
     status        String   @default("ACTIVE")
     startDate     DateTime @default(now())
     endDate       DateTime
     billingCycle  String   @default("MONTHLY")
     amount        Float
     currency      String   @default("USD")
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

3. **Update Admin Interface:**
   - Rename "Subscription Plans" to "Commission Tiers"
   - Add name and description fields to commission tier management
   - Remove subscription plan management entirely
   - Update feature selection to work with commission tiers directly

4. **Update API Endpoints:**
   - Remove `/api/admin/settings/subscription-plans` endpoints
   - Enhance `/api/admin/settings/commission-tiers` endpoints
   - Update institution subscription endpoints to use commissionTierId

## Benefits of This Redesign:

### For Administrators:
- **Single Management Interface**: Manage all plan types in one place
- **Consistent Features**: Features are defined once per plan type
- **Flexible Pricing**: Each institution can have custom pricing
- **Clear Commission Structure**: Commission rates are tied directly to plan types

### For the Platform:
- **Simplified Data Model**: Eliminates redundancy and confusion
- **Better Performance**: Fewer tables and relationships to manage
- **Easier Maintenance**: Single source of truth for plan definitions
- **Scalable Architecture**: Easy to add new plan types

### For Institutions:
- **Clear Plan Structure**: Each plan type has consistent features
- **Flexible Pricing**: Can negotiate custom pricing while maintaining feature sets
- **Transparent Commission**: Clear commission rates per plan type

## Migration Strategy:

1. **Phase 1**: Create new CommissionTier structure alongside existing tables
2. **Phase 2**: Migrate existing data to new structure
3. **Phase 3**: Update application code to use new structure
4. **Phase 4**: Remove old tables and code
5. **Phase 5**: Update admin interface and documentation

## Conclusion:

The current architecture has unnecessary complexity and redundancy. Option 1 (CommissionTier as master) provides a cleaner, more maintainable solution that better reflects the commission-based business model while eliminating confusion about the relationship between commission tiers and subscription plans. 