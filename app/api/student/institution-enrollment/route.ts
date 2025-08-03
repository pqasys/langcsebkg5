import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution enrollment data using the same approach as live classes API
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        institutionId: true,
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const hasInstitutionEnrollment = !!user?.institutionId;
    const institutionId = user?.institutionId;
    const institutionName = user?.institution?.name;

    const enrollment = {
      hasInstitutionEnrollment,
      institutionId: institutionId || null,
      institutionName: institutionName || null,
      enrollmentStatus: hasInstitutionEnrollment ? 'ACTIVE' : null,
      enrollmentDate: null, // Could be added to user model if needed
      canAccessInstitutionContent: hasInstitutionEnrollment
    };

    return NextResponse.json({
      enrollment
    });

  } catch (error) {
    console.error('Error fetching institution enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution enrollment' },
      { status: 500 }
    );
  }
} 