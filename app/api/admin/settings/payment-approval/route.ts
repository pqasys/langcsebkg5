import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { clearPaymentSettingsCache } from '@/lib/constants/payment-config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create admin settings
    let settings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          id: '1',
          allowInstitutionPaymentApproval: true,
          showInstitutionApprovalButtons: true,
          defaultPaymentStatus: 'PENDING',
          institutionApprovableMethods: ['MANUAL', 'BANK_TRANSFER', 'CASH'],
          adminOnlyMethods: ['CREDIT_CARD', 'PAYPAL', 'STRIPE'],
          institutionPaymentApprovalExemptions: [],
          fileUploadMaxSizeMB: 10
        }
      });
    }

    // Get institutions for exemption management
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Get pending payments count for impact assessment
    const pendingPaymentsCount = await prisma.payment.count({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    });

    // Get pending payments that would be affected by disabling institution approval
    // Query payments and their related enrollment data separately
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        enrollmentId: true,
        institutionId: true
      }
    });

    // Get enrollment data for these payments
    const enrollmentIds = pendingPayments.map(p => p.enrollmentId);
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        id: { in: enrollmentIds }
      },
      include: {
        course: {
          include: {
            institution: true
          }
        }
      }
    });

    // Create a map for quick lookup
    const enrollmentMap = new Map(enrollments.map(e => [e.id, e]));

    // Calculate how many payments would be affected by current settings
    const affectedPaymentsCount = pendingPayments.filter(payment => {
      const enrollment = enrollmentMap.get(payment.enrollmentId);
      if (!enrollment) return false;
      
      const institution = enrollment.course.institution;
      const isExempted = settings.institutionPaymentApprovalExemptions.includes(institution.id);
      const canApprove = settings.allowInstitutionPaymentApproval && 
                        !isExempted && 
                        (!payment.paymentMethod || 
                         settings.institutionApprovableMethods.includes(payment.paymentMethod));
      return canApprove;
    }).length;

    return NextResponse.json({
      settings: {
        allowInstitutionPaymentApproval: settings.allowInstitutionPaymentApproval,
        showInstitutionApprovalButtons: settings.showInstitutionApprovalButtons,
        defaultPaymentStatus: settings.defaultPaymentStatus,
        institutionApprovableMethods: settings.institutionApprovableMethods,
        adminOnlyMethods: settings.adminOnlyMethods,
        institutionPaymentApprovalExemptions: settings.institutionPaymentApprovalExemptions,
        fileUploadMaxSizeMB: settings.fileUploadMaxSizeMB
      },
      institutions,
      impact: {
        totalPendingPayments: pendingPaymentsCount,
        affectedPendingPayments: affectedPaymentsCount,
        unaffectedPendingPayments: pendingPaymentsCount - affectedPaymentsCount
      }
    });
  } catch (error) {
    console.error('Error fetching payment approval settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment approval settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      allowInstitutionPaymentApproval,
      showInstitutionApprovalButtons,
      defaultPaymentStatus,
      institutionApprovableMethods,
      adminOnlyMethods,
      institutionPaymentApprovalExemptions,
      fileUploadMaxSizeMB
    } = body;

    // Validate required fields
    if (typeof allowInstitutionPaymentApproval !== 'boolean' ||
        typeof showInstitutionApprovalButtons !== 'boolean' ||
        !defaultPaymentStatus ||
        !Array.isArray(institutionApprovableMethods) ||
        !Array.isArray(adminOnlyMethods) ||
        !Array.isArray(institutionPaymentApprovalExemptions) ||
        typeof fileUploadMaxSizeMB !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Check if we're disabling institution approval or adding exemptions
    const currentSettings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    const isDisablingInstitutionApproval = currentSettings?.allowInstitutionPaymentApproval && !allowInstitutionPaymentApproval;
    const isAddingExemptions = currentSettings?.institutionPaymentApprovalExemptions.length < institutionPaymentApprovalExemptions.length;
    const isRestrictingMethods = currentSettings?.institutionApprovableMethods.length > institutionApprovableMethods.length;

    let affectedPayments: any[] = [];
    let affectedPaymentsCount = 0;
    
    if (isDisablingInstitutionApproval || isAddingExemptions || isRestrictingMethods) {
      // Query payments and their related enrollment data separately
      const pendingPayments = await prisma.payment.findMany({
        where: {
          status: { in: ['PENDING', 'PROCESSING'] }
        },
        select: {
          id: true,
          amount: true,
          status: true,
          paymentMethod: true,
          enrollmentId: true,
          institutionId: true
        }
      });

      // Get enrollment data for these payments
      const enrollmentIds = pendingPayments.map(p => p.enrollmentId);
      const enrollments = await prisma.studentCourseEnrollment.findMany({
        where: {
          id: { in: enrollmentIds }
        },
        include: {
          course: {
            include: {
              institution: true
            }
          }
        }
      });

      // Create a map for quick lookup
      const enrollmentMap = new Map(enrollments.map(e => [e.id, e]));

      affectedPayments = pendingPayments.filter(payment => {
        const enrollment = enrollmentMap.get(payment.enrollmentId);
        if (!enrollment) return false;
        
        const institution = enrollment.course.institution;
        const isExempted = institutionPaymentApprovalExemptions.includes(institution.id);
        const canApprove = allowInstitutionPaymentApproval && 
                          !isExempted && 
                          (!payment.paymentMethod || 
                           institutionApprovableMethods.includes(payment.paymentMethod));
        return !canApprove;
      });

      affectedPaymentsCount = affectedPayments.length;
    }

    // Update or create admin settings
    const settings = await prisma.adminSettings.upsert({
      where: { id: '1' },
      update: {
        allowInstitutionPaymentApproval,
        showInstitutionApprovalButtons,
        defaultPaymentStatus,
        institutionApprovableMethods,
        adminOnlyMethods,
        institutionPaymentApprovalExemptions,
        fileUploadMaxSizeMB
      },
      create: {
        id: '1',
        allowInstitutionPaymentApproval,
        showInstitutionApprovalButtons,
        defaultPaymentStatus,
        institutionApprovableMethods,
        adminOnlyMethods,
        institutionPaymentApprovalExemptions,
        fileUploadMaxSizeMB
      }
    });

    // Clear the payment settings cache to ensure changes take effect immediately
    clearPaymentSettingsCache();

    return NextResponse.json({
      message: 'Payment approval settings updated successfully',
      settings: {
        allowInstitutionPaymentApproval: settings.allowInstitutionPaymentApproval,
        showInstitutionApprovalButtons: settings.showInstitutionApprovalButtons,
        defaultPaymentStatus: settings.defaultPaymentStatus,
        institutionApprovableMethods: settings.institutionApprovableMethods,
        adminOnlyMethods: settings.adminOnlyMethods,
        institutionPaymentApprovalExemptions: settings.institutionPaymentApprovalExemptions,
        fileUploadMaxSizeMB: settings.fileUploadMaxSizeMB
      },
      impact: {
        affectedPaymentsCount,
        affectedPayments: affectedPayments.slice(0, 10) // Return first 10 for preview
      }
    });
  } catch (error) {
    console.error('Error updating payment approval settings:', error);
    return NextResponse.json(
      { error: 'Failed to update payment approval settings' },
      { status: 500 }
    );
  }
} 