import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TemplateAnalyticsService } from '@/lib/template-analytics';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = params.id;

    // Get version history
    const versions = await prisma.questionTemplateVersion.findMany({
      where: { template_id: templateId },
      orderBy: { version_number: 'desc' },
      include: {
        createdByUser: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error fetching template versions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = params.id;
    const body = await request.json();
    const {
      name,
      description,
      templateConfig,
      category,
      difficulty,
      tags,
      changeLog,
    } = body;

    // Verify user owns the template
    const template = await prisma.questionTemplate.findFirst({
      where: {
        id: templateId,
        created_by: session.user.id,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      );
    }

    // Get next version number
    const latestVersion = await prisma.questionTemplateVersion.findFirst({
      where: { template_id: templateId },
      orderBy: { version_number: 'desc' },
    });

    const nextVersionNumber = (latestVersion?.version_number || 0) + 1;

    // Create new version
    const version = await TemplateAnalyticsService.createVersion({
      templateId,
      versionNumber: nextVersionNumber,
      name,
      description,
      templateConfig,
      category,
      difficulty,
      tags,
      changeLog,
      createdBy: session.user.id,
    });

    return NextResponse.json({ version }, { status: 201 });
  } catch (error) {
    console.error('Error creating template version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 