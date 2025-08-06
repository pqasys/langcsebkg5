import { PrismaClient } from '@prisma/client';

// Simple logger for migration
const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error || '')
};

const prisma = new PrismaClient();

async function migrateSubscriptionGovernance() {
  try {
    logger.info('Starting subscription governance migration...');

    // 1. Update StudentTier table with new governance fields
    logger.info('Updating StudentTier table...');
    
    // Add new columns to StudentTier if they don't exist
    try {
      await prisma.$executeRaw`ALTER TABLE student_tiers ADD COLUMN maxLiveClasses INT DEFAULT 10`;
    } catch (error) {
      logger.warn('maxLiveClasses column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_tiers ADD COLUMN maxStudents INT DEFAULT 1`;
    } catch (error) {
      logger.warn('maxStudents column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_tiers ADD COLUMN maxInstructors INT DEFAULT 1`;
    } catch (error) {
      logger.warn('maxInstructors column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_tiers ADD COLUMN enrollmentQuota INT DEFAULT 5`;
    } catch (error) {
      logger.warn('enrollmentQuota column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_tiers ADD COLUMN attendanceQuota INT DEFAULT 20`;
    } catch (error) {
      logger.warn('attendanceQuota column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_tiers ADD COLUMN gracePeriodDays INT DEFAULT 7`;
    } catch (error) {
      logger.warn('gracePeriodDays column might already exist');
    }

    // 2. Update existing StudentTier records with default values
    logger.info('Updating existing StudentTier records...');
    
    const existingTiers = await prisma.studentTier.findMany();
    
    for (const tier of existingTiers) {
      const updateData: any = {};
      
      // Set default values based on plan type
      switch (tier.planType) {
        case 'BASIC':
          updateData.maxLiveClasses = 5;
          updateData.maxStudents = 1;
          updateData.maxInstructors = 1;
          updateData.enrollmentQuota = 3;
          updateData.attendanceQuota = 10;
          updateData.gracePeriodDays = 7;
          break;
          
        case 'PREMIUM':
          updateData.maxLiveClasses = 15;
          updateData.maxStudents = 2;
          updateData.maxInstructors = 2;
          updateData.enrollmentQuota = 10;
          updateData.attendanceQuota = 30;
          updateData.gracePeriodDays = 14;
          break;
          
        case 'ENTERPRISE':
          updateData.maxLiveClasses = 50;
          updateData.maxStudents = 5;
          updateData.maxInstructors = 5;
          updateData.enrollmentQuota = 25;
          updateData.attendanceQuota = 100;
          updateData.gracePeriodDays = 30;
          break;
          
        default:
          updateData.maxLiveClasses = 10;
          updateData.maxStudents = 1;
          updateData.maxInstructors = 1;
          updateData.enrollmentQuota = 5;
          updateData.attendanceQuota = 20;
          updateData.gracePeriodDays = 7;
      }
      
      await prisma.studentTier.update({
        where: { id: tier.id },
        data: updateData
      });
    }

    // 3. Update StudentSubscription table with new governance fields
    logger.info('Updating StudentSubscription table...');
    
    // Add new columns to StudentSubscription if they don't exist
    try {
      await prisma.$executeRaw`ALTER TABLE student_subscriptions ADD COLUMN maxEnrollments INT DEFAULT 1`;
    } catch (error) {
      logger.warn('maxEnrollments column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_subscriptions ADD COLUMN enrollmentQuota INT DEFAULT 1`;
    } catch (error) {
      logger.warn('enrollmentQuota column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_subscriptions ADD COLUMN attendanceQuota INT DEFAULT 10`;
    } catch (error) {
      logger.warn('attendanceQuota column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_subscriptions ADD COLUMN currentEnrollments INT DEFAULT 0`;
    } catch (error) {
      logger.warn('currentEnrollments column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_subscriptions ADD COLUMN monthlyEnrollments INT DEFAULT 0`;
    } catch (error) {
      logger.warn('monthlyEnrollments column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_subscriptions ADD COLUMN monthlyAttendance INT DEFAULT 0`;
    } catch (error) {
      logger.warn('monthlyAttendance column might already exist');
    }

    // 4. Update existing StudentSubscription records
    logger.info('Updating existing StudentSubscription records...');
    
    const existingSubscriptions = await prisma.studentSubscription.findMany();
    
    for (const subscription of existingSubscriptions) {
      const tier = await prisma.studentTier.findUnique({
        where: { id: subscription.studentTierId }
      });
      
      if (!tier) {
        logger.warn(`No tier found for subscription ${subscription.id}`);
        continue;
      }
      
      // Count current enrollments
      const currentEnrollments = await prisma.studentCourseEnrollment.count({
        where: {
          studentId: subscription.studentId,
          isActive: true
        }
      });
      
      // Count monthly enrollments
      const monthlyEnrollments = await prisma.studentCourseEnrollment.count({
        where: {
          studentId: subscription.studentId,
          startDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      });
      
      // Count monthly attendance
      const monthlyAttendance = await prisma.videoSessionParticipant.count({
        where: {
          userId: subscription.studentId,
          joinedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      });
      
      // Use default values if new fields don't exist yet
      const updateData: any = {
        currentEnrollments,
        monthlyEnrollments,
        monthlyAttendance
      };
      
      // Try to use tier values, fallback to defaults
      try {
        updateData.maxEnrollments = (tier as any).enrollmentQuota || 5;
        updateData.enrollmentQuota = (tier as any).enrollmentQuota || 5;
        updateData.attendanceQuota = (tier as any).attendanceQuota || 20;
      } catch (error) {
        // Use default values if fields don't exist
        updateData.maxEnrollments = 5;
        updateData.enrollmentQuota = 5;
        updateData.attendanceQuota = 20;
      }
      
      await prisma.studentSubscription.update({
        where: { id: subscription.id },
        data: updateData
      });
    }

    // 5. Update Course table - remove redundant fields
    logger.info('Updating Course table...');
    
    // Remove redundant fields if they exist
    try {
      await prisma.$executeRaw`ALTER TABLE course DROP COLUMN hasLiveClasses`;
    } catch (error) {
      logger.warn('hasLiveClasses column might not exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE course DROP COLUMN liveClassType`;
    } catch (error) {
      logger.warn('liveClassType column might not exist');
    }

    // 6. Update StudentCourseEnrollment table with new fields
    logger.info('Updating StudentCourseEnrollment table...');
    
    // Add new columns to StudentCourseEnrollment if they don't exist
    try {
      await prisma.$executeRaw`ALTER TABLE student_course_enrollments ADD COLUMN accessMethod VARCHAR(20) DEFAULT 'DIRECT'`;
    } catch (error) {
      logger.warn('accessMethod column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_course_enrollments ADD COLUMN subscriptionTier VARCHAR(20)`;
    } catch (error) {
      logger.warn('subscriptionTier column might already exist');
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE student_course_enrollments ADD COLUMN enrollmentQuotaUsed BOOLEAN DEFAULT FALSE`;
    } catch (error) {
      logger.warn('enrollmentQuotaUsed column might already exist');
    }

    // 7. Update existing enrollments with access method
    logger.info('Updating existing enrollments...');
    
    const existingEnrollments = await prisma.studentCourseEnrollment.findMany();
    
    for (const enrollment of existingEnrollments) {
      const updateData: any = {};
      
      // Get course details
      const course = await prisma.course.findUnique({
        where: { id: enrollment.courseId }
      });
      
      // Get student details (not used but kept for future reference)
      // const student = await prisma.user.findUnique({
      //   where: { id: enrollment.studentId }
      // });
      
      // Determine access method
      if (course?.isPlatformCourse) {
        updateData.accessMethod = 'SUBSCRIPTION';
        
        // Get subscription tier if available
        const activeSubscription = await prisma.studentSubscription.findFirst({
          where: {
            studentId: enrollment.studentId,
            status: 'ACTIVE'
          }
        });
        
        if (activeSubscription) {
          updateData.subscriptionTier = activeSubscription.planType;
          updateData.enrollmentQuotaUsed = true;
        }
      } else if (course?.institutionId) {
        updateData.accessMethod = 'INSTITUTION';
      } else {
        updateData.accessMethod = 'DIRECT';
      }
      
      await prisma.studentCourseEnrollment.update({
        where: { id: enrollment.id },
        data: updateData
      });
    }

    // 8. Create default subscription tiers if they don't exist
    logger.info('Creating default subscription tiers...');
    
    const defaultTiers = [
      {
        planType: 'BASIC',
        name: 'Basic Plan',
        description: 'Perfect for individual learners getting started',
        price: 12.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
          hdVideo: false,
          recordings: false,
          analytics: false,
          liveClasses: true,
          selfPacedCourses: true
        },
        maxCourses: 5,
        maxLiveClasses: 5,
        maxStudents: 1,
        maxInstructors: 1,
        enrollmentQuota: 3,
        attendanceQuota: 10,
        gracePeriodDays: 7,
        isActive: true
      },
      {
        planType: 'PREMIUM',
        name: 'Premium Plan',
        description: 'Advanced features for serious learners',
        price: 24.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
          hdVideo: true,
          recordings: true,
          analytics: true,
          liveClasses: true,
          selfPacedCourses: true,
          prioritySupport: true
        },
        maxCourses: 15,
        maxLiveClasses: 15,
        maxStudents: 2,
        maxInstructors: 2,
        enrollmentQuota: 10,
        attendanceQuota: 30,
        gracePeriodDays: 14,
        isActive: true
      },
      {
        planType: 'ENTERPRISE',
        name: 'Enterprise Plan',
        description: 'Complete solution for institutions and organizations',
        price: 49.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
          hdVideo: true,
          recordings: true,
          analytics: true,
          liveClasses: true,
          selfPacedCourses: true,
          prioritySupport: true,
          customBranding: true,
          apiAccess: true
        },
        maxCourses: 50,
        maxLiveClasses: 50,
        maxStudents: 5,
        maxInstructors: 5,
        enrollmentQuota: 25,
        attendanceQuota: 100,
        gracePeriodDays: 30,
        isActive: true
      }
    ];
    
    for (const tierData of defaultTiers) {
      const existingTier = await prisma.studentTier.findUnique({
        where: { planType: tierData.planType }
      });
      
      if (!existingTier) {
        await prisma.studentTier.create({
          data: tierData
        });
        logger.info(`Created default tier: ${tierData.planType}`);
      }
    }

    logger.info('Subscription governance migration completed successfully!');
    
  } catch (error) {
    logger.error('Error during subscription governance migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateSubscriptionGovernance()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateSubscriptionGovernance }; 