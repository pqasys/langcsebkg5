import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // // // // // // // // // console.log('--- [Custom Signout API] Starting ---');
  
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    console.log('Current session before signout:', session);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Sign out successful'
    });
    
    // Clear all NextAuth cookies
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.csrf-token',
      '__Host-next-auth.csrf-token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0, // Expire immediately
        expires: new Date(0) // Set to past date
      });
    });
    
    console.log('Cleared NextAuth cookies');
    
    return response;
    
  } catch (error) {
    console.error('Error in custom signout API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Sign out failed'
    }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 