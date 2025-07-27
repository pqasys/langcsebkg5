import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emailService } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get email settings to use the sender's email
    const emailSettings = await prisma.emailSettings.findFirst();
    if (!emailSettings) {
      return NextResponse.json(
        { message: 'Email settings not configured' },
        { status: 400 }
      );
    }

    // Send test email to the sender's email address
    await emailService.sendEmail({
      to: emailSettings.fromEmail,
      subject: 'Test Email from Your Platform',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify your email settings are working correctly.</p>
        <p>If you received this email, your SMTP configuration is working properly!</p>
      `,
    });

    return NextResponse.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:');
    return NextResponse.json(
      { message: 'Failed to send test email' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 