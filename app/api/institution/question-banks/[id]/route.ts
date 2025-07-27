import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: params.id,
        OR: [
          { created_by: session.user.id },
          { is_public: true }
        ]
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found' }, { status: 404 });
    }

    const transformedBank = {
      ...questionBank,
      question_count: 0 // Since there's no questions relation, default to 0
    };

    return NextResponse.json(transformedBank);
  } catch (error) {
    console.error('Error fetching question bank:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: params.id,
        created_by: session.user.id
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, category, tags, is_public } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedBank = await prisma.questionBank.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        tags: tags || [],
        is_public: is_public || false,
        updated_at: new Date()
      }
    });

    const transformedBank = {
      ...updatedBank,
      question_count: 0 // Since there's no questions relation, default to 0
    };

    return NextResponse.json(transformedBank);
  } catch (error) {
    console.error('Error updating question bank:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: params.id,
        created_by: session.user.id
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    await prisma.questionBank.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Question bank deleted successfully' });
  } catch (error) {
    console.error('Error deleting question bank:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 