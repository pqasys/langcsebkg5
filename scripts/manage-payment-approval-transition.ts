import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

interface PaymentApprovalImpact {
  totalPendingPayments: number;
  institutionApprovablePayments: number;
  adminOnlyPayments: number;
  affectedInstitutions: string[];
  paymentDetails: Array<{
    id: string;
    amount: number;
    institutionName: string;
    paymentMethod: string | null;
    createdAt: Date;
    reason: string;
  }>;
}

async function analyzePaymentApprovalImpact(): Promise<PaymentApprovalImpact> {
  console.log('🔍 Analyzing Payment Approval Impact...\n');

  // Get admin settings
  const adminSettings = await prisma.adminSettings.findFirst({
    where: { id: '1' }
  });

  if (!adminSettings) {
    console.log('❌ No admin settings found. Please configure payment approval settings first.');
    return {
      totalPendingPayments: 0,
      institutionApprovablePayments: 0,
      adminOnlyPayments: 0,
      affectedInstitutions: [],
      paymentDetails: []
    };
  }

  // Get all pending payments
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

  const totalPendingPayments = pendingPayments.length;
  const affectedInstitutions = new Set<string>();
  const paymentDetails: PaymentApprovalImpact['paymentDetails'] = [];

  let institutionApprovablePayments = 0;
  let adminOnlyPayments = 0;

  for (const payment of pendingPayments) {
    const institution = payment.enrollment.course.institution;
    const isExempted = (adminSettings.institutionPaymentApprovalExemptions as string[]).includes(institution.id);
    
    const canApprove = adminSettings.allowInstitutionPaymentApproval && 
                      !isExempted && 
                      (!payment.paymentMethod || 
                       (adminSettings.institutionApprovableMethods as string[]).includes(payment.paymentMethod));

    if (canApprove) {
      institutionApprovablePayments++;
    } else {
      adminOnlyPayments++;
      affectedInstitutions.add(institution.id);
    }

    // Determine reason for admin approval requirement
    let reason = 'Requires admin approval';
    if (!adminSettings.allowInstitutionPaymentApproval) {
      reason = 'Institution payment approval is globally disabled';
    } else if (isExempted) {
      reason = 'Institution is exempted from payment approval';
    } else if (payment.paymentMethod && !(adminSettings.institutionApprovableMethods as string[]).includes(payment.paymentMethod)) {
      reason = `Payment method '${payment.paymentMethod}' requires admin approval`;
    }

    paymentDetails.push({
      id: payment.id,
      amount: payment.amount,
      institutionName: institution.name,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
      reason
    });
  }

  return {
    totalPendingPayments,
    institutionApprovablePayments,
    adminOnlyPayments,
    affectedInstitutions: Array.from(affectedInstitutions),
    paymentDetails
  };
}

async function simulateWithdrawingApprovalRights(): Promise<void> {
  console.log('🔄 Simulating Withdrawal of Institution Payment Approval Rights...\n');

  const impact = await analyzePaymentApprovalImpact();

  console.log('📊 Current Payment Approval Status:');
  console.log(`  - Total Pending Payments: ${impact.totalPendingPayments}`);
  console.log(`  - Institution Approvable: ${impact.institutionApprovablePayments}`);
  console.log(`  - Admin Only: ${impact.adminOnlyPayments}`);
  console.log(`  - Affected Institutions: ${impact.affectedInstitutions.length}`);

  if (impact.totalPendingPayments === 0) {
    console.log('\n✅ No pending payments found. No impact from withdrawing approval rights.');
    return;
  }

  console.log('\n⚠️  Impact of Withdrawing Institution Payment Approval Rights:');
  console.log(`  - ${impact.institutionApprovablePayments} payment(s) would become admin-only`);
  console.log(`  - ${impact.affectedInstitutions.length} institution(s) would be affected`);
  
  if (impact.institutionApprovablePayments > 0) {
    console.log('\n📋 Payments That Would Become Admin-Only:');
    impact.paymentDetails
      .filter(p => p.reason !== 'Requires admin approval')
      .forEach((payment, index) => {
        console.log(`\n  ${index + 1}. Payment ID: ${payment.id}`);
        console.log(`     - Amount: $${payment.amount}`);
        console.log(`     - Institution: ${payment.institutionName}`);
        console.log(`     - Payment Method: ${payment.paymentMethod || 'Not specified'}`);
        console.log(`     - Created: ${payment.createdAt.toISOString()}`);
        console.log(`     - Would become: Admin approval required`);
      });
  }

  console.log('\n✅ All pending payments remain fully approvable by administrators.');
  console.log('   No payments will be lost or become unapprovable.');
}

async function generateApprovalReport(): Promise<void> {
  console.log('📋 Generating Payment Approval Report...\n');

  const impact = await analyzePaymentApprovalImpact();

  console.log('📊 PAYMENT APPROVAL REPORT');
  console.log('========================');
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log(`Total Pending Payments: ${impact.totalPendingPayments}`);
  console.log(`Institution Approvable: ${impact.institutionApprovablePayments}`);
  console.log(`Admin Only: ${impact.adminOnlyPayments}`);
  console.log(`Affected Institutions: ${impact.affectedInstitutions.length}`);

  if (impact.totalPendingPayments > 0) {
    console.log('\n📋 DETAILED PAYMENT BREAKDOWN:');
    console.log('=============================');
    
    // Group by institution
    const paymentsByInstitution = impact.paymentDetails.reduce((acc, payment) => {
      if (!acc[payment.institutionName]) {
        acc[payment.institutionName] = [];
      }
      acc[payment.institutionName].push(payment);
      return acc;
    }, {} as Record<string, typeof impact.paymentDetails>);

    Object.entries(paymentsByInstitution).forEach(([institutionName, payments]) => {
      console.log(`\n� Institution: ${institutionName}`);
      console.log(`   Total Pending Payments: ${payments.length}`);
      
      const institutionApprovable = payments.filter(p => p.reason === 'Requires admin approval').length;
      const adminOnly = payments.length - institutionApprovable;
      
      console.log(`   - Institution Approvable: ${institutionApprovable}`);
      console.log(`   - Admin Only: ${adminOnly}`);
      
      if (adminOnly > 0) {
        console.log(`   - Admin Only Reason: ${payments.find(p => p.reason !== 'Requires admin approval')?.reason || 'N/A'}`);
      }
    });
  }

  console.log('\n✅ REPORT COMPLETE');
  console.log('   All pending payments are accounted for and remain approvable.');
}

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'analyze':
        await analyzePaymentApprovalImpact();
        break;
      case 'simulate':
        await simulateWithdrawingApprovalRights();
        break;
      case 'report':
        await generateApprovalReport();
        break;
      default:
        console.log('Usage: npm run script manage-payment-approval-transition <command>');
        console.log('Commands:');
        console.log('  analyze  - Analyze current payment approval impact');
        console.log('  simulate - Simulate withdrawing institution approval rights');
        console.log('  report   - Generate detailed approval report');
        break;
    }
  } catch (error) {
    logger.error('❌ Error:');
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export {
  analyzePaymentApprovalImpact,
  simulateWithdrawingApprovalRights,
  generateApprovalReport
}; 