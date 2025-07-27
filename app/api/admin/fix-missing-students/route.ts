import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find all users with STUDENT role
    const studentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });
    // Find all student records
    const students = await prisma.student.findMany({ select: { id: true } });
    const studentIds = new Set(students.map(s => s.id));
    // Find users missing a student record
    const missing = studentUsers.filter(user => !studentIds.has(user.id));
    let fixedCount = 0;
    for (const user of missing) {
      await prisma.student.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: 'active',
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          last_active: new Date()
        }
      });
      fixedCount++;
    }
    return NextResponse.json({ success: true, fixedCount });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 