import { PrismaClient } from '@prisma/client';
import { BOOKING_STATES } from '../lib/enrollment/state-manager';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function fixSpecificBooking() {
  const bookingId = 'caf7b915-0d33-4f42-bf3e-d65a62207123';
  
  console.log(` Checking specific booking: ${bookingId}`);

  try {
    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      console.log('❌ Booking not found');
      return;
    }

    console.log(` Booking details:`);
    console.log(`   ID: ${booking.id}`);
    console.log(`   Status: ${booking.status}`);
    console.log(`   Course ID: ${booking.courseId}`);
    console.log(`   Student ID: ${booking.studentId}`);
    console.log(`   Amount: ${booking.amount}`);

    // Find the enrollment for this booking
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        courseId: booking.courseId,
        studentId: booking.studentId
      },
      include: {
        course: true,
        student: true,
        payments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!enrollment) {
      console.log('❌ No enrollment found for this booking');
      return;
    }

    console.log(` Enrollment details:`);
    console.log(`   ID: ${enrollment.id}`);
    console.log(`   Status: ${enrollment.status}`);
    console.log(`   Payment Status: ${enrollment.paymentStatus}`);
    console.log(`   Course: ${enrollment.course.title}`);

    // Find the latest payment
    const latestPayment = enrollment.payments[0];
    if (!latestPayment) {
      console.log('❌ No payment found for this enrollment');
      return;
    }

    console.log(` Payment details:`);
    console.log(`   ID: ${latestPayment.id}`);
    console.log(`   Status: ${latestPayment.status}`);
    console.log(`   Amount: ${latestPayment.amount}`);
    console.log(`   Paid At: ${latestPayment.paidAt}`);

    // Check the inconsistency
    if (booking.status === 'PENDING' && latestPayment.status === 'COMPLETED') {
      console.log(`\n INCONSISTENCY DETECTED:`);
      console.log(`   Booking status: ${booking.status}`);
      console.log(`   Payment status: ${latestPayment.status}`);
      
      console.log(`\n Fixing the inconsistency...`);
      
      // Update the booking status to COMPLETED
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BOOKING_STATES.COMPLETED,
          updatedAt: new Date(),
          version: { increment: 1 },
          stateVersion: { increment: 1 }
        }
      });

      console.log(` Booking updated successfully:`);
      console.log(`   New status: ${updatedBooking.status}`);
      console.log(`   Updated at: ${updatedBooking.updatedAt}`);
      
    } else {
      console.log(`\n No inconsistency found. Current states are:`);
      console.log(`   Booking: ${booking.status}`);
      console.log(`   Payment: ${latestPayment.status}`);
    }

  } catch (error) {
    logger.error('❌ Error fixing booking:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixSpecificBooking()
  .then(() => {
    console.log('\n✅ Specific booking fix completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Script failed:');
    process.exit(1);
  }); 