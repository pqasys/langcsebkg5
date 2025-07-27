import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PaymentService from '@/lib/payment-service';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is an institution admin
    const institutionAdmin = await prisma.institutionAdmin.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!institutionAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the enrollment
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: {
          select: {
            institutionId: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Verify the course belongs to the admin's institution
    if (enrollment.course.institutionId !== institutionAdmin.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethod, referenceNumber, notes } = body;

    // Mark the payment as paid
    await PaymentService.markAsPaid(params.id, paymentMethod, {
      processedBy: session.user.id,
      referenceNumber,
      notes,
    });

    // Revalidate relevant pages
    revalidatePath('/institution/enrollments');
    revalidatePath(`/institution/students/${enrollment.studentId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking payment as paid:');
    return NextResponse.json(
      { error: 'Failed to mark payment as paid' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 