import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({
        valid: false,
        message: 'No valid session found',
        timestamp: new Date().toISOString()
      });
    }

    // Check if session is expired
    const isExpired = session.expires && new Date(session.expires) < new Date();
    
    if (isExpired) {
      return NextResponse.json({
        valid: false,
        message: 'Session has expired',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      valid: true,
      message: 'Session is valid',
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      },
      session: {
        expires: session.expires
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Session validation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 