import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch permissions for an institution
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admin can view permissions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: params.id }
    });

    if (!institution) {
      return NextResponse.json(
        { message: 'Institution not found' },
        { status: 404 }
      );
    }

    // Get or create permissions
    let permissions = await prisma.institutionPermissions.findUnique({
      where: { institutionId: params.id }
    });

    if (!permissions) {
      // Create default permissions (all false)
      permissions = await prisma.institutionPermissions.create({
        data: {
          institutionId: params.id,
          // All permissions default to false
        }
      });
    }

    return NextResponse.json(permissions);
  } catch (error) {
    console.error('Error fetching institution permissions:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

// PUT - Update permissions for an institution
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admin can update permissions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: params.id }
    });

    if (!institution) {
      return NextResponse.json(
        { message: 'Institution not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      canCreateCourses,
      canEditCourses,
      canDeleteCourses,
      canPublishCourses,
      canCreateContent,
      canEditContent,
      canDeleteContent,
      canUploadMedia,
      canCreateQuizzes,
      canEditQuizzes,
      canDeleteQuizzes,
      canViewQuizResults,
      canViewStudents,
      canManageStudents,
      canViewEnrollments,
      canViewPayments,
      canViewPayouts,
      canManagePricing,
      canViewAnalytics,
      canViewReports,
      canExportData,
      canEditProfile,
      canManageUsers,
      canViewSettings
    } = body;

    // Update or create permissions
    const permissions = await prisma.institutionPermissions.upsert({
      where: { institutionId: params.id },
      update: {
        canCreateCourses: canCreateCourses ?? false,
        canEditCourses: canEditCourses ?? false,
        canDeleteCourses: canDeleteCourses ?? false,
        canPublishCourses: canPublishCourses ?? false,
        canCreateContent: canCreateContent ?? false,
        canEditContent: canEditContent ?? false,
        canDeleteContent: canDeleteContent ?? false,
        canUploadMedia: canUploadMedia ?? false,
        canCreateQuizzes: canCreateQuizzes ?? false,
        canEditQuizzes: canEditQuizzes ?? false,
        canDeleteQuizzes: canDeleteQuizzes ?? false,
        canViewQuizResults: canViewQuizResults ?? false,
        canViewStudents: canViewStudents ?? false,
        canManageStudents: canManageStudents ?? false,
        canViewEnrollments: canViewEnrollments ?? false,
        canViewPayments: canViewPayments ?? false,
        canViewPayouts: canViewPayouts ?? false,
        canManagePricing: canManagePricing ?? false,
        canViewAnalytics: canViewAnalytics ?? false,
        canViewReports: canViewReports ?? false,
        canExportData: canExportData ?? false,
        canEditProfile: canEditProfile ?? false,
        canManageUsers: canManageUsers ?? false,
        canViewSettings: canViewSettings ?? false,
        updatedAt: new Date()
      },
      create: {
        institutionId: params.id,
        canCreateCourses: canCreateCourses ?? false,
        canEditCourses: canEditCourses ?? false,
        canDeleteCourses: canDeleteCourses ?? false,
        canPublishCourses: canPublishCourses ?? false,
        canCreateContent: canCreateContent ?? false,
        canEditContent: canEditContent ?? false,
        canDeleteContent: canDeleteContent ?? false,
        canUploadMedia: canUploadMedia ?? false,
        canCreateQuizzes: canCreateQuizzes ?? false,
        canEditQuizzes: canEditQuizzes ?? false,
        canDeleteQuizzes: canDeleteQuizzes ?? false,
        canViewQuizResults: canViewQuizResults ?? false,
        canViewStudents: canViewStudents ?? false,
        canManageStudents: canManageStudents ?? false,
        canViewEnrollments: canViewEnrollments ?? false,
        canViewPayments: canViewPayments ?? false,
        canViewPayouts: canViewPayouts ?? false,
        canManagePricing: canManagePricing ?? false,
        canViewAnalytics: canViewAnalytics ?? false,
        canViewReports: canViewReports ?? false,
        canExportData: canExportData ?? false,
        canEditProfile: canEditProfile ?? false,
        canManageUsers: canManageUsers ?? false,
        canViewSettings: canViewSettings ?? false
      }
    });

    // // // console.log('Permissions updated successfully');
    return NextResponse.json({
      message: 'Permissions updated successfully',
      permissions
    });
  } catch (error) {
    console.error('Error updating institution permissions:');
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 