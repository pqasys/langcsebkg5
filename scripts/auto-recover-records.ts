import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function autoRecoverRecords() {
  console.log('=== AUTOMATIC RECOVERY OF DELETED RECORDS ===\n');

  try {
    // 1. Find orphaned payments that can be linked back to bookings
    console.log('1. Attempting to recover orphaned payments...');
    const orphanedPayments = await prisma.payment.findMany({
      where: {
        bookingId: {
          not: null
        },
        booking: null
      },
      include: {
        student: true
      }
    });

    let recoveredPayments = 0;
    for (const payment of orphanedPayments) {
      try {
        // Check if the booking still exists
        const booking = await prisma.booking.findUnique({
          where: { id: payment.bookingId! }
        });

        if (booking) {
          // Link the payment back to the booking
          await prisma.payment.update({
            where: { id: payment.id },
            data: { bookingId: payment.bookingId }
          });
          recoveredPayments++;
          console.log(`✓ Recovered payment ${payment.id} for booking ${payment.bookingId}`);
        } else {
          console.log(`✗ Booking ${payment.bookingId} not found for payment ${payment.id}`);
        }
      } catch (error) {
        console.log(`✗ Failed to recover payment ${payment.id}: ${error}`);
      }
    }

    console.log(`Recovered ${recoveredPayments} out of ${orphanedPayments.length} orphaned payments\n`);

    // 2. Find orphaned enrollments that can be linked back to bookings
    console.log('2. Attempting to recover orphaned enrollments...');
    const orphanedEnrollments = await prisma.enrollment.findMany({
      where: {
        bookingId: {
          not: null
        },
        booking: null
      },
      include: {
        student: true,
        course: true
      }
    });

    let recoveredEnrollments = 0;
    for (const enrollment of orphanedEnrollments) {
      try {
        // Check if the booking still exists
        const booking = await prisma.booking.findUnique({
          where: { id: enrollment.bookingId! }
        });

        if (booking) {
          // Link the enrollment back to the booking
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { bookingId: enrollment.bookingId }
          });
          recoveredEnrollments++;
          console.log(`✓ Recovered enrollment ${enrollment.id} for booking ${enrollment.bookingId}`);
        } else {
          console.log(`✗ Booking ${enrollment.bookingId} not found for enrollment ${enrollment.id}`);
        }
      } catch (error) {
        console.log(`✗ Failed to recover enrollment ${enrollment.id}: ${error}`);
      }
    }

    console.log(`Recovered ${recoveredEnrollments} out of ${orphanedEnrollments.length} orphaned enrollments\n`);

    // 3. Verify recovery results
    console.log('3. Verifying recovery results...');
    
    const remainingOrphanedPayments = await prisma.payment.count({
      where: {
        bookingId: {
          not: null
        },
        booking: null
      }
    });

    const remainingOrphanedEnrollments = await prisma.enrollment.count({
      where: {
        bookingId: {
          not: null
        },
        booking: null
      }
    });

    const bookingsWithoutPayment = await prisma.booking.count({
      where: { payment: null }
    });

    const bookingsWithoutEnrollment = await prisma.booking.count({
      where: { enrollment: null }
    });

    console.log('=== RECOVERY SUMMARY ===');
    console.log(`Payments recovered: ${recoveredPayments}`);
    console.log(`Enrollments recovered: ${recoveredEnrollments}`);
    console.log(`Remaining orphaned payments: ${remainingOrphanedPayments}`);
    console.log(`Remaining orphaned enrollments: ${remainingOrphanedEnrollments}`);
    console.log(`Bookings still missing payments: ${bookingsWithoutPayment}`);
    console.log(`Bookings still missing enrollments: ${bookingsWithoutEnrollment}`);

    if (remainingOrphanedPayments > 0 || remainingOrphanedEnrollments > 0) {
      console.log('\n⚠️  Some records could not be automatically recovered.');
      console.log('Please run the manual recovery analysis script for detailed information.');
    }

    if (bookingsWithoutPayment > 0 || bookingsWithoutEnrollment > 0) {
      console.log('\n⚠️  Some bookings are still missing payment or enrollment records.');
      console.log('These may require manual intervention to restore.');
    }

    console.log('\n=== RECOVERY COMPLETED ===');

  } catch (error) {
    logger.error('Error during automatic recovery:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the automatic recovery script
autoRecoverRecords()
  .then(() => {
    console.log('Automatic recovery completed.');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Automatic recovery failed:');
    process.exit(1);
  }); 