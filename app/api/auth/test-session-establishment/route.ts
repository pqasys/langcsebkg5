import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // // // // // // // // // // console.log('--- [Test Session Establishment] Starting session test ---');
    
    // Get the request body
    const body = await request.json();
    const { email, password } = body;
    
    console.log('Testing session establishment for:', email);
    
    // First, check if we have a session before authentication
    const sessionBefore = await getServerSession(authOptions);
    console.log('Session before auth:', sessionBefore);
    
    // Try to authenticate using the credentials provider directly
    const { authorize } = authOptions.providers[0] as any;
    const user = await authorize({ email, password }, null);
    
    console.log('Authorization result:', user);
    
    if (user) {
      // Check session after successful authorization
      const sessionAfter = await getServerSession(authOptions);
      console.log('Session after auth:', sessionAfter);
      
      return NextResponse.json({
        success: true,
        user,
        sessionBefore,
        sessionAfter,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        sessionBefore,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Test Session Establishment error:', error);
    return NextResponse.json({
      error: 'Failed to test session establishment',
      timestamp: new Date().toISOString()
    }, { status: 500, statusText: 'Internal Server Error' });
  }
} 