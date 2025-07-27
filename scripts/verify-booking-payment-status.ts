import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function verifyBookingPaymentStatus() {
  const bookingId = 'caf7b915-0d33-4f42-bf3e-d65a62207123';
  
  console.log(` Verifying status for booking: ${bookingId}`);
  console.log('=' .repeat(60));

  try {
    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      console.log('❌ Booking not found');
      return;
    }

    console.log(` BOOKING DETAILS:`);
    console.log(`   ID: ${booking.id}`);
    console.log(`   Status: ${booking.status}`);
    console.log(`   Course ID: ${booking.courseId}`);
    console.log(`   Student ID: ${booking.studentId}`);
    console.log(`   Amount: ${booking.amount}`);
    console.log(`   Created: ${booking.createdAt}`);
    console.log(`   Updated: ${booking.updatedAt}`);

    // Find the enrollment
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        courseId: booking.courseId,
        studentId: booking.studentId
      }
    });

    if (!enrollment) {
      console.log('\n❌ No enrollment found for this booking');
      return;
    }

    console.log(`\n ENROLLMENT DETAILS:`);
    console.log(`   ID: ${enrollment.id}`);
    console.log(`   Status: ${enrollment.status}`);
    console.log(`   Payment Status: ${enrollment.paymentStatus}`);
    console.log(`   Payment Date: ${enrollment.paymentDate}`);
    console.log(`   Created: ${enrollment.createdAt}`);
    console.log(`   Updated: ${enrollment.updatedAt}`);

    // Find all payments for this enrollment
    const payments = await prisma.payment.findMany({
      where: { enrollmentId: enrollment.id },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n PAYMENT DETAILS:`);
    if (payments.length === 0) {
      console.log('   ❌ No payments found for this enrollment');
    } else {
      payments.forEach((payment, index) => {
        console.log(`   Payment ${index + 1}:`);
        console.log(`     ID: ${payment.id}`);
        console.log(`     Status: ${payment.status}`);
        console.log(`     Amount: ${payment.amount}`);
        console.log(`     Paid At: ${payment.paidAt}`);
        console.log(`     Created: ${payment.createdAt}`);
        console.log(`     Updated: ${payment.updatedAt}`);
        if (payment.metadata) {
          console.log(`     Metadata: ${JSON.stringify(payment.metadata, null, 2)}`);
        }
      });
    }

    // Check for consistency
    console.log(`\n CONSISTENCY CHECK:`);
    const latestPayment = payments[0];
    
    if (latestPayment) {
      const isBookingConsistent = (
        (latestPayment.status === 'COMPLETED' && booking.status === 'COMPLETED') ||
        (latestPayment.status === 'PAID' && booking.status === 'COMPLETED') ||
        (latestPayment.status === 'FAILED' && booking.status === 'FAILED') ||
        (latestPayment.status === 'PENDING' && ['PENDING', 'PAYMENT_INITIATED'].includes(booking.status))
      );

      const isEnrollmentConsistent = (
        (latestPayment.status === 'COMPLETED' && enrollment.paymentStatus === 'PAID') ||
        (latestPayment.status === 'PAID' && enrollment.paymentStatus === 'PAID') ||
        (latestPayment.status === 'FAILED' && enrollment.paymentStatus === 'FAILED') ||
        (latestPayment.status === 'PENDING' && enrollment.paymentStatus === 'PENDING')
      );

      console.log(`   Booking Status: ${booking.status} | Payment Status: ${latestPayment.status} | Consistent: ${isBookingConsistent ? '' : ''}`);
      console.log(`   Enrollment PaymentStatus: ${enrollment.paymentStatus} | Payment Status: ${latestPayment.status} | Consistent: ${isEnrollmentConsistent ? '' : ''}`);
      
      if (!isBookingConsistent || !isEnrollmentConsistent) {
        console.log(`\n⚠️  INCONSISTENCIES DETECTED!`);
        console.log(`   Run the audit script to fix these issues.`);
      } else {
        console.log(`\n ALL STATUSES ARE CONSISTENT!`);
      }
    } else {
      console.log(`   No payment found - booking and enrollment should be in PENDING state`);
      const isConsistent = booking.status === 'PENDING' && enrollment.paymentStatus === 'PENDING';
      console.log(`   Consistent: ${isConsistent ? '' : ''}`);
    }

  } catch (error) {
    logger.error('❌ Error verifying status:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification
verifyBookingPaymentStatus()
  .then(() => {
    console.log('\n✅ Verification completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Verification failed:');
    process.exit(1);
  }); 