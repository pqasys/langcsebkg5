import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    // Get question templates for the institution
    const templates = await prisma.questionTemplate.findMany({
      where: {
        OR: [
          { created_by: session.user.id },
          { is_public: true }
        ]
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(templates);

  } catch (error) {
    console.error('Error fetching question templates:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, question_type, template_data, is_public = false } = body;

    if (!name || !description || !question_type || !template_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    // Create question template
    const template = await prisma.questionTemplate.create({
      data: {
        name,
        description,
        question_type,
        template_data,
        is_public,
        created_by: session.user.id
      }
    });

    // // // console.log('Question template created successfully:');
    return NextResponse.json(template, { status: 201 });

  } catch (error) {
    console.error('Error creating question template:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 