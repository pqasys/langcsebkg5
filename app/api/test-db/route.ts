import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';

// Helper function to handle BigInt serialization
function serializeForJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeForJSON);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeForJSON(value);
    }
    return result;
  }
  
  return obj;
}

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const startTime = Date.now();
    
    // Simple database query to test connectivity
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Serialize the result to handle any BigInt values
    const serializedResult = serializeForJSON(result);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      duration: `${duration}ms`,
      result: serializedResult
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
} 