import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';

export async function POST(request: NextRequest) {
  // // // // // // // // // // // // console.log('--- [Custom Signin API] Starting ---');
  
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }
    
    console.log('Authenticating user:', email);
    
    // Authenticate user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { institution: true }
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
    console.log('User authenticated successfully:', user.email);
    
    // Create session data
    const sessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institution?.id || null,
        status: user.status,
        institutionApproved: user.institution?.isApproved || false,
      }
    };
    
    // Set session cookie manually
    const response = NextResponse.json({
      success: true,
      session: sessionData,
      message: 'Authentication successful'
    });
    
    // Set a custom session token cookie
    const sessionToken = `custom-session-${user.id}-${Date.now()}`;
    response.cookies.set('next-auth.session-token', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    console.log('Session token set:', sessionToken);
    
    return response;
    
  } catch (error) {
    console.error('Error in custom signin API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Authentication failed'
    }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 