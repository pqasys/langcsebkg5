import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const bank = await prisma.questionBank.findUnique({
    where: { id: params.id }
  });
  if (!bank) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json({
    bank: {
      name: bank.name,
      description: bank.description,
      category: bank.category,
      tags: bank.tags
    },
    questions: [] // Since there's no questions relation, return empty array
  });
} 