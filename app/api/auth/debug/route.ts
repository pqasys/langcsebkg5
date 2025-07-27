import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const cookies = request.headers.get('cookie') || '';
    
    // Parse cookies to check for NextAuth cookies
    const cookieArray = cookies.split(';').map(cookie => cookie.trim());
    const nextAuthCookies = cookieArray.filter(cookie => 
      cookie.startsWith('next-auth.')
    );
    
    // Check for specific cookies
    const hasSessionToken = cookieArray.some(cookie => 
      cookie.startsWith('next-auth.session-token')
    );
    const hasCallbackUrl = cookieArray.some(cookie => 
      cookie.startsWith('next-auth.callback-url')
    );
    const hasCsrfToken = cookieArray.some(cookie => 
      cookie.startsWith('next-auth.csrf-token')
    );
    
    const cookieChecks = {
      hasSessionToken,
      hasCallbackUrl,
      hasCsrfToken
    };
    
    const response = {
      hasSession: !!session,
      session: session ? {
        user: session.user ? {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        } : null,
        expires: session.expires
      } : null,
      cookies: {
        count: cookieArray.length,
        nextAuthCount: nextAuthCookies.length,
        cookieChecks
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Debug API failed' },
      { status: 500 }
    );
  }
} 