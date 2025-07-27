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

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    const questionBankId = params.id;

    // Get question bank with questions
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: questionBankId,
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

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found' }, { status: 404 });
    }

    // Create a copy of the question bank
    const copiedBank = await prisma.questionBank.create({
      data: {
        name: `${questionBank.name} (Copy)`,
        description: questionBank.description,
        category: questionBank.category,
        tags: questionBank.tags,
        is_public: false, // Always make copies private
        created_by: session.user.id
      }
    });

    // Copy all questions
    const copiedQuestions = [];
    for (const question of questionBank.questions) {
      const copiedQuestion = await prisma.question.create({
        data: {
          question_text: question.question_text,
          question_type: question.question_type,
          options: question.options,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          category: question.category,
          tags: question.tags,
          points: question.points,
          question_bank_id: copiedBank.id,
          created_by: session.user.id
        }
      });
      copiedQuestions.push(copiedQuestion);
    }

    // // // console.log('Question bank copied successfully');
    return NextResponse.json({
      message: 'Question bank copied successfully',
      questionBank: copiedBank,
      copiedQuestions: copiedQuestions.length
    });
  } catch (error) {
    console.error('Error copying question bank:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 