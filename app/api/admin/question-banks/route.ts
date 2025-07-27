import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const banks = await prisma.questionBank.findMany({
    orderBy: { created_at: 'desc' }
  });
  return NextResponse.json(
    banks.map(bank => ({
      ...bank,
      questions_count: 0 // Since there's no questions relation, default to 0
    }))
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
  const bank = await prisma.questionBank.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags,
      is_public: !!data.is_public,
      created_by: session.user.id
    }
  });
  return NextResponse.json(bank);
} 