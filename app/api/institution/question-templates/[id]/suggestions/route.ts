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

    const templateId = params.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // Build where clause
    const where: any = { template_id: templateId };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // Get suggestions
    const suggestions = await prisma.questionTemplateSuggestion.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { confidence_score: 'desc' },
        { created_at: 'desc' },
      ],
      include: {
        reviewedByUser: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching template suggestions:', error);
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
    const { action, suggestionId, review } = body;

    switch (action) {
      case 'review_suggestion':
        if (!suggestionId || !review) {
          return NextResponse.json(
            { error: 'Suggestion ID and review are required' },
            { status: 400 }
          );
        }

        const updatedSuggestion = await prisma.questionTemplateSuggestion.update({
          where: { id: suggestionId },
          data: {
            status: review.status,
            reviewed_by: session.user.id,
            reviewed_at: new Date(),
          },
        });

        return NextResponse.json({ suggestion: updatedSuggestion });

      case 'implement_suggestion':
        if (!suggestionId) {
          return NextResponse.json(
            { error: 'Suggestion ID is required' },
            { status: 400 }
          );
        }

        // Get the suggestion
        const suggestion = await prisma.questionTemplateSuggestion.findUnique({
          where: { id: suggestionId },
        });

        if (!suggestion) {
          return NextResponse.json(
            { error: 'Suggestion not found' },
            { status: 404 }
          );
        }

        // Update template based on suggestion
        const template = await prisma.questionTemplate.findUnique({
          where: { id: templateId },
        });

        if (!template) {
          return NextResponse.json(
            { error: 'Template not found' },
            { status: 404 }
          );
        }

        // Apply suggested changes
        const suggestedChanges = suggestion.suggested_changes as any;
        const updatedTemplate = await prisma.questionTemplate.update({
          where: { id: templateId },
          data: {
            ...suggestedChanges,
            version: template.version + 1,
          },
        });

        // Mark suggestion as implemented
        await prisma.questionTemplateSuggestion.update({
          where: { id: suggestionId },
          data: {
            status: 'IMPLEMENTED',
            reviewed_by: session.user.id,
            reviewed_at: new Date(),
          },
        });

        return NextResponse.json({ template: updatedTemplate });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in template suggestions action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 