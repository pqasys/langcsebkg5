#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function columnExists(table: string, column: string) {
  const result = await prisma.$queryRawUnsafe<any[]>(
    `SELECT COUNT(*) as count FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    table,
    column
  );
  return result[0]?.count > 0;
}

async function tableExists(table: string) {
  const result = await prisma.$queryRawUnsafe<any[]>(
    `SELECT COUNT(*) as count FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    table
  );
  return result[0]?.count > 0;
}

async function migrateDatabaseStepByStep() {
  console.log('🔄 Starting step-by-step database migration...\n');

  try {
    // Step 1: Add nullable columns to commission_tiers if not exist
    console.log('1. Adding nullable columns to commission_tiers...');
    const commissionTierColumns = [
      { name: 'name', sql: 'VARCHAR(100) NULL' },
      { name: 'description', sql: 'TEXT NULL' },
      { name: 'price', sql: 'DECIMAL(10,2) NULL' },
      { name: 'currency', sql: "VARCHAR(3) NULL DEFAULT 'USD'" },
      { name: 'billingCycle', sql: "VARCHAR(20) NULL DEFAULT 'MONTHLY'" },
      { name: 'maxStudents', sql: 'INT NULL DEFAULT 10' },
      { name: 'maxCourses', sql: 'INT NULL DEFAULT 5' },
      { name: 'maxTeachers', sql: 'INT NULL DEFAULT 2' },
    ];
    for (const col of commissionTierColumns) {
      if (!(await columnExists('commission_tiers', col.name))) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE commission_tiers ADD COLUMN ${col.name} ${col.sql}`
        );
        console.log(`    Added column ${col.name} to commission_tiers`);
      } else {
        console.log(`   ⏩ Column ${col.name} already exists in commission_tiers`);
      }
    }

    // Step 2: Add nullable columns to subscription tables if not exist
    console.log('\n2. Adding nullable columns to subscription tables...');
    if (!(await columnExists('institution_subscriptions', 'commissionTierId'))) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE institution_subscriptions ADD COLUMN commissionTierId VARCHAR(255) NULL`
      );
      console.log('   ✅ Added commissionTierId to institution_subscriptions');
    } else {
      console.log('   ⏩ commissionTierId already exists in institution_subscriptions');
    }
    if (!(await columnExists('student_subscriptions', 'studentTierId'))) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE student_subscriptions ADD COLUMN studentTierId VARCHAR(255) NULL`
      );
      console.log('   ✅ Added studentTierId to student_subscriptions');
    } else {
      console.log('   ⏩ studentTierId already exists in student_subscriptions');
    }

    // Step 3: Create student_tiers table if not exist
    console.log('\n3. Creating student_tiers table...');
    if (!(await tableExists('student_tiers'))){
      await prisma.$executeRawUnsafe(
        `CREATE TABLE student_tiers (
          id VARCHAR(191) PRIMARY KEY,
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
        )`
      );
      console.log('   ✅ Created student_tiers table');
    } else {
      console.log('   ⏩ student_tiers table already exists');
    }

    // Step 4: Insert default student tiers
    console.log('\n4. Inserting default student tiers...');
    const studentTiers = [
      {
        id: 'basic-tier',
        planType: 'BASIC',
        name: 'Basic Plan',
        description: 'Perfect for beginners starting their language journey',
        price: 12.99,
        features: JSON.stringify({
          maxCourses: 5,
          maxLanguages: 5,
          progressTracking: true,
          emailSupport: true,
          mobileAccess: true,
          basicLessons: true,
          certificates: false,
          liveConversations: false,
          aiAssistant: false,
          offlineAccess: false,
          personalTutoring: false,
          customLearningPaths: false
        }),
        maxCourses: 5,
        maxLanguages: 5
      },
      {
        id: 'premium-tier',
        planType: 'PREMIUM',
        name: 'Premium Plan',
        description: 'Most popular choice for serious language learners',
        price: 24.99,
        features: JSON.stringify({
          maxCourses: 20,
          maxLanguages: -1,
          progressTracking: true,
          prioritySupport: true,
          liveConversations: true,
          aiAssistant: true,
          offlineAccess: true,
          videoLessons: true,
          culturalContent: true,
          certificates: true,
          basicLessons: true,
          mobileAccess: true,
          personalTutoring: false,
          customLearningPaths: false
        }),
        maxCourses: 20,
        maxLanguages: -1
      },
      {
        id: 'pro-tier',
        planType: 'PRO',
        name: 'Pro Plan',
        description: 'Complete language learning experience with personal tutoring',
        price: 49.99,
        features: JSON.stringify({
          maxCourses: -1,
          maxLanguages: -1,
          progressTracking: true,
          dedicatedSupport: true,
          liveConversations: true,
          aiAssistant: true,
          personalTutoring: true,
          customLearningPaths: true,
          certificationPrep: true,
          advancedAnalytics: true,
          groupStudySessions: true,
          offlineAccess: true,
          videoLessons: true,
          culturalContent: true,
          certificates: true,
          basicLessons: true,
          mobileAccess: true,
          prioritySupport: true
        }),
        maxCourses: -1,
        maxLanguages: -1
      }
    ];
    for (const tier of studentTiers) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO student_tiers (id, planType, name, description, price, features, maxCourses, maxLanguages)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         description = VALUES(description),
         price = VALUES(price),
         features = VALUES(features),
         maxCourses = VALUES(maxCourses),
         maxLanguages = VALUES(maxLanguages),
         updatedAt = CURRENT_TIMESTAMP`,
        tier.id, tier.planType, tier.name, tier.description, tier.price, tier.features, tier.maxCourses, tier.maxLanguages
      );
      console.log(`    Created/updated ${tier.planType} student tier: ${tier.price}/month`);
    }

    // Step 5: Update commission tiers with pricing
    console.log('\n5. Updating commission tiers with pricing...');
    const commissionTiers = [
      {
        planType: 'STARTER',
        name: 'Starter Plan',
        description: 'Perfect for small language schools and individual tutors',
        price: 99,
        commissionRate: 25,
        features: JSON.stringify({
          maxStudents: 50,
          maxCourses: 5,
          maxTeachers: 2,
          basicAnalytics: true,
          emailSupport: true,
          customBranding: false,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: false,
          advancedAnalytics: false,
          marketingTools: false,
          dedicatedAccountManager: false
        }),
        maxStudents: 50,
        maxCourses: 5,
        maxTeachers: 2
      },
      {
        planType: 'PROFESSIONAL',
        name: 'Professional Plan',
        description: 'Ideal for growing language institutions',
        price: 299,
        commissionRate: 15,
        features: JSON.stringify({
          maxStudents: 200,
          maxCourses: 15,
          maxTeachers: 5,
          basicAnalytics: true,
          emailSupport: true,
          customBranding: true,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: true,
          advancedAnalytics: true,
          marketingTools: true,
          dedicatedAccountManager: false
        }),
        maxStudents: 200,
        maxCourses: 15,
        maxTeachers: 5
      },
      {
        planType: 'ENTERPRISE',
        name: 'Enterprise Plan',
        description: 'Complete solution for large language organizations',
        price: 799,
        commissionRate: 10,
        features: JSON.stringify({
          maxStudents: 1000,
          maxCourses: 50,
          maxTeachers: 20,
          basicAnalytics: true,
          emailSupport: true,
          customBranding: true,
          apiAccess: true,
          whiteLabel: true,
          prioritySupport: true,
          advancedAnalytics: true,
          marketingTools: true,
          dedicatedAccountManager: true
        }),
        maxStudents: 1000,
        maxCourses: 50,
        maxTeachers: 20
      }
    ];
    for (const tier of commissionTiers) {
      await prisma.$executeRawUnsafe(
        `UPDATE commission_tiers 
         SET name = ?, description = ?, price = ?, features = ?, maxStudents = ?, maxCourses = ?, maxTeachers = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE planType = ?`,
        tier.name, tier.description, tier.price, tier.features, tier.maxStudents, tier.maxCourses, tier.maxTeachers, tier.planType
      );
      console.log(`    Updated ${tier.planType} commission tier: ${tier.price}/month (${tier.commissionRate}% commission)`);
    }

    // Step 6: Link existing subscriptions to tiers
    console.log('\n6. Linking existing subscriptions to tiers...');
    const institutionSubscriptions = await prisma.institutionSubscription.findMany();
    console.log(`   Found ${institutionSubscriptions.length} institution subscriptions`);
    for (const sub of institutionSubscriptions) {
      await prisma.$executeRawUnsafe(
        `UPDATE institution_subscriptions 
         SET commissionTierId = (SELECT id FROM commission_tiers WHERE planType = ? LIMIT 1)
         WHERE id = ?`,
        sub.planType, sub.id
      );
      console.log(`    Linked institution subscription ${sub.id} to ${sub.planType} tier`);
    }
    const studentSubscriptions = await prisma.studentSubscription.findMany();
    console.log(`   Found ${studentSubscriptions.length} student subscriptions`);
    for (const sub of studentSubscriptions) {
      await prisma.$executeRawUnsafe(
        `UPDATE student_subscriptions 
         SET studentTierId = (SELECT id FROM student_tiers WHERE planType = ? LIMIT 1)
         WHERE id = ?`,
        sub.planType, sub.id
      );
      console.log(`    Linked student subscription ${sub.id} to ${sub.planType} tier`);
    }

    // Step 7: Make columns required
    console.log('\n7. Making columns required...');
    for (const col of ['name', 'description', 'price']) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE commission_tiers MODIFY COLUMN ${col} ${col === 'price' ? 'DECIMAL(10,2)' : col === 'name' ? 'VARCHAR(100)' : 'TEXT'} NOT NULL`
      );
      console.log(`    Made commission_tiers column ${col} required`);
    }
    await prisma.$executeRawUnsafe(
      `ALTER TABLE institution_subscriptions MODIFY COLUMN commissionTierId VARCHAR(255) NOT NULL`
    );
    console.log('   ✅ Made institution_subscriptions commissionTierId required');
    await prisma.$executeRawUnsafe(
      `ALTER TABLE student_subscriptions MODIFY COLUMN studentTierId VARCHAR(255) NOT NULL`
    );
    console.log('   ✅ Made student_subscriptions studentTierId required');

    // Step 8: Remove old columns
    console.log('\n8. Removing old columns...');
    for (const col of ['planType', 'subscriptionPlanId', 'amount', 'currency', 'billingCycle']) {
      if (await columnExists('institution_subscriptions', col)) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE institution_subscriptions DROP COLUMN ${col}`
        );
        console.log(`    Removed column ${col} from institution_subscriptions`);
      }
    }
    for (const col of ['planType', 'amount', 'currency', 'billingCycle']) {
      if (await columnExists('student_subscriptions', col)) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE student_subscriptions DROP COLUMN ${col}`
        );
        console.log(`    Removed column ${col} from student_subscriptions`);
      }
    }

    // Step 9: Drop subscription_plans table if exists
    console.log('\n9. Dropping subscription_plans table...');
    if (await tableExists('subscription_plans')) {
      await prisma.$executeRawUnsafe('DROP TABLE subscription_plans');
      console.log('   ✅ Dropped subscription_plans table');
    } else {
      console.log('   ⏩ subscription_plans table already dropped');
    }

    // Step 10: Validation
    console.log('\n10. Validating migration...');
    const finalInstitutionTiers = await prisma.commissionTier.findMany();
    const finalStudentTiers = await prisma.studentTier.findMany();
    console.log(`    Institution tiers: ${finalInstitutionTiers.length}`);
    console.log(`    Student tiers: ${finalStudentTiers.length}`);
    const linkedInstitutionSubs = await prisma.institutionSubscription.findMany({
      where: { commissionTierId: { not: null } }
    });
    const linkedStudentSubs = await prisma.studentSubscription.findMany({
      where: { studentTierId: { not: null } }
    });
    console.log(`    Linked institution subscriptions: ${linkedInstitutionSubs.length}/${institutionSubscriptions.length}`);
    console.log(`    Linked student subscriptions: ${linkedStudentSubs.length}/${studentSubscriptions.length}`);
    console.log('\n🎉 Database migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update API endpoints to use new tier structure');
    console.log('2. Update frontend components for unified tier management');
    console.log('3. Test all subscription flows');
  } catch (error) {
    logger.error('❌ Migration failed:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateDatabaseStepByStep().catch(console.error); 