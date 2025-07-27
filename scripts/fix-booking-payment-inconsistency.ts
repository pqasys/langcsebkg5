import { PrismaClient } from '@prisma/client';
import { EnrollmentStateManager, BOOKING_STATES, PAYMENT_STATES } from '../lib/enrollment/state-manager';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function fixBookingPaymentInconsistency() {
  console.log('🔍 Starting booking-payment inconsistency check...');

  try {
    // Find all bookings with their related payments
    const bookings = await prisma.booking.findMany({
      include: {
        course: {
          include: {
            enrollments: {
              where: {
                studentId: {
                  equals: prisma.booking.fields.studentId
                }
              },
              include: {
                payments: {
                  orderBy: {
                    createdAt: 'desc'
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    });

    console.log(` Found ${bookings.length} bookings to check`);

    let fixedCount = 0;
    let errorCount = 0;

    for (const booking of bookings) {
      try {
        // Find the enrollment for this booking
        const enrollment = booking.course.enrollments[0];
        if (!enrollment) {
          console.log(`⚠️  No enrollment found for booking ${booking.id}`);
          continue;
        }

        const latestPayment = enrollment.payments[0];
        
        console.log(`\n Checking booking ${booking.id}:`);
        console.log(`   Booking status: ${booking.status}`);
        console.log(`   Payment status: ${latestPayment?.status || 'NO_PAYMENT'}`);
        console.log(`   Enrollment status: ${enrollment.status}`);

        // Check for inconsistencies
        let needsUpdate = false;
        let newBookingStatus = booking.status;

        if (latestPayment) {
          // Case 1: Payment is COMPLETED but booking is not COMPLETED
          if (latestPayment.status === 'COMPLETED' && booking.status !== BOOKING_STATES.COMPLETED) {
            console.log(`    Inconsistency: Payment COMPLETED but booking ${booking.status}`);
            newBookingStatus = BOOKING_STATES.COMPLETED;
            needsUpdate = true;
          }
          // Case 2: Payment is PAID but booking is not COMPLETED
          else if (latestPayment.status === 'PAID' && booking.status !== BOOKING_STATES.COMPLETED) {
            console.log(`    Inconsistency: Payment PAID but booking ${booking.status}`);
            newBookingStatus = BOOKING_STATES.COMPLETED;
            needsUpdate = true;
          }
          // Case 3: Payment is FAILED but booking is not FAILED
          else if (latestPayment.status === 'FAILED' && booking.status !== BOOKING_STATES.FAILED) {
            console.log(`    Inconsistency: Payment FAILED but booking ${booking.status}`);
            newBookingStatus = BOOKING_STATES.FAILED;
            needsUpdate = true;
          }
          // Case 4: Payment is PENDING but booking is not in payment state
          else if (latestPayment.status === 'PENDING' && 
                   ![BOOKING_STATES.PENDING, BOOKING_STATES.PAYMENT_INITIATED].includes(booking.status as any)) {
            console.log(`    Inconsistency: Payment PENDING but booking ${booking.status}`);
            newBookingStatus = BOOKING_STATES.PAYMENT_INITIATED;
            needsUpdate = true;
          }
        } else {
          // No payment found but booking is in payment state
          if ([BOOKING_STATES.PAYMENT_INITIATED, BOOKING_STATES.COMPLETED, BOOKING_STATES.FAILED].includes(booking.status as any)) {
            console.log(`    Inconsistency: No payment but booking ${booking.status}`);
            newBookingStatus = BOOKING_STATES.PENDING;
            needsUpdate = true;
          }
        }

        // Update booking if needed
        if (needsUpdate) {
          console.log(`    Fixing: Updating booking status from ${booking.status} to ${newBookingStatus}`);
          
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              status: newBookingStatus,
              updatedAt: new Date(),
              version: { increment: 1 },
              stateVersion: { increment: 1 }
            }
          });
          
          fixedCount++;
          console.log(`    Fixed booking ${booking.id}`);
        } else {
          console.log(`    Booking ${booking.id} is consistent`);
        }

      } catch (error) {
        logger.error('   ❌ Error processing booking ${booking.id}:');
        errorCount++;
      }
    }

    console.log(`\n� Summary:`);
    console.log(`   Total bookings checked: ${bookings.length}`);
    console.log(`   Fixed inconsistencies: ${fixedCount}`);
    console.log(`   Errors encountered: ${errorCount}`);

    // Also check for orphaned payments (payments without corresponding bookings)
    console.log(`\n Checking for orphaned payments...`);
    const orphanedPayments = await prisma.payment.findMany({
      where: {
        metadata: {
          path: ['bookingId'],
          not: null
        }
      },
      include: {
        enrollment: true
      }
    });

    let orphanedCount = 0;
    for (const payment of orphanedPayments) {
      const bookingId = (payment.metadata as any)?.bookingId;
      if (bookingId) {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId }
        });
        
        if (!booking) {
          console.log(`   ⚠️  Orphaned payment ${payment.id} references non-existent booking ${bookingId}`);
          orphanedCount++;
        }
      }
    }

    console.log(`   Orphaned payments found: ${orphanedCount}`);

  } catch (error) {
    logger.error('❌ Error during inconsistency check:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixBookingPaymentInconsistency()
  .then(() => {
    console.log('✅ Booking-payment inconsistency check completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Script failed:');
    process.exit(1);
  }); 