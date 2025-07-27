import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { generateEmailTemplate } from '@/app/lib/invoice-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get enrollment with all necessary details
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        id: params.id,
        course: {
          institutionId: session.user.institutionId,
        },
        paymentStatus: 'PENDING',
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            institution: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found or already paid' }, { status: 404 });
    }

    // Calculate days until due date
    const dueDate = new Date(enrollment.startDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Generate reminder email
    const reminderOptions = {
      primaryColor: '#FF0000',
      paymentInstructions: `This is a friendly reminder that payment of $${enrollment.paymentAmount} is due in ${daysUntilDue} days.`,
      termsAndConditions: 'Please ensure payment is completed before the course start date to maintain your enrollment.',
      footerText: 'We look forward to having you in our course!',
    };

    const emailHtml = generateEmailTemplate(enrollment, enrollment.course.institution, reminderOptions);

    // Send reminder email
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: enrollment.student.email,
      subject: `Payment Reminder: ${enrollment.course.title}`,
      html: emailHtml,
    });

    // Record reminder sent
    await prisma.paymentReminder.create({
      data: {
        enrollmentId: enrollment.id,
        sentAt: new Date(),
        sentBy: session.user.id,
        reminderType: 'PAYMENT_DUE',
        daysUntilDue,
      },
    });

    // // // console.log('Payment reminder sent successfully');
    return NextResponse.json({ 
      message: 'Payment reminder sent successfully',
      daysUntilDue,
    });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send payment reminder' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 