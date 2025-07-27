import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function setupDefaultPermissions() {
  try {
    console.log('Setting up default permissions for institutions...');

    // Get all institutions
    const institutions = await prisma.institution.findMany();

    for (const institution of institutions) {
      // Check if permissions already exist
      const existingPermissions = await prisma.institutionPermissions.findUnique({
        where: { institutionId: institution.id }
      });

      if (!existingPermissions) {
        // Create default permissions
        await prisma.institutionPermissions.create({
          data: {
            institutionId: institution.id,
            canCreateCourses: true,
            canEditCourses: true,
            canDeleteCourses: true,
            canPublishCourses: true,
            canCreateContent: true,
            canEditContent: true,
            canDeleteContent: true,
            canUploadMedia: true,
            canCreateQuizzes: true,
            canEditQuizzes: true,
            canDeleteQuizzes: true,
            canViewQuizResults: true,
            canViewStudents: true,
            canManageStudents: true,
            canViewEnrollments: true,
            canViewPayments: true,
            canViewPayouts: true,
            canManagePricing: true,
            canViewAnalytics: true,
            canViewReports: true,
            canExportData: true,
            canEditProfile: true,
            canManageUsers: true,
            canViewSettings: true
          }
        });
        console.log(`Created permissions for institution: ${institution.name}`);
      } else {
        // Update existing permissions to ensure quiz permissions are enabled
        await prisma.institutionPermissions.update({
          where: { institutionId: institution.id },
          data: {
            canCreateQuizzes: true,
            canEditQuizzes: true,
            canDeleteQuizzes: true,
            canViewQuizResults: true,
            canViewAnalytics: true
          }
        });
        console.log(`Updated permissions for institution: ${institution.name}`);
      }
    }

    console.log('Default permissions setup completed successfully!');
  } catch (error) {
    logger.error('Error setting up default permissions:');
  } finally {
    await prisma.$disconnect();
  }
}

setupDefaultPermissions(); 