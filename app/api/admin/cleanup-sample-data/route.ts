import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cleanupSampleData } from '@/scripts/cleanup-sample-data';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const result = await cleanupSampleData();

    if (!result.success) {
      return NextResponse.json(
        { message: 'Failed to cleanup sample data', error: result.error },
        { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in cleanup endpoint:');
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 