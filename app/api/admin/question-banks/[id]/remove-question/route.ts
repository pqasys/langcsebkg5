import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { questionId } = await request.json();
  if (!questionId) return NextResponse.json({ error: 'Missing questionId' }, { status: 400 });
  await prisma.questionBankItem.deleteMany({
    where: {
      bank_id: params.id,
      question_id: questionId
    }
  });
  return NextResponse.json({ success: true });
} 