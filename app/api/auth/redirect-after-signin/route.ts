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
        success: false,
        message: 'No authenticated user found',
        redirectUrl: '/auth/login'
      });
    }

    // Determine redirect URL based on user role
    let redirectUrl = '/dashboard';
    
    if (session.user.role === 'ADMIN') {
      redirectUrl = '/admin/dashboard';
    } else if (session.user.role === 'INSTITUTION') {
      redirectUrl = '/institution/dashboard';
    } else if (session.user.role === 'STUDENT') {
      redirectUrl = '/student';
    }

    return NextResponse.json({
      success: true,
      message: 'Redirect URL determined',
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      },
      redirectUrl
    });

  } catch (error) {
    console.error('Redirect after sign-in error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to determine redirect URL',
        redirectUrl: '/auth/login'
      },
      { status: 500 }
    );
  }
} 