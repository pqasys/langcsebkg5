import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get certificate statistics
    const [
      totalCertificates,
      totalUsers,
      averageScore,
      languagesCount,
      thisMonthCertificates,
      topLanguages
    ] = await Promise.all([
      // Total certificates
      prisma.certificate.count(),
      
      // Unique users with certificates
      prisma.certificate.groupBy({
        by: ['userId'],
        _count: { userId: true }
      }).then(result => result.length),
      
      // Average score
      prisma.certificate.aggregate({
        _avg: { score: true }
      }).then(result => result._avg.score || 0),
      
      // Number of unique languages
      prisma.certificate.groupBy({
        by: ['language'],
        _count: { language: true }
      }).then(result => result.length),
      
      // Certificates this month
      prisma.certificate.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Top languages
      prisma.certificate.groupBy({
        by: ['language'],
        _count: { language: true },
        orderBy: {
          _count: {
            language: 'desc'
          }
        },
        take: 5
      }).then(result => result.map(item => ({
        language: item.language,
        count: item._count.language
      })))
    ]);

    const stats = {
      totalCertificates,
      totalUsers,
      averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal place
      languagesCount,
      thisMonthCertificates,
      topLanguages
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching certificate stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate statistics' },
      { status: 500 }
    );
  }
}
