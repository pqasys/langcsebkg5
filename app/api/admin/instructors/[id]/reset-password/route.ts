import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { notificationService } from '@/lib/notification';

// POST - Reset instructor password
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if instructor exists
    const existingInstructor = await prisma.user.findUnique({
      where: { id, role: 'INSTRUCTOR' },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!existingInstructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Generate a new random password
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + '!1';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update instructor password and force reset
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        forcePasswordReset: true,
        updatedAt: new Date()
      }
    });

    // Send password reset email
    try {
      await notificationService.sendNotificationWithTemplate(
        'password_reset',
        existingInstructor.id,
        {
          name: existingInstructor.name,
          email: existingInstructor.email,
          newPassword: newPassword,
          loginUrl: `${process.env.NEXTAUTH_URL}/auth/signin`,
          institutionName: existingInstructor.institution?.name || 'Platform-wide'
        },
        {
          isPasswordReset: true,
          institutionId: existingInstructor.institutionId,
          forcePasswordReset: true
        },
        'SYSTEM'
      );
      
      console.log('✅ Password reset email sent successfully');
    } catch (notificationError) {
      console.error('❌ Failed to send password reset email:', notificationError);
      return NextResponse.json(
        { error: 'Password updated but failed to send email notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password reset successfully. New password sent via email.',
      instructor: {
        id: existingInstructor.id,
        name: existingInstructor.name,
        email: existingInstructor.email
      }
    });
  } catch (error) {
    console.error('Error resetting instructor password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 