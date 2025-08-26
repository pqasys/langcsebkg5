import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session found',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      authenticated: true,
      message: 'Session is valid',
      user: {
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role
      },
      session: {
        expires: session.expires
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in test session API:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Session test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 