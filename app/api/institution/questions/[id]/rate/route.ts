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

    const questionId = params.id;
    const body = await request.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify user has access to the question
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        OR: [
          { is_public: true },
          {
            shared_with: {
              has: 'PUBLIC'
            }
          },
          {
            shared_with: {
              has: 'INSTITUTION'
            }
          }
        ]
      }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found or access denied' }, { status: 404 });
    }

    // Check if user has already rated this question
    const existingRating = await prisma.questionRating.findFirst({
      where: {
        question_id: questionId,
        rated_by: session.user.id
      }
    });

    if (existingRating) {
      // Update existing rating
      await prisma.questionRating.update({
        where: {
          id: existingRating.id
        },
        data: {
          rating: rating,
          updated_at: new Date()
        }
      });
    } else {
      // Create new rating
      await prisma.questionRating.create({
        data: {
          question_id: questionId,
          rated_by: session.user.id,
          rating: rating,
          created_at: new Date()
        }
      });
    }

    return NextResponse.json({
      message: 'Rating submitted successfully',
      rating: rating
    });
  } catch (error) {
    console.error('Error rating question:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 