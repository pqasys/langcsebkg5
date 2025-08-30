import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CertificateServiceSecure as CertificateService } from '@/lib/services/certificate-service-secure';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    
    // If no target user specified, use the authenticated user
    if (!targetUserId) {
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const certificates = await CertificateService.getUserCertificates(session.user.id);
      return NextResponse.json({
        success: true,
        data: certificates
      });
    }

    // If target user is specified, check if we can view their certificates
    if (!session?.user?.id) {
      // Public access - only show public certificates
      const publicCertificates = await prisma.certificate.findMany({
        where: {
          userId: targetUserId,
          isPublic: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        data: publicCertificates.map(cert => ({
          id: cert.id,
          certificateId: cert.certificateId,
          language: cert.language,
          languageName: cert.languageName,
          cefrLevel: cert.cefrLevel,
          score: cert.score,
          totalQuestions: cert.totalQuestions,
          completionDate: cert.completionDate,
          certificateUrl: cert.certificateUrl,
          isPublic: cert.isPublic,
          sharedAt: cert.sharedAt,
          achievements: [],
          user: cert.user
        }))
      });
    }

    // Authenticated user viewing another user's certificates
    const isOwnProfile = session.user.id === targetUserId;
    
    if (isOwnProfile) {
      // Viewing own certificates - show all
      const certificates = await CertificateService.getUserCertificates(session.user.id);
      return NextResponse.json({
        success: true,
        data: certificates
      });
    } else {
      // Viewing another user's certificates - only show public ones
      const publicCertificates = await prisma.certificate.findMany({
        where: {
          userId: targetUserId,
          isPublic: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        data: publicCertificates.map(cert => ({
          id: cert.id,
          certificateId: cert.certificateId,
          language: cert.language,
          languageName: cert.languageName,
          cefrLevel: cert.cefrLevel,
          score: cert.score,
          totalQuestions: cert.totalQuestions,
          completionDate: cert.completionDate,
          certificateUrl: cert.certificateUrl,
          isPublic: cert.isPublic,
          sharedAt: cert.sharedAt,
          achievements: [],
          user: cert.user
        }))
      });
    }

  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
} 