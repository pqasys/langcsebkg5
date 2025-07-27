import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session found'
      });
    }

    return NextResponse.json({
      authenticated: true,
      message: 'Session forced successfully',
      user: {
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role
      },
      session: {
        expires: session.expires
      }
    });

  } catch (error) {
    console.error('Error in force session API:', error);
    return NextResponse.json(
      { error: 'Force session failed' },
      { status: 500 }
    );
  }
} 