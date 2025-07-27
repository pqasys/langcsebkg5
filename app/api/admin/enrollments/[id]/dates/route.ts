import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin users
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const { startDate, endDate, reason, notes, confirmed } = data;

    // Require confirmation
    if (!confirmed) {
      return NextResponse.json(
        { error: 'Confirmation required to modify enrollment dates' },
        { status: 400 }
      );
    }

    // Require reason
    if (!reason || reason.trim() === '') {
      return NextResponse.json(
        { error: 'Reason for modification is required' },
        { status: 400 }
      );
    }

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Date validation
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Prevent setting dates in the past
    if (start < today) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    if (end < today) {
      return NextResponse.json(
        { error: 'End date cannot be in the past' },
        { status: 400 }
      );
    }

    // Ensure end date is after start date
    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Get the enrollment with course details
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Store original dates for audit
    const originalStartDate = enrollment.startDate;
    const originalEndDate = enrollment.endDate;

    // Validate against course dates
    const courseStart = new Date(enrollment.course.startDate);
    const courseEnd = new Date(enrollment.course.endDate);

    if (start < courseStart) {
      return NextResponse.json(
        { error: 'Start date cannot be before course start date' },
        { status: 400 }
      );
    }

    if (end > courseEnd) {
      return NextResponse.json(
        { error: 'End date cannot be after course end date' },
        { status: 400 }
      );
    }

    // Update enrollment dates
    const updatedEnrollment = await prisma.studentCourseEnrollment.update({
      where: { id: params.id },
      data: {
        startDate: start,
        endDate: end,
        updatedAt: new Date(),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        action: 'ENROLLMENT_DATE_MODIFICATION',
        entityType: 'ENROLLMENT',
        entityId: params.id,
        userId: session.user.id,
        userEmail: session.user.email || 'unknown',
        details: {
          originalStartDate: originalStartDate.toISOString(),
          originalEndDate: originalEndDate.toISOString(),
          newStartDate: start.toISOString(),
          newEndDate: end.toISOString(),
          reason: reason,
          notes: notes || '',
          studentName: enrollment.student.name,
          studentEmail: enrollment.student.email,
          courseTitle: enrollment.course.title,
          institutionName: enrollment.course.institution.name,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Send notification to student (if notification service is available)
    try {
      // This would integrate with your notification service
      // // // console.log('Notification sent to student:', enrollment.student.email, 'about enrollment date change');
    } catch (error) {
    console.error('Error occurred:', error);
      // // // console.warn('Failed to send notification:', error);
    }

    return NextResponse.json({
      ...updatedEnrollment,
      auditLog: {
        reason,
        notes,
        modifiedBy: session.user.email,
        modifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating enrollment dates:', error);
    return NextResponse.json(
      { error: 'Failed to update enrollment dates' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 