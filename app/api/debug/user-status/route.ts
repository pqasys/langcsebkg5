import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription status
    const subscriptionStatus = await SubscriptionCommissionService.getUserSubscriptionStatus(session.user.id);
    
    // Get user's enrollments
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        studentId: session.user.id
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            marketingType: true
          }
        }
      }
    });

    // Get payments
    const payments = await prisma.payment.findMany({
      where: {
        enrollmentId: {
          in: enrollments.map(e => e.id)
        }
      }
    });

    // Get video session participants
    const videoParticipants = await prisma.videoSessionParticipant.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            courseId: true
          }
        }
      }
    });

    return NextResponse.json({
      user: {
        id: session.user.id,
        role: session.user.role
      },
      subscriptionStatus,
      enrollments: enrollments.map(e => ({
        id: e.id,
        courseId: e.courseId,
        courseTitle: e.course.title,
        courseType: e.course.marketingType,
        status: e.status,
        paymentStatus: e.paymentStatus,
        createdAt: e.createdAt
      })),
      payments: payments.map(p => ({
        id: p.id,
        enrollmentId: p.enrollmentId,
        status: p.status,
        amount: p.amount,
        createdAt: p.createdAt
      })),
      videoParticipants: videoParticipants.map(vp => ({
        id: vp.id,
        sessionId: vp.sessionId,
        sessionTitle: vp.session.title,
        courseId: vp.session.courseId,
        status: vp.status,
        enrolledAt: vp.enrolledAt
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
