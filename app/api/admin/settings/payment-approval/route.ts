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
    const affectedPendingPayments = await prisma.payment.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                institution: true
              }
            }
          }
        }
      }
    });

    // Calculate how many payments would be affected by current settings
    const affectedPaymentsCount = affectedPendingPayments.filter(payment => {
      const institution = payment.enrollment.course.institution;
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
    console.error('Error fetching payment approval settings:');
    return NextResponse.json(
      { message: 'Failed to fetch settings' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
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

    // Get current settings to detect changes
    const currentSettings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    // Check if institution approval is being disabled or restricted
    const isDisablingInstitutionApproval = currentSettings && 
      (currentSettings.allowInstitutionPaymentApproval && !allowInstitutionPaymentApproval);

    const isAddingExemptions = currentSettings && 
      institutionPaymentApprovalExemptions.length > currentSettings.institutionPaymentApprovalExemptions.length;

    const isRestrictingMethods = currentSettings && 
      institutionApprovableMethods.length < currentSettings.institutionApprovableMethods.length;

    // Get pending payments that would be affected by these changes
    let affectedPaymentsCount = 0;
    let affectedPayments = [];
    
    if (isDisablingInstitutionApproval || isAddingExemptions || isRestrictingMethods) {
      const pendingPayments = await prisma.payment.findMany({
        where: {
          status: { in: ['PENDING', 'PROCESSING'] }
        },
        include: {
          enrollment: {
            include: {
              course: {
                include: {
                  institution: true
                }
              }
            }
          }
        }
      });

      affectedPayments = pendingPayments.filter(payment => {
        const institution = payment.enrollment.course.institution;
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

    // Prepare response with impact information
    const response: unknown = {
      message: 'Payment approval settings updated successfully',
      settings: {
        allowInstitutionPaymentApproval: settings.allowInstitutionPaymentApproval,
        showInstitutionApprovalButtons: settings.showInstitutionApprovalButtons,
        defaultPaymentStatus: settings.defaultPaymentStatus,
        institutionApprovableMethods: settings.institutionApprovableMethods,
        adminOnlyMethods: settings.adminOnlyMethods,
        institutionPaymentApprovalExemptions: settings.institutionPaymentApprovalExemptions,
        fileUploadMaxSizeMB: settings.fileUploadMaxSizeMB
      }
    };

    // Add impact information if there are affected payments
    if (affectedPaymentsCount > 0) {
      response.impact = {
        affectedPaymentsCount,
        message: `⚠️ ${affectedPaymentsCount} pending payment(s) will now require admin approval. These payments remain fully approvable by administrators.`,
        affectedPaymentIds: affectedPayments.map(p => p.id)
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating payment approval settings:');
    return NextResponse.json(
      { message: 'Failed to update settings' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 