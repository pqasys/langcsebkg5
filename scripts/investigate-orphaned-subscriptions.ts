import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function investigateOrphanedSubscriptions() {
  try {
    console.log('🔍 Investigating orphaned subscription context...\n');

    // Check if there are any platform-wide courses that might have caused this
    console.log('1. Checking platform-wide courses...');
    const platformCourses = await prisma.course.findMany({
      where: {
        isPlatformCourse: true
      },
      select: {
        id: true,
        title: true,
        institutionId: true,
        isPlatformCourse: true,
        requiresSubscription: true,
        subscriptionTier: true
      }
    });

    console.log(`Found ${platformCourses.length} platform-wide courses:`);
    platformCourses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title}`);
      console.log(`     InstitutionId: ${course.institutionId || 'NULL (Platform Course)'}`);
      console.log(`     Requires Subscription: ${course.requiresSubscription}`);
      console.log(`     Subscription Tier: ${course.subscriptionTier}`);
      console.log('');
    });

    // Check current valid institutions
    console.log('2. Checking current valid institutions...');
    const validInstitutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${validInstitutions.length} valid institutions:`);
    validInstitutions.forEach((inst, index) => {
      console.log(`  ${index + 1}. ${inst.name} (${inst.id})`);
      console.log(`     Email: ${inst.email}`);
      console.log(`     Created: ${inst.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Check if there are any courses with null institutionId (platform courses)
    console.log('3. Checking courses with null institutionId...');
    const nullInstitutionCourses = await prisma.course.findMany({
      where: {
        institutionId: null
      },
      select: {
        id: true,
        title: true,
        isPlatformCourse: true,
        requiresSubscription: true,
        subscriptionTier: true,
        createdAt: true
      }
    });

    console.log(`Found ${nullInstitutionCourses.length} courses with null institutionId:`);
    nullInstitutionCourses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title}`);
      console.log(`     Platform Course: ${course.isPlatformCourse}`);
      console.log(`     Requires Subscription: ${course.requiresSubscription}`);
      console.log(`     Subscription Tier: ${course.subscriptionTier}`);
      console.log(`     Created: ${course.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Check current subscriptions and their relationships
    console.log('4. Checking current subscriptions...');
    const currentSubscriptions = await prisma.institutionSubscription.findMany({
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        commissionTier: {
          select: {
            id: true,
            planType: true,
            name: true
          }
        }
      }
    });

    console.log(`Found ${currentSubscriptions.length} current subscriptions:`);
    currentSubscriptions.forEach((sub, index) => {
      console.log(`  ${index + 1}. ${sub.institution?.name || 'Unknown'} (${sub.institutionId})`);
      console.log(`     Commission Tier: ${sub.commissionTier?.planType} - ${sub.commissionTier?.name}`);
      console.log(`     Status: ${sub.status}`);
      console.log(`     Created: ${sub.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Check if there are any courses that reference the orphaned institution IDs
    console.log('5. Checking for courses that might reference orphaned institutions...');
    
    // These were the orphaned institution IDs from the cleanup
    const orphanedInstitutionIds = [
      'd66f4539-fd35-4bf9-8589-d99e3458c1ec',
      '2f5bfda9-c880-461e-b4ae-aee537f76bef',
      '77ea2e12-e3b2-4d64-b6c8-83a268f9e9be',
      'b9b18c08-2c6c-4582-86f3-9661edebb1d8',
      'f34a92af-923f-4d43-af70-02ee407f53b4',
      '36500bc0-8e31-45dd-ad21-3cac4d9adf66'
    ];

    const coursesWithOrphanedInstitutions = await prisma.course.findMany({
      where: {
        institutionId: {
          in: orphanedInstitutionIds
        }
      },
      select: {
        id: true,
        title: true,
        institutionId: true,
        isPlatformCourse: true,
        requiresSubscription: true,
        subscriptionTier: true,
        createdAt: true
      }
    });

    console.log(`Found ${coursesWithOrphanedInstitutions.length} courses referencing orphaned institutions:`);
    coursesWithOrphanedInstitutions.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title}`);
      console.log(`     Orphaned InstitutionId: ${course.institutionId}`);
      console.log(`     Platform Course: ${course.isPlatformCourse}`);
      console.log(`     Requires Subscription: ${course.requiresSubscription}`);
      console.log(`     Subscription Tier: ${course.subscriptionTier}`);
      console.log(`     Created: ${course.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Check enrollment patterns
    console.log('6. Checking enrollment patterns...');
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        course: {
          institutionId: {
            in: orphanedInstitutionIds
          }
        }
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institutionId: true,
            isPlatformCourse: true
          }
        }
      },
      take: 10
    });

    console.log(`Found ${enrollments.length} enrollments in courses with orphaned institutions (showing first 10):`);
    enrollments.forEach((enrollment, index) => {
      console.log(`  ${index + 1}. Course: ${enrollment.course.title}`);
      console.log(`     Orphaned InstitutionId: ${enrollment.course.institutionId}`);
      console.log(`     Platform Course: ${enrollment.course.isPlatformCourse}`);
      console.log(`     Enrollment Status: ${enrollment.status}`);
      console.log(`     Created: ${enrollment.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    console.log('✅ Investigation completed!');

  } catch (error) {
    console.error('❌ Error investigating orphaned subscriptions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

investigateOrphanedSubscriptions();
