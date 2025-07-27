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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string || 'json';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: params.id,
        institution_id: {
          not: null
        },
        institution: {
          users: {
            some: {
              user_id: session.user.id,
              role: {
                in: ['ADMIN', 'INSTRUCTOR']
              }
            }
          }
        }
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    const fileContent = await file.text();
    let questions: unknown[] = [];

    try {
      switch (format.toLowerCase()) {
        case 'json':
          const jsonData = JSON.parse(fileContent);
          questions = jsonData.questions || jsonData || [];
          break;

        case 'csv':
          const csvLines = fileContent.split('\n').filter(line => line.trim());
          if (csvLines.length < 2) {
            return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 });
          }

          const headers = csvLines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          questions = csvLines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const question: unknown = {};
            
            headers.forEach((header, index) => {
              const value = values[index] || '';
              switch (header.toLowerCase()) {
                case 'question text':
                  question.question_text = value;
                  break;
                case 'type':
                  question.question_type = value.toUpperCase();
                  break;
                case 'options':
                  question.options = value ? value.split('|') : [];
                  break;
                case 'correct answer':
                  question.correct_answer = value;
                  break;
                case 'explanation':
                  question.explanation = value;
                  break;
                case 'difficulty':
                  question.difficulty_level = value.toLowerCase();
                  break;
                case 'points':
                  question.points = parseInt(value) || 1;
                  break;
                case 'tags':
                  question.tags = value ? value.split(',').map((tag: string) => tag.trim()) : [];
                  break;
                case 'active':
                  question.is_active = value.toLowerCase() === 'yes';
                  break;
              }
            });
            
            return question;
          });
          break;

        default:
          return NextResponse.json({ error: 'Unsupported import format' }, { status: 400 });
      }
    } catch (parseError) {
      console.error('Error parsing file:');
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'No valid questions found in file' }, { status: 400 });
    }

    // Validate and prepare questions for import
    const validQuestions = questions
      .filter(q => q.question_text && q.question_type)
      .map(q => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: q.correct_answer || '',
        explanation: q.explanation || '',
        difficulty_level: q.difficulty_level || 'MEDIUM',
        points: parseInt(q.points) || 1,
        tags: Array.isArray(q.tags) ? q.tags : [],
        is_active: q.is_active !== false,
        question_bank_id: params.id,
        created_by: session.user.id
      }));

    if (validQuestions.length === 0) {
      return NextResponse.json({ error: 'No valid questions to import' }, { status: 400 });
    }

    // Import questions
    const importedQuestions = await prisma.question.createMany({
      data: validQuestions,
      skipDuplicates: true
    });

    // // // console.log(`Successfully imported ${importedQuestions.count} questions`);
    return NextResponse.json({
      message: `Successfully imported ${importedQuestions.count} questions`,
      importedCount: importedQuestions.count,
      totalProcessed: questions.length,
      validCount: validQuestions.length
    });

  } catch (error) {
    console.error('Error importing questions:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 