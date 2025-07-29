#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateDatabasePricing() {
  console.log('🔄 Starting database pricing update...\n');

  try {
    // Update StudentTier pricing
    console.log('1. Updating StudentTier pricing...');
    
    await prisma.studentTier.updateMany({
      where: { planType: 'BASIC' },
      data: {
        price: 12.99,
        name: 'Basic Plan',
        description: 'Perfect for beginners starting their language journey',
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
          customLearningPaths: false,
          videoConferencing: false
        },
        maxCourses: 5,
        maxLanguages: 5,
        updatedAt: new Date()
      }
    });

    await prisma.studentTier.updateMany({
      where: { planType: 'PREMIUM' },
      data: {
        price: 24.99,
        name: 'Premium Plan',
        description: 'Most popular choice for serious language learners',
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
          customLearningPaths: false,
          videoConferencing: 'limited'
        },
        maxCourses: 20,
        maxLanguages: -1,
        updatedAt: new Date()
      }
    });

    await prisma.studentTier.updateMany({
      where: { planType: 'PRO' },
      data: {
        price: 49.99,
        name: 'Pro Plan',
        description: 'Complete language learning experience with personal tutoring',
        features: {
          maxCourses: -1,
          maxLanguages: -1,
          progressTracking: true,
          dedicatedSupport: true,
          liveConversations: true,
          aiAssistant: true,
          offlineAccess: true,
          videoLessons: true,
          culturalContent: true,
          certificates: true,
          basicLessons: true,
          mobileAccess: true,
          personalTutoring: true,
          customLearningPaths: true,
          videoConferencing: 'unlimited',
          groupStudySessions: true,
          advancedAssessment: true,
          portfolioBuilding: true,
          careerGuidance: true,
          exclusiveContent: true
        },
        maxCourses: -1,
        maxLanguages: -1,
        updatedAt: new Date()
      }
    });

    console.log('✅ StudentTier pricing updated successfully');

    // Update CommissionTier pricing
    console.log('\n2. Updating CommissionTier pricing...');
    
    await prisma.commissionTier.updateMany({
      where: { planType: 'STARTER' },
      data: {
        price: 99,
        name: 'Starter Plan',
        description: 'Perfect for small language schools getting started online',
        features: {
          maxStudents: 50,
          maxCourses: 5,
          maxTeachers: 2,
          basicAnalytics: true,
          emailSupport: true,
          courseManagement: true,
          studentProgress: true,
          paymentProcessing: true,
          mobileAccess: true,
          certificateGeneration: true,
          advancedAnalytics: false,
          customBranding: false,
          prioritySupport: false,
          marketingTools: false,
          apiAccess: false,
          whiteLabel: false,
          videoConferencing: false
        },
        maxStudents: 50,
        maxCourses: 5,
        maxTeachers: 2,
        updatedAt: new Date()
      }
    });

    await prisma.commissionTier.updateMany({
      where: { planType: 'PROFESSIONAL' },
      data: {
        price: 299,
        name: 'Professional Plan',
        description: 'Ideal for growing institutions with multiple courses',
        features: {
          maxStudents: 200,
          maxCourses: 15,
          maxTeachers: 5,
          basicAnalytics: true,
          emailSupport: true,
          courseManagement: true,
          studentProgress: true,
          paymentProcessing: true,
          mobileAccess: true,
          certificateGeneration: true,
          advancedAnalytics: true,
          customBranding: true,
          prioritySupport: true,
          marketingTools: true,
          multiLanguageSupport: true,
          advancedCertificates: true,
          studentManagement: true,
          revenueTracking: true,
          apiAccess: false,
          whiteLabel: false,
          videoConferencing: 'limited'
        },
        maxStudents: 200,
        maxCourses: 15,
        maxTeachers: 5,
        updatedAt: new Date()
      }
    });

    await prisma.commissionTier.updateMany({
      where: { planType: 'ENTERPRISE' },
      data: {
        price: 799,
        name: 'Enterprise Plan',
        description: 'Complete solution for large language organizations',
        features: {
          maxStudents: 1000,
          maxCourses: 50,
          maxTeachers: 20,
          basicAnalytics: true,
          emailSupport: true,
          courseManagement: true,
          studentProgress: true,
          paymentProcessing: true,
          mobileAccess: true,
          certificateGeneration: true,
          advancedAnalytics: true,
          customBranding: true,
          prioritySupport: true,
          marketingTools: true,
          multiLanguageSupport: true,
          advancedCertificates: true,
          studentManagement: true,
          revenueTracking: true,
          apiAccess: true,
          whiteLabel: true,
          dedicatedAccountManager: true,
          customIntegrations: true,
          advancedSecurity: true,
          multiLocationSupport: true,
          customReporting: true,
          videoConferencing: 'unlimited'
        },
        maxStudents: 1000,
        maxCourses: 50,
        maxTeachers: 20,
        updatedAt: new Date()
      }
    });

    console.log('✅ CommissionTier pricing updated successfully');

    // Verify updates
    console.log('\n3. Verifying updates...');
    
    const studentTiers = await prisma.studentTier.findMany({
      orderBy: { price: 'asc' }
    });

    const institutionTiers = await prisma.commissionTier.findMany({
      orderBy: { price: 'asc' }
    });

    console.log('\n📊 Updated Student Tiers:');
    studentTiers.forEach(tier => {
      console.log(`  ${tier.planType}: $${tier.price}/month - ${tier.name}`);
    });

    console.log('\n📊 Updated Institution Tiers:');
    institutionTiers.forEach(tier => {
      console.log(`  ${tier.planType}: $${tier.price}/month (${tier.commissionRate}% commission) - ${tier.name}`);
    });

    console.log('\n✅ Database pricing update completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('  1. Update components to use lib/subscription-pricing.ts');
    console.log('  2. Test pricing displays across the platform');
    console.log('  3. Verify subscription flows work correctly');

  } catch (error) {
    console.error('❌ Error updating database pricing:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateDatabasePricing(); 