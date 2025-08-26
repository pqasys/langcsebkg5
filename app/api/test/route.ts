import { NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';

export async function GET() {
  return NextResponse.json({ 
    message: 'Test API working',
    timestamp: new Date().toISOString()
  });
} 