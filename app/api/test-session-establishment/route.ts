import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Test 1: Getting session...');
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        step: 1,
        status: 'failed',
        message: 'No session established',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Test 2: Session found, checking user...');
    if (!session.user) {
      return NextResponse.json({
        step: 2,
        status: 'failed',
        message: 'Session exists but no user data',
        session: { exists: true, user: null },
        timestamp: new Date().toISOString()
      });
    }

    console.log('Test 3: User found, checking details...');
    return NextResponse.json({
      step: 3,
      status: 'success',
      message: 'Session establishment successful',
      session: {
        exists: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role
        },
        expires: session.expires
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in session establishment test:', error);
    return NextResponse.json(
      { 
        step: 'error',
        status: 'failed',
        message: 'Session establishment test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 