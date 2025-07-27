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
        authenticated: false,
        message: 'No session found',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      authenticated: true,
      message: 'Test login successful',
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
    console.error('Test Login API - Error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Test login failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 