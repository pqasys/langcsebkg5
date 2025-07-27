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

    // Get question template
    const template = await prisma.questionTemplate.findFirst({
      where: {
        id: params.id,
        OR: [
          { created_by: session.user.id },
          { is_public: true }
        ]
      }
    });

    if (!template) {
      return NextResponse.json({ error: 'Question template not found' }, { status: 404 });
    }

    return NextResponse.json(template);

  } catch (error) {
    console.error('Error fetching question template:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, template_data, is_public } = body;

    // Verify user owns the template
    const template = await prisma.questionTemplate.findFirst({
      where: {
        id: params.id,
        created_by: session.user.id
      }
    });

    if (!template) {
      return NextResponse.json({ error: 'Question template not found or access denied' }, { status: 404 });
    }

    // Update template
    const updatedTemplate = await prisma.questionTemplate.update({
      where: { id: params.id },
      data: {
        name,
        description,
        template_data,
        is_public
      }
    });

    return NextResponse.json(updatedTemplate);

  } catch (error) {
    console.error('Error updating question template:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the template
    const template = await prisma.questionTemplate.findFirst({
      where: {
        id: params.id,
        created_by: session.user.id
      }
    });

    if (!template) {
      return NextResponse.json({ error: 'Question template not found or access denied' }, { status: 404 });
    }

    // Delete template
    await prisma.questionTemplate.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Question template deleted successfully' });

  } catch (error) {
    console.error('Error deleting question template:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 