import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const cookieData: Record<string, string> = {};
    
    cookies.getAll().forEach(cookie => {
      cookieData[cookie.name] = cookie.value;
    });

    return NextResponse.json({
      cookies: cookieData,
      count: cookies.getAll().length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug cookies error:', error);
    return NextResponse.json(
      { error: 'Failed to debug cookies' },
      { status: 500 }
    );
  }
} 