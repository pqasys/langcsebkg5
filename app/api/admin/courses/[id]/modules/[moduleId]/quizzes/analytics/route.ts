import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string; moduleId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const quizzes = await prisma.quizzes.findMany({
    where: { module_id: params.moduleId },
    select: {
      id: true,
      title: true,
      total_attempts: true,
      average_score: true,
      average_time: true,
      success_rate: true
    }
  });
  return NextResponse.json(quizzes);
} 