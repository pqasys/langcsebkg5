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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/json') {
      return NextResponse.json({ error: 'Only JSON files are supported' }, { status: 400 });
    }

    const fileContent = await file.text();
    let importData;

    try {
      importData = JSON.parse(fileContent);
    } catch (error) {
    console.error('Error occurred:', error);
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
    }

    // Validate import data structure
    if (!importData.name || !importData.questions || !Array.isArray(importData.questions)) {
      return NextResponse.json({ error: 'Invalid question bank format' }, { status: 400 });
    }

    // Create the question bank
    const questionBank = await prisma.questionBank.create({
      data: {
        name: importData.name,
        description: importData.description || '',
        category: importData.category || '',
        tags: importData.tags || [],
        is_public: importData.is_public || false,
        created_by: session.user.id
      }
    });

    // Import questions
    const importedQuestions = [];
    for (const questionData of importData.questions) {
      try {
        const question = await prisma.question.create({
          data: {
            question_text: questionData.question_text,
            question_type: questionData.question_type,
            options: questionData.options || [],
            correct_answer: questionData.correct_answer,
            explanation: questionData.explanation || '',
            difficulty: questionData.difficulty || 'MEDIUM',
            category: questionData.category || '',
            tags: questionData.tags || [],
            points: questionData.points || 1,
            question_bank_id: questionBank.id,
            created_by: session.user.id
          }
        });
        importedQuestions.push(question);
      } catch (error) {
        console.error('Error importing question:');
        // Continue with other questions even if one fails
      }
    }

    return NextResponse.json({
      message: 'Question bank imported successfully',
      questionBank,
      importedQuestions: importedQuestions.length,
      totalQuestions: importData.questions.length
    });
  } catch (error) {
    console.error('Error importing question bank:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 