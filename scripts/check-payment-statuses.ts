import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkPaymentStatuses() {
  console.log('🔍 Checking Payment Statuses...\n');

  try {
    // Get all payments with their details
    const payments = await prisma.payment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('💰 All Payments:');
    if (payments.length === 0) {
      console.log('  ✅ No payments found');
    } else {
      // Group payments by status
      const paymentsByStatus = payments.reduce((acc, payment) => {
        const status = payment.status;
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(payment);
        return acc;
      }, {} as Record<string, typeof payments>);

      Object.entries(paymentsByStatus).forEach(([status, statusPayments]) => {
        console.log(`\n   Status: ${status} (${statusPayments.length} payments)`);
        statusPayments.forEach((payment, index) => {
          console.log(`    ${index + 1}. Payment ID: ${payment.id}`);
          console.log(`       - Amount: $${payment.amount}`);
          console.log(`       - Payment Method: ${payment.paymentMethod || 'Not specified'}`);
          console.log(`       - Institution ID: ${payment.institutionId}`);
          console.log(`       - Enrollment ID: ${payment.enrollmentId}`);
          console.log(`       - Created: ${payment.createdAt.toISOString()}`);
          console.log(`       - Updated: ${payment.updatedAt.toISOString()}`);
          
          if (payment.paidAt) {
            console.log(`       - Paid At: ${payment.paidAt.toISOString()}`);
          }
        });
      });
    }

    // Check for specific statuses that might need attention
    const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING');
    const processingPayments = payments.filter(p => p.status === 'PROCESSING');
    const completedPayments = payments.filter(p => p.status === 'COMPLETED');
    const failedPayments = payments.filter(p => p.status === 'FAILED');

    console.log('\n📈 Payment Status Summary:');
    console.log(`  - PENDING (including PROCESSING): ${pendingPayments.length}`);
    console.log(`  - PROCESSING: ${processingPayments.length}`);
    console.log(`  - COMPLETED: ${completedPayments.length}`);
    console.log(`  - FAILED: ${failedPayments.length}`);
    console.log(`  - Total: ${payments.length}`);

    // Check for payments that might need approval
    const paymentsNeedingApproval = payments.filter(p => 
      p.status === 'PENDING' || p.status === 'PROCESSING'
    );

    if (paymentsNeedingApproval.length > 0) {
      console.log('\n⚠️  Payments Needing Approval:');
      for (const payment of paymentsNeedingApproval) {
        console.log(`\n  Payment ID: ${payment.id}`);
        console.log(`    - Status: ${payment.status}`);
        console.log(`    - Amount: $${payment.amount}`);
        console.log(`    - Payment Method: ${payment.paymentMethod || 'Not specified'}`);
        
        // Get enrollment details
        const enrollment = await prisma.studentCourseEnrollment.findUnique({
          where: { id: payment.enrollmentId },
          include: {
            course: {
              include: {
                institution: true
              }
            }
          }
        });

        if (enrollment) {
          console.log(`    - Institution: ${enrollment.course.institution.name}`);
          console.log(`    - Course: ${enrollment.course.title}`);
          console.log(`    - Student ID: ${enrollment.studentId}`);
        } else {
          console.log(`    -  Enrollment not found for ID: ${payment.enrollmentId}`);
        }
      }
    }

  } catch (error) {
    logger.error('❌ Error checking payment statuses:');
  } finally {
    await prisma.$disconnect();
  }
}

checkPaymentStatuses(); 