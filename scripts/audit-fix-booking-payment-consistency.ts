import { PrismaClient } from '@prisma/client';
import { BOOKING_STATES } from '../lib/enrollment/state-manager';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function auditAndFixBookingPaymentConsistency() {
  console.log('🔍 Starting audit/fix for booking-payment-enrollment consistency...');

  const bookings = await prisma.booking.findMany();
  let fixedCount = 0;
  let errorCount = 0;
  const log: string[] = [];

  for (const booking of bookings) {
    try {
      // Find the related enrollment
      const enrollment = await prisma.studentCourseEnrollment.findFirst({
        where: {
          courseId: booking.courseId,
          studentId: booking.studentId
        }
      });
      if (!enrollment) {
        log.push(`⚠️  No enrollment for booking ${booking.id}`);
        continue;
      }
      // Find the latest payment for this enrollment
      const payments = await prisma.payment.findMany({
        where: { enrollmentId: enrollment.id },
        orderBy: { createdAt: 'desc' },
        take: 1
      });
      const latestPayment = payments[0];
      if (!latestPayment) {
        // If booking is in a payment state but no payment exists, reset to PENDING
        if ([BOOKING_STATES.PAYMENT_INITIATED, BOOKING_STATES.COMPLETED, BOOKING_STATES.FAILED].includes(booking.status as any)) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: BOOKING_STATES.PENDING, updatedAt: new Date(), version: { increment: 1 }, stateVersion: { increment: 1 } }
          });
          await prisma.studentCourseEnrollment.update({
            where: { id: enrollment.id },
            data: { paymentStatus: 'PENDING' }
          });
          log.push(`🔧 Reset booking ${booking.id} and enrollment ${enrollment.id} to PENDING (no payment)`);
          fixedCount++;
        }
        continue;
      }
      // Determine the correct statuses
      let correctBookingStatus = booking.status;
      let correctEnrollmentPaymentStatus = enrollment.paymentStatus;
      if (['COMPLETED', 'PAID'].includes(latestPayment.status)) {
        correctBookingStatus = BOOKING_STATES.COMPLETED;
        correctEnrollmentPaymentStatus = 'PAID';
      } else if (latestPayment.status === 'FAILED') {
        correctBookingStatus = BOOKING_STATES.FAILED;
        correctEnrollmentPaymentStatus = 'FAILED';
      } else if (latestPayment.status === 'PENDING') {
        correctBookingStatus = BOOKING_STATES.PAYMENT_INITIATED;
        correctEnrollmentPaymentStatus = 'PENDING';
      }
      // Fix booking status if needed
      if (booking.status !== correctBookingStatus) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: correctBookingStatus, updatedAt: new Date(), version: { increment: 1 }, stateVersion: { increment: 1 } }
        });
        log.push(`🔧 Fixed booking ${booking.id} status: ${booking.status} -> ${correctBookingStatus}`);
        fixedCount++;
      }
      // Fix enrollment paymentStatus if needed
      if (enrollment.paymentStatus !== correctEnrollmentPaymentStatus) {
        await prisma.studentCourseEnrollment.update({
          where: { id: enrollment.id },
          data: { paymentStatus: correctEnrollmentPaymentStatus }
        });
        log.push(`🔧 Fixed enrollment ${enrollment.id} paymentStatus: ${enrollment.paymentStatus} -> ${correctEnrollmentPaymentStatus}`);
        fixedCount++;
      }
    } catch (error) {
      errorCount++;
      log.push(`❌ Error processing booking ${booking.id}: ${error}`);
    }
  }

  console.log(`\n� Audit/Fix Summary:`);
  console.log(`   Total bookings checked: ${bookings.length}`);
  console.log(`   Fixed inconsistencies: ${fixedCount}`);
  console.log(`   Errors encountered: ${errorCount}`);
  if (log.length > 0) {
    console.log('\n--- Log ---');
    for (const line of log) console.log(line);
  }

  await prisma.$disconnect();
}

auditAndFixBookingPaymentConsistency()
  .then(() => {
    console.log('✅ Audit/fix script completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Script failed:');
    process.exit(1);
  }); 