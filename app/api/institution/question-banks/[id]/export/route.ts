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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

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
      },
      include: {
        questions: {
          orderBy: {
            created_at: 'asc'
          }
        }
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    // Prepare export data
    const exportData = {
      questionBank: {
        id: questionBank.id,
        name: questionBank.name,
        description: questionBank.description,
        category: questionBank.category,
        created_at: questionBank.created_at,
        updated_at: questionBank.updated_at
      },
      questions: questionBank.questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty_level: q.difficulty_level,
        points: q.points,
        tags: q.tags,
        is_active: q.is_active,
        created_at: q.created_at,
        updated_at: q.updated_at
      }))
    };

    let responseData: string;
    let contentType: string;
    let filename: string;

    switch (format.toLowerCase()) {
      case 'json':
        responseData = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
        filename = `${questionBank.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        break;

      case 'csv':
        const csvHeaders = ['ID', 'Question Text', 'Type', 'Options', 'Correct Answer', 'Explanation', 'Difficulty', 'Points', 'Tags', 'Active', 'Created At'];
        const csvRows = [csvHeaders];
        
        exportData.questions.forEach(q => {
          csvRows.push([
            q.id,
            `"${q.question_text.replace(/"/g, '""')}"`,
            q.question_type,
            `"${Array.isArray(q.options) ? q.options.join('|') : q.options || ''}"`,
            `"${q.correct_answer || ''}"`,
            `"${q.explanation || ''}"`,
            q.difficulty_level,
            q.points.toString(),
            `"${Array.isArray(q.tags) ? q.tags.join(',') : ''}"`,
            q.is_active ? 'Yes' : 'No',
            q.created_at
          ]);
        });
        
        responseData = csvRows.map(row => row.join(',')).join('\n');
        contentType = 'text/csv';
        filename = `${questionBank.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        break;

      default:
        return NextResponse.json({ error: 'Unsupported export format' }, { status: 400 });
    }

    const response = new NextResponse(responseData);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    
    return response;

  } catch (error) {
    console.error('Error exporting questions:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 