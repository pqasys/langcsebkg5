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
  return NextResponse.json({ ...bank, questions_count: 0 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
  const bank = await prisma.questionBank.update({
    where: { id: params.id },
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags,
      is_public: !!data.is_public
    }
  });
  return NextResponse.json(bank);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await prisma.questionBank.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
} 