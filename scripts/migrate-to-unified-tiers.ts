#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function migrateToUnifiedTiers() {
  console.log('🔄 Starting migration to unified tier system...\n');

  try {
    // Step 1: Create student tiers
    console.log('1. Creating student tiers...');
    
    const studentTiers = [
      {
        planType: 'BASIC',
        name: 'Basic Plan',
        description: 'Perfect for beginners starting their language journey',
        price: 12.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
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
        },
        maxCourses: 5,
        maxLanguages: 5,
        isActive: true
      },
      {
        planType: 'PREMIUM',
        name: 'Premium Plan',
        description: 'Most popular choice for serious language learners',
        price: 24.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
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
        },
        maxCourses: 20,
        maxLanguages: -1,
        isActive: true
      },
      {
        planType: 'PRO',
        name: 'Pro Plan',
        description: 'Complete language learning experience with personal tutoring',
        price: 49.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
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
        },
        maxCourses: -1,
        maxLanguages: -1,
        isActive: true
      }
    ];

    for (const tier of studentTiers) {
      await prisma.studentTier.upsert({
        where: { planType: tier.planType },
        update: {
          name: tier.name,
          description: tier.description,
          price: tier.price,
          currency: tier.currency,
          billingCycle: tier.billingCycle,
          features: tier.features,
          maxCourses: tier.maxCourses,
          maxLanguages: tier.maxLanguages,
          isActive: tier.isActive,
          updatedAt: new Date()
        },
        create: {
          planType: tier.planType,
          name: tier.name,
          description: tier.description,
          price: tier.price,
          currency: tier.currency,
          billingCycle: tier.billingCycle,
          features: tier.features,
          maxCourses: tier.maxCourses,
          maxLanguages: tier.maxLanguages,
          isActive: tier.isActive
        }
      });
      console.log(`    Created/updated ${tier.planType} student tier: ${tier.price}/month`);
    }

    // Step 2: Update commission tiers with pricing
    console.log('\n2. Updating commission tiers with pricing...');
    
    const commissionTiers = [
      {
        planType: 'STARTER',
        name: 'Starter Plan',
        description: 'Perfect for small language schools and individual tutors',
        price: 99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        commissionRate: 25,
        features: {
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
        },
        maxStudents: 50,
        maxCourses: 5,
        maxTeachers: 2,
        isActive: true
      },
      {
        planType: 'PROFESSIONAL',
        name: 'Professional Plan',
        description: 'Ideal for growing language institutions',
        price: 299,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        commissionRate: 15,
        features: {
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
        },
        maxStudents: 200,
        maxCourses: 15,
        maxTeachers: 5,
        isActive: true
      },
      {
        planType: 'ENTERPRISE',
        name: 'Enterprise Plan',
        description: 'Complete solution for large language organizations',
        price: 799,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        commissionRate: 10,
        features: {
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
        },
        maxStudents: 1000,
        maxCourses: 50,
        maxTeachers: 20,
        isActive: true
      }
    ];

    for (const tier of commissionTiers) {
      await prisma.commissionTier.upsert({
        where: { planType: tier.planType },
        update: {
          name: tier.name,
          description: tier.description,
          price: tier.price,
          currency: tier.currency,
          billingCycle: tier.billingCycle,
          commissionRate: tier.commissionRate,
          features: tier.features,
          maxStudents: tier.maxStudents,
          maxCourses: tier.maxCourses,
          maxTeachers: tier.maxTeachers,
          isActive: tier.isActive,
          updatedAt: new Date()
        },
        create: {
          planType: tier.planType,
          name: tier.name,
          description: tier.description,
          price: tier.price,
          currency: tier.currency,
          billingCycle: tier.billingCycle,
          commissionRate: tier.commissionRate,
          features: tier.features,
          maxStudents: tier.maxStudents,
          maxCourses: tier.maxCourses,
          maxTeachers: tier.maxTeachers,
          isActive: tier.isActive
        }
      });
      console.log(`    Created/updated ${tier.planType} commission tier: ${tier.price}/month (${tier.commissionRate}% commission)`);
    }

    // Step 3: Link existing subscriptions to tiers
    console.log('\n3. Linking existing subscriptions to tiers...');
    
    const institutionSubscriptions = await prisma.institutionSubscription.findMany();
    console.log(`   Found ${institutionSubscriptions.length} institution subscriptions`);
    
    for (const sub of institutionSubscriptions) {
      const tier = await prisma.commissionTier.findFirst({
        where: { planType: sub.planType }
      });
      
      if (tier) {
        await prisma.institutionSubscription.update({
          where: { id: sub.id },
          data: { 
            commissionTierId: tier.id,
            updatedAt: new Date()
          }
        });
        console.log(`    Linked institution subscription ${sub.id} to ${tier.planType} tier`);
      } else {
        console.log(`   ⚠️  No tier found for institution subscription ${sub.id} with plan type ${sub.planType}`);
      }
    }

    const studentSubscriptions = await prisma.studentSubscription.findMany();
    console.log(`   Found ${studentSubscriptions.length} student subscriptions`);
    
    for (const sub of studentSubscriptions) {
      const tier = await prisma.studentTier.findFirst({
        where: { planType: sub.planType }
      });
      
      if (tier) {
        await prisma.studentSubscription.update({
          where: { id: sub.id },
          data: { 
            studentTierId: tier.id,
            updatedAt: new Date()
          }
        });
        console.log(`    Linked student subscription ${sub.id} to ${tier.planType} tier`);
      } else {
        console.log(`   ⚠️  No tier found for student subscription ${sub.id} with plan type ${sub.planType}`);
      }
    }

    // Step 4: Validation
    console.log('\n4. Validating migration...');
    
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

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update Prisma schema to add new fields');
    console.log('2. Create database migration to add tier reference columns');
    console.log('3. Update API endpoints to use new tier structure');
    console.log('4. Update frontend components for unified tier management');

  } catch (error) {
    logger.error('❌ Migration failed:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateToUnifiedTiers().catch(console.error); 