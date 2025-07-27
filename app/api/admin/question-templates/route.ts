import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const templates = await prisma.questionTemplate.findMany({
    orderBy: { created_at: 'desc' }
  });
  return NextResponse.json(templates);
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
  const template = await prisma.questionTemplate.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      template_config: data.template_config,
      category: data.category,
      difficulty: data.difficulty,
      tags: data.tags,
      is_public: !!data.is_public,
      created_by: session.user.id
    }
  });
  return NextResponse.json(template);
} 