import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { questions } = await request.json();
  if (!Array.isArray(questions)) {
    return NextResponse.json({ error: 'Invalid questions format' }, { status: 400 });
  }
  const importedQuestions = [];
  for (const q of questions) {
    const questionId = uuidv4();
    const question = await prisma.quiz_questions.create({
      data: {
        id: questionId,
        quiz_id: 'temp', // Will be updated when added to actual quiz
        question: q.question,
        type: q.type,
        options: q.options ? JSON.stringify(q.options) : null,
        correct_answer: q.correct_answer,
        points: q.points || 1,
        explanation: q.explanation,
        difficulty: q.difficulty || 'MEDIUM',
        category: q.category,
        hints: q.hints,
        question_config: q.question_config ? JSON.stringify(q.question_config) : null,
        media_url: q.media_url,
        media_type: q.media_type,
        order_index: 0
      }
    });
    await prisma.questionBankItem.create({
      data: {
        bank_id: params.id,
        question_id: questionId
      }
    });
    importedQuestions.push(question);
  }
  return NextResponse.json({ success: true, imported: importedQuestions.length });
} 