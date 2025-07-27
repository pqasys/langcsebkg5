import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { bankIds } = body;

    if (!bankIds || !Array.isArray(bankIds) || bankIds.length === 0) {
      return NextResponse.json({ error: 'No question banks specified for export' }, { status: 400 });
    }

    // Get question banks with questions
    const questionBanks = await prisma.questionBank.findMany({
      where: {
        id: { in: bankIds },
        OR: [
          { created_by: session.user.id },
          { is_public: true },
          {
            created_by: {
              in: await prisma.user.findMany({
                where: { institution_id: user.institution.id },
                select: { id: true }
              }).then(users => users.map(u => u.id))
            }
          }
        ]
      },
      include: {
        questions: {
          orderBy: { created_at: 'asc' }
        }
      }
    });

    if (questionBanks.length === 0) {
      return NextResponse.json({ error: 'No accessible question banks found' }, { status: 404 });
    }

    // Prepare export data
    const exportData = {
      export_date: new Date().toISOString(),
      total_banks: questionBanks.length,
      total_questions: questionBanks.reduce((sum, bank) => sum + bank.questions.length, 0),
      question_banks: questionBanks.map(bank => ({
        name: bank.name,
        description: bank.description,
        category: bank.category,
        tags: bank.tags,
        is_public: bank.is_public,
        created_at: bank.created_at,
        updated_at: bank.updated_at,
        questions: bank.questions.map(question => ({
          question_text: question.question_text,
          question_type: question.question_type,
          options: question.options,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          category: question.category,
          tags: question.tags,
          points: question.points
        }))
      }))
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create response with proper headers for file download
    const response = new NextResponse(jsonString);
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Content-Disposition', `attachment; filename="question-banks-bulk-export-${new Date().toISOString().split('T')[0]}.json"`);
    
    return response;
  } catch (error) {
    console.error('Error bulk exporting question banks:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 