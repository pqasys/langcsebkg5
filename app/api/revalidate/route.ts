import { NextRequest, NextResponse } from 'next/server'
import { isBuildTime } from '@/lib/build-error-handler';
import { revalidatePath } from 'next/cache'
import { logger, logError } from '../../../lib/logger';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { message: 'Path parameter is required' },
        { status: 400 }
      )
    }

    // Revalidate the specified path
    revalidatePath(path)

    return NextResponse.json(
      { revalidated: true, message: `Path ${path} revalidated successfully` },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json(
      { message: 'Error revalidating path' },
      { status: 500 }
    )
  }
} 