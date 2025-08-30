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
      
      const stats = await CertificateService.getUserStats(session.user.id);
      return NextResponse.json({
        success: true,
        data: stats
      });
    }

    // If target user is specified, get their public certificate stats
    const publicCertificates = await prisma.certificate.findMany({
      where: {
        userId: targetUserId,
        isPublic: true
      }
    });

    // Calculate stats from public certificates only
    const totalCertificates = publicCertificates.length;
    const totalAchievements = publicCertificates.length; // Each certificate is an achievement
    const averageScore = totalCertificates > 0 
      ? Math.round(publicCertificates.reduce((sum, cert) => sum + (cert.score || 0), 0) / totalCertificates)
      : 0;
    
    const languagesTested = new Set(publicCertificates.map(cert => cert.language)).size;
    
    const highestLevel = publicCertificates.length > 0 
      ? publicCertificates.reduce((highest, cert) => {
          const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
          const certLevel = cert.cefrLevel || 'A1';
          const certIndex = levels.indexOf(certLevel);
          const highestIndex = levels.indexOf(highest);
          return certIndex > highestIndex ? certLevel : highest;
        }, 'A1')
      : 'A1';

    const stats = {
      totalCertificates,
      totalAchievements,
      averageScore,
      languagesTested,
      highestLevel
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching certificate stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate stats' },
      { status: 500 }
    );
  }
} 