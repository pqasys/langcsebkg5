import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // First check if the table exists by trying to count records
    const count = await prisma.institutiontype.count();
    
    if (count === 0) {
      // If no types exist, return an empty array instead of an error
      return NextResponse.json([]);
    }

    const types = await prisma.institutiontype.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    });

    if (!types || types.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching institution types:');
    
    // Check if the error is due to the table not existing
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Institution types table not found',
          details: 'The database table for institution types does not exist'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch institution types',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 