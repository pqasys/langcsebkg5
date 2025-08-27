import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CommunityQuizAccessService } from '@/lib/community-quiz-access';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get available quizzes for community members
    const quizzes = await CommunityQuizAccessService.getAvailableQuizzes(20);

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching community quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
