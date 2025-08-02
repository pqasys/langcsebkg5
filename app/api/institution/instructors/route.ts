import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { notificationService } from '@/lib/notification';

// GET - Fetch institution's instructors
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const instructors = await prisma.user.findMany({
      where: { 
        role: 'INSTRUCTOR',
        institutionId: session.user.institutionId
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ instructors });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { message: 'Error fetching instructors' },
      { status: 500 }
    );
  }
}

// POST - Create new instructor for institution
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email } = data;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + '!1';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const now = new Date();

    // Create instructor linked to the institution
    const instructor = await prisma.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role: 'INSTRUCTOR',
        institutionId: session.user.institutionId, // Link to current institution
        status: 'ACTIVE',
        forcePasswordReset: true, // Force password reset on first login
        createdAt: now,
        updatedAt: now
      }
    });

    // Send welcome email with temporary password
    try {
      await notificationService.sendNotificationWithTemplate(
        'instructor_welcome',
        instructor.id,
        {
          name: instructor.name,
          email: instructor.email,
          tempPassword: tempPassword,
          loginUrl: `${process.env.NEXTAUTH_URL}/auth/signin`,
          institutionName: session.user.institutionName || 'Your Institution'
        },
        {
          isNewInstructor: true,
          institutionId: session.user.institutionId,
          forcePasswordReset: true
        },
        'SYSTEM'
      );
      
      console.log('✅ Institution instructor welcome email sent successfully');
    } catch (notificationError) {
      console.error('❌ Failed to send institution instructor welcome email:', notificationError);
      // Don't fail the creation if email fails
    }

    return NextResponse.json({
      message: 'Instructor created successfully. Welcome email sent with temporary password.',
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: instructor.status
      }
    });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to create instructor' },
      { status: 500 }
    );
  }
} 