import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock institution enrollment data
    // In a real implementation, this would query the database
    const mockEnrollment = {
      hasInstitutionEnrollment: false, // Set to true to test institution access
      institutionId: null,
      institutionName: null,
      enrollmentStatus: null,
      enrollmentDate: null,
      canAccessInstitutionContent: false
    };

    // For testing purposes, you can modify the mock data here
    // Example: Set hasInstitutionEnrollment to true to test institution access
    // mockEnrollment.hasInstitutionEnrollment = true;
    // mockEnrollment.institutionId = 'inst_123';
    // mockEnrollment.institutionName = 'Test Language School';
    // mockEnrollment.enrollmentStatus = 'ACTIVE';
    // mockEnrollment.canAccessInstitutionContent = true;

    return NextResponse.json({
      enrollment: mockEnrollment
    });

  } catch (error) {
    console.error('Error fetching institution enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution enrollment' },
      { status: 500 }
    );
  }
} 