import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find all users with STUDENT role
  const studentUsers = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, name: true, email: true }
  });

  // Find all student records
  const students = await prisma.student.findMany({
    select: { id: true }
  });
  const studentIds = new Set(students.map(s => s.id));

  // Find users missing a student record
  const missingStudents = studentUsers.filter(user => !studentIds.has(user.id));

  return NextResponse.json({ missingStudents });
} 