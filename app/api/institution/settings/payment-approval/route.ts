import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
import { canInstitutionApprovePayment, shouldShowInstitutionApprovalButtons } from '@/lib/constants/payment-config';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is an institution user
    const institutionUser = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        role: 'INSTITUTION'
      },
      include: {
        institution: true
      }
    });

    if (!institutionUser || !institutionUser.institutionId) {
      return NextResponse.json(
        { message: 'Not an institution user' },
        { status: 403 }
      );
    }

    // Get admin settings
    const adminSettings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    if (!adminSettings) {
      return NextResponse.json(
        { message: 'Payment settings not configured' },
        { status: 404 }
      );
    }

    // Check if this institution can approve payments
    const canApprove = await canInstitutionApprovePayment(
      undefined, // No specific payment method
      institutionUser.institutionId
    );

    // Check if approval buttons should be shown
    const showButtons = await shouldShowInstitutionApprovalButtons();

    return NextResponse.json({
      settings: {
        allowInstitutionPaymentApproval: adminSettings.allowInstitutionPaymentApproval,
        showInstitutionApprovalButtons: adminSettings.showInstitutionApprovalButtons,
        institutionApprovableMethods: adminSettings.institutionApprovableMethods,
        institutionPaymentApprovalExemptions: adminSettings.institutionPaymentApprovalExemptions,
        // Institution-specific settings
        canApprovePayments: canApprove,
        showApprovalButtons: showButtons && canApprove,
        isExempted: adminSettings.institutionPaymentApprovalExemptions.includes(institutionUser.institutionId)
      },
      institution: {
        id: institutionUser.institution.id,
        name: institutionUser.institution.name,
        email: institutionUser.institution.email
      }
    });
  } catch (error) {
    console.error('Error fetching institution payment settings:');
    return NextResponse.json(
      { message: 'Failed to fetch settings' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 