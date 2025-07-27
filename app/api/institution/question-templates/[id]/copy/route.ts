import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { questionBankId, customizations = {} } = body;

    if (!questionBankId) {
      return NextResponse.json({ error: 'Question bank ID is required' }, { status: 400 });
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

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: questionBankId,
        created_by: session.user.id
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    // Create question from template
    const questionData = {
      ...template.template_data,
      ...customizations,
      question_bank_id: questionBankId,
      created_by: session.user.id
    };

    // Track template usage
    const { TemplateAnalyticsService } = await import('@/lib/template-analytics');
    
    // Determine customization level
    const customizationLevel = Object.keys(customizations).length === 0 ? 'none' : 
                              Object.keys(customizations).length <= 2 ? 'minor' : 'major';

    await TemplateAnalyticsService.trackUsage({
      templateId: template.id,
      usedBy: session.user.id,
      institutionId: user.institution.id,
      usageContext: 'question_bank',
      targetQuestionBankId: questionBankId,
      customizationLevel,
    });

    // Note: The 'question' model doesn't exist in the schema
    // This would need to be implemented based on the actual question model
    // For now, we'll return an error indicating this needs to be implemented
    return NextResponse.json({
      error: 'Question creation from template not yet implemented',
      template: template,
      questionBank: questionBank,
      usageTracked: true
    }, { status: 501 });

  } catch (error) {
    console.error('Error copying question template:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 