import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { institution: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const results = {
      auditFix: null as any,
      cleanup: null as any,
      combinedLogs: [] as string[],
      success: false,
      message: ''
    };

    try {
      // Step 1: Run audit/fix script
      // // // // // // // // // console.log('Starting audit/fix maintenance...');
      results.combinedLogs.push('=== AUDIT/FIX MAINTENANCE ===');
      
      // Audit booking-payment inconsistencies
      const inconsistentBookings = await prisma.booking.findMany({
        where: {
          OR: [
            {
              status: 'PENDING',
              payment: { status: 'COMPLETED' }
            },
            {
              status: 'COMPLETED',
              payment: { status: 'PENDING' }
            },
            {
              status: 'CANCELLED',
              payment: { status: 'COMPLETED' }
            }
          ]
        },
        include: {
          payment: true,
          student: true,
          course: true
        }
      });

      results.combinedLogs.push(`Found ${inconsistentBookings.length} inconsistent booking-payment records`);

      // Fix inconsistencies
      let fixedCount = 0;
      for (const booking of inconsistentBookings) {
        if (booking.payment?.status === 'COMPLETED' && booking.status !== 'COMPLETED') {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'COMPLETED' }
          });
          fixedCount++;
          results.combinedLogs.push(`Fixed booking ${booking.id}: PENDING → COMPLETED`);
        } else if (booking.payment?.status === 'PENDING' && booking.status === 'COMPLETED') {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'PENDING' }
          });
          fixedCount++;
          results.combinedLogs.push(`Fixed booking ${booking.id}: COMPLETED → PENDING`);
        }
      }

      results.combinedLogs.push(`Fixed ${fixedCount} booking-payment inconsistencies`);

      // Audit enrollment paymentStatus inconsistencies
      const inconsistentEnrollments = await prisma.enrollment.findMany({
        where: {
          OR: [
            {
              paymentStatus: 'PENDING',
              booking: { payment: { status: 'COMPLETED' } }
            },
            {
              paymentStatus: 'COMPLETED',
              booking: { payment: { status: 'PENDING' } }
            }
          ]
        },
        include: {
          booking: {
            include: {
              payment: true
            }
          },
          student: true,
          course: true
        }
      });

      results.combinedLogs.push(`Found ${inconsistentEnrollments.length} inconsistent enrollment paymentStatus records`);

      // Fix enrollment inconsistencies
      let enrollmentFixedCount = 0;
      for (const enrollment of inconsistentEnrollments) {
        if (enrollment.booking?.payment?.status === 'COMPLETED' && enrollment.paymentStatus !== 'COMPLETED') {
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { paymentStatus: 'COMPLETED' }
          });
          enrollmentFixedCount++;
          results.combinedLogs.push(`Fixed enrollment ${enrollment.id}: PENDING → COMPLETED`);
        } else if (enrollment.booking?.payment?.status === 'PENDING' && enrollment.paymentStatus === 'COMPLETED') {
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { paymentStatus: 'PENDING' }
          });
          enrollmentFixedCount++;
          results.combinedLogs.push(`Fixed enrollment ${enrollment.id}: COMPLETED → PENDING`);
        }
      }

      results.combinedLogs.push(`Fixed ${enrollmentFixedCount} enrollment paymentStatus inconsistencies`);

      results.auditFix = {
        inconsistentBookings: inconsistentBookings.length,
        fixedBookings: fixedCount,
        inconsistentEnrollments: inconsistentEnrollments.length,
        fixedEnrollments: enrollmentFixedCount
      };

      // Step 2: Run cleanup script
      console.log('Starting cleanup maintenance...');
      results.combinedLogs.push('\n=== CLEANUP MAINTENANCE ===');
      
      // Find truly orphaned enrollments (no booking at all)
      const orphanedEnrollments = await prisma.enrollment.findMany({
        where: {
          booking: null  // Only delete enrollments with no booking at all
        },
        include: {
          booking: {
            include: {
              payment: true
            }
          },
          student: true,
          course: true
        }
      });

      results.combinedLogs.push(`Found ${orphanedEnrollments.length} truly orphaned enrollment records (no booking)`);

      // Delete orphaned enrollments
      let deletedCount = 0;
      for (const enrollment of orphanedEnrollments) {
        try {
          await prisma.enrollment.delete({
            where: { id: enrollment.id }
          });
          deletedCount++;
          results.combinedLogs.push(`Deleted orphaned enrollment ${enrollment.id} (Student: ${enrollment.student?.name || 'Unknown'}, Course: ${enrollment.course?.title || 'Unknown'})`);
        } catch (error) {
    console.error('Error occurred:', error);
          results.combinedLogs.push(`Failed to delete enrollment ${enrollment.id}: ${error}`);
        }
      }

      results.combinedLogs.push(`Deleted ${deletedCount} orphaned enrollments`);

      results.cleanup = {
        orphanedEnrollments: orphanedEnrollments.length,
        deletedEnrollments: deletedCount
      };

      results.success = true;
      results.message = `Maintenance completed successfully. Fixed ${fixedCount + enrollmentFixedCount} inconsistencies and deleted ${deletedCount} orphaned records.`;

      console.log('All maintenance scripts completed successfully');
      results.combinedLogs.push('\n=== MAINTENANCE COMPLETED SUCCESSFULLY ===');

    } catch (error) {
      console.error('Error during maintenance:');
      results.combinedLogs.push(`\n=== ERROR ===\n${error}`);
      results.message = `Maintenance failed: ${error}`;
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Error in run-all-maintenance-scripts:');
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 