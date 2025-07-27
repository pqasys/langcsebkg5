import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function recoverDeletedRecords() {
  console.log('=== RECOVERY ANALYSIS FOR INCORRECTLY DELETED RECORDS ===\n');

  try {
    // 1. Get all bookings and check if they have corresponding enrollments
    console.log('1. Checking bookings and their enrollment status...');
    const allBookings = await prisma.booking.findMany();

    const bookingsWithoutEnrollment = [];
    for (const booking of allBookings) {
      // Check if there's an enrollment for this student and course
      const enrollment = await prisma.studentCourseEnrollment.findFirst({
        where: {
          studentId: booking.studentId,
          courseId: booking.courseId
        }
      });

      if (!enrollment) {
        bookingsWithoutEnrollment.push(booking);
      }
    }

    console.log(`Found ${bookingsWithoutEnrollment.length} bookings without enrollment records:`);
    for (const booking of bookingsWithoutEnrollment) {
      // Get student and course details separately
      const student = await prisma.student.findUnique({
        where: { id: booking.studentId }
      });
      const course = await prisma.course.findUnique({
        where: { id: booking.courseId }
      });

      console.log(`  - Booking ID: ${booking.id}`);
      console.log(`    Student: ${student?.name || 'Unknown'} (${booking.studentId})`);
      console.log(`    Course: ${course?.title || 'Unknown'} (${booking.courseId})`);
      console.log(`    Status: ${booking.status}`);
      console.log(`    Created: ${booking.createdAt}`);
      console.log('');
    }

    // 2. Check for enrollments without payments
    console.log('2. Checking for enrollments without payment records...');
    const allEnrollments = await prisma.studentCourseEnrollment.findMany();

    const enrollmentsWithoutPayment = [];
    for (const enrollment of allEnrollments) {
      // Check if there's a payment for this enrollment
      const payment = await prisma.payment.findFirst({
        where: {
          enrollmentId: enrollment.id
        }
      });

      if (!payment && enrollment.paymentStatus !== 'PENDING') {
        enrollmentsWithoutPayment.push(enrollment);
      }
    }

    console.log(`Found ${enrollmentsWithoutPayment.length} enrollments that may be missing payment records:`);
    for (const enrollment of enrollmentsWithoutPayment) {
      // Get student and course details separately
      const student = await prisma.student.findUnique({
        where: { id: enrollment.studentId }
      });
      const course = await prisma.course.findUnique({
        where: { id: enrollment.courseId }
      });

      console.log(`  - Enrollment ID: ${enrollment.id}`);
      console.log(`    Student: ${student?.name || 'Unknown'} (${enrollment.studentId})`);
      console.log(`    Course: ${course?.title || 'Unknown'} (${enrollment.courseId})`);
      console.log(`    Payment Status: ${enrollment.paymentStatus}`);
      console.log(`    Created: ${enrollment.createdAt}`);
      console.log('');
    }

    // 3. Check for orphaned payments (payments with enrollmentId but no enrollment)
    console.log('3. Checking for orphaned payments...');
    const allPayments = await prisma.payment.findMany();

    const orphanedPayments = [];
    for (const payment of allPayments) {
      // Check if the enrollment exists
      const enrollment = await prisma.studentCourseEnrollment.findUnique({
        where: {
          id: payment.enrollmentId
        }
      });

      if (!enrollment) {
        orphanedPayments.push(payment);
      }
    }

    console.log(`Found ${orphanedPayments.length} orphaned payments (have enrollmentId but no enrollment):`);
    for (const payment of orphanedPayments) {
      // Get institution details separately
      const institution = await prisma.institution.findUnique({
        where: { id: payment.institutionId }
      });

      console.log(`  - Payment ID: ${payment.id}`);
      console.log(`    Enrollment ID: ${payment.enrollmentId}`);
      console.log(`    Institution: ${institution?.name || 'Unknown'} (${payment.institutionId})`);
      console.log(`    Amount: ${payment.amount}`);
      console.log(`    Status: ${payment.status}`);
      console.log(`    Created: ${payment.createdAt}`);
      console.log('');
    }

    // 4. Summary and recovery recommendations
    console.log('=== RECOVERY SUMMARY ===');
    console.log('');
    console.log(`Bookings that may be missing enrollments: ${bookingsWithoutEnrollment.length}`);
    console.log(`Enrollments that may be missing payments: ${enrollmentsWithoutPayment.length}`);
    console.log(`Orphaned payments: ${orphanedPayments.length}`);
    console.log('');

    // 5. Generate recovery recommendations
    console.log('=== RECOVERY RECOMMENDATIONS ===');
    console.log('');
    
    if (bookingsWithoutEnrollment.length > 0) {
      console.log('RECOVERY NEEDED: Bookings without enrollment records');
      console.log('These bookings exist but may not have corresponding enrollment records.');
      console.log('You may need to check if enrollments were deleted and recreate them if necessary.');
      console.log('');
    }

    if (enrollmentsWithoutPayment.length > 0) {
      console.log('RECOVERY NEEDED: Enrollments without payment records');
      console.log('These enrollments have non-PENDING paymentStatus but no payment records.');
      console.log('You may need to check if payments were deleted and recreate them if necessary.');
      console.log('');
    }

    if (orphanedPayments.length > 0) {
      console.log('RECOVERY NEEDED: Orphaned payments');
      console.log('These payments have an enrollmentId but the enrollment was deleted.');
      console.log('You may need to recreate the enrollment records or delete these orphaned payments.');
      console.log('');
    }

    if (bookingsWithoutEnrollment.length === 0 && enrollmentsWithoutPayment.length === 0 && orphanedPayments.length === 0) {
      console.log('No obvious data inconsistencies found.');
      console.log('The deleted records may have been truly orphaned or the relationships are intact.');
    }

    console.log('=== END OF RECOVERY ANALYSIS ===');

  } catch (error) {
    logger.error('Error during recovery analysis:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the recovery script
recoverDeletedRecords()
  .then(() => {
    console.log('Recovery analysis completed.');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Recovery analysis failed:');
    process.exit(1);
  }); 