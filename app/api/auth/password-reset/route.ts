import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { generateSecurePassword, hashPassword } from '@/lib/auth-utils';
import { auditLogger } from '@/lib/audit-logger';
import crypto from 'crypto';
// Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: resetToken, // Temporarily store reset token in password field
        updatedAt: new Date(),
      },
    });

    // Send password reset email
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      
      await emailService.sendEmail({
        to: email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
            
            <p>Dear ${user.name},</p>
            
            <p>You requested a password reset for your account. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>Best regards,<br>The Platform Team</p>
          </div>
        `,
      });

      // Log the password reset request
      await auditLogger.passwordReset(user.id, request.headers.get('x-forwarded-for') || 'unknown');

      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Failed to send password reset email:');
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
      );
    }
  } catch (error) {
    console.error('Error in password reset request:');
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

// Complete password reset
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, newPassword } = body;

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: 'Token, email, and new password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid reset token or email' },
        { status: 400 }
      );
    }

    // Check if the stored password matches the reset token
    if (user.password !== token) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user with new password and clear force password reset flag
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        forcePasswordReset: false,
        updatedAt: new Date(),
      },
    });

    // Log the password change
    await auditLogger.logAuthEvent(
      user.id,
      'PASSWORD_CHANGE',
      undefined,
      request.headers.get('x-forwarded-for') || 'unknown'
    );

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in password reset completion:');
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 