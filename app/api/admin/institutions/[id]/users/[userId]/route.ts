import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// PUT - Update a user
export async function PUT(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admin can update users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['ADMIN', 'INSTRUCTOR', 'STUDENT'].includes(role.toUpperCase())) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if email already exists for other users
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: params.userId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: unknown = {
      name,
      email,
      role: role.toUpperCase(),
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:');
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

// DELETE - Delete a user
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admin can delete users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Prevent deleting the last admin
    const adminCount = await prisma.user.count({
      where: {
        institutionId: params.id,
        role: 'ADMIN',
      },
    });

    const userToDelete = await prisma.user.findUnique({
      where: {
        id: params.userId,
        institutionId: params.id,
      },
    });

    if (userToDelete?.role === 'ADMIN' && adminCount <= 1) {
      return NextResponse.json(
        { message: 'Cannot delete the last admin user' },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: params.userId,
        institutionId: params.id,
      },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:');
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 