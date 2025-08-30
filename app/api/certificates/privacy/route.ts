import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { certificateId, isPublic } = body;

    if (!certificateId || typeof isPublic !== 'boolean') {
      return NextResponse.json({ 
        error: 'Certificate ID and isPublic flag are required' 
      }, { status: 400 });
    }

    // Find the certificate and verify ownership
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId },
      select: { id: true, userId: true }
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Verify the user owns this certificate
    if (certificate.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the certificate privacy setting
    await prisma.certificate.update({
      where: { certificateId },
      data: { 
        isPublic,
        sharedAt: isPublic ? new Date() : null
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `Certificate ${isPublic ? 'made public' : 'made private'} successfully`
    });

  } catch (error) {
    console.error('Error updating certificate privacy:', error);
    return NextResponse.json(
      { error: 'Failed to update certificate privacy' },
      { status: 500 }
    );
  }
}
