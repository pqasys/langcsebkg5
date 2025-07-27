import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword, comparePasswords } from '@/lib/auth-utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({
        host: '',
        port: 587,
        secure: true,
        username: '',
        password: '',
        fromEmail: '',
        fromName: '',
        rejectUnauthorized: false,
      });
    }

    // Don't send the password in the response
    const { password, ...safeSettings } = settings;
    return NextResponse.json(safeSettings);
  } catch (error) {
    console.error('Error fetching email settings:');
    return NextResponse.json(
      { message: 'Failed to fetch email settings' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      host,
      port,
      secure,
      username,
      fromEmail,
      fromName,
      rejectUnauthorized,
      currentPassword,
      newPassword,
    } = body;

    // Validate required fields
    if (!host || !port || !username || !fromEmail || !fromName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current settings
    const currentSettings = await prisma.emailSettings.findFirst();
    
    // Prepare update data
    const updateData: unknown = {
      host,
      port,
      secure,
      username,
      fromEmail,
      fromName,
      rejectUnauthorized: rejectUnauthorized ?? false,
    };

    // Handle password changes
    if (currentPassword && newPassword) {
      // Password change requested
      if (!currentSettings) {
        return NextResponse.json(
          { message: 'No existing settings found' },
          { status: 400 }
        );
      }

      // Verify current password
      const isValidPassword = await comparePasswords(currentPassword, currentSettings.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash and use the new password
      updateData.password = await hashPassword(newPassword);
    } else if (!currentSettings) {
      // New settings creation - password is required
      return NextResponse.json(
        { message: 'Password is required for new settings' },
        { status: 400 }
      );
    }
    // If no password change, keep existing password

    // Update or create settings
    const settings = await prisma.emailSettings.upsert({
      where: { id: '1' }, // Use a constant ID for single settings record
      update: updateData,
      create: {
        id: '1',
        ...updateData,
        password: await hashPassword(newPassword), // For new settings, password is required
      },
    });

    // Don't send the password in the response
    const { password: _, ...safeSettings } = settings;
    return NextResponse.json(safeSettings);
  } catch (error) {
    console.error('Error saving email settings:');
    return NextResponse.json(
      { message: 'Failed to save email settings' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 