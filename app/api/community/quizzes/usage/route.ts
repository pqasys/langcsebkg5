import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CommunityQuizAccessService } from '@/lib/community-quiz-access';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's quiz usage statistics
    const usage = await CommunityQuizAccessService.getUserQuizUsage(session.user.id);

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Error fetching quiz usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    );
  }
}
