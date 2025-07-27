import { prisma } from '@/lib/prisma';
import { logger } from './logger';

export interface InstitutionPermissions {
  id: string;
  institutionId: string;
  canCreateCourses: boolean;
  canEditCourses: boolean;
  canDeleteCourses: boolean;
  canPublishCourses: boolean;
  canCreateContent: boolean;
  canEditContent: boolean;
  canDeleteContent: boolean;
  canUploadMedia: boolean;
  canCreateQuizzes: boolean;
  canEditQuizzes: boolean;
  canDeleteQuizzes: boolean;
  canViewQuizResults: boolean;
  canViewStudents: boolean;
  canManageStudents: boolean;
  canViewEnrollments: boolean;
  canViewPayments: boolean;
  canViewPayouts: boolean;
  canManagePricing: boolean;
  canViewAnalytics: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canEditProfile: boolean;
  canManageUsers: boolean;
  canViewSettings: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get permissions for an institution
 */
export async function getInstitutionPermissions(institutionId: string): Promise<InstitutionPermissions | null> {
  try {
    const permissions = await prisma.institutionPermissions.findUnique({
      where: { institutionId }
    });

    if (!permissions) {
      // Create default permissions if none exist
      return await prisma.institutionPermissions.create({
        data: {
          institutionId,
          // All permissions default to false
        }
      });
    }

    return permissions;
  } catch (error) {
    logger.error('Error fetching institution permissions:');
    return null;
  }
}

/**
 * Check if an institution has a specific permission
 */
export async function hasPermission(
  institutionId: string, 
  permission: keyof Omit<InstitutionPermissions, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>
): Promise<boolean> {
  try {
    const permissions = await getInstitutionPermissions(institutionId);
    return permissions ? permissions[permission] : false;
  } catch (error) {
    logger.error('Error checking permission:');
    return false;
  }
}

/**
 * Check multiple permissions for an institution
 */
export async function hasPermissions(
  institutionId: string, 
  requiredPermissions: Array<keyof Omit<InstitutionPermissions, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>>
): Promise<boolean> {
  try {
    const permissions = await getInstitutionPermissions(institutionId);
    if (!permissions) return false;

    return requiredPermissions.every(permission => permissions[permission]);
  } catch (error) {
    logger.error('Error checking permissions:');
    return false;
  }
}

/**
 * Get user's institution permissions
 */
export async function getUserInstitutionPermissions(userId: string): Promise<InstitutionPermissions | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { institution: true }
    });

    if (!user?.institution?.id) {
      return null;
    }

    return await getInstitutionPermissions(user.institution.id);
  } catch (error) {
    logger.error('Error fetching user institution permissions:');
    return null;
  }
}

/**
 * Check if a user has a specific permission for their institution
 */
export async function userHasPermission(
  userId: string, 
  permission: keyof Omit<InstitutionPermissions, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>
): Promise<boolean> {
  try {
    const permissions = await getUserInstitutionPermissions(userId);
    return permissions ? permissions[permission] : false;
  } catch (error) {
    logger.error('Error checking user permission:');
    return false;
  }
}

/**
 * Check if a user has multiple permissions for their institution
 */
export async function userHasPermissions(
  userId: string, 
  requiredPermissions: Array<keyof Omit<InstitutionPermissions, 'id' | 'institutionId' | 'createdAt' | 'updatedAt'>>
): Promise<boolean> {
  try {
    const permissions = await getUserInstitutionPermissions(userId);
    if (!permissions) return false;

    return requiredPermissions.every(permission => permissions[permission]);
  } catch (error) {
    logger.error('Error checking user permissions:');
    return false;
  }
} 