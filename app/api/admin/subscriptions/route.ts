import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Check NextAuth.js session
    const session = await getServerSession(authOptions);
    
    // Check custom session token
    const customSessionToken = request.cookies.get('custom-session-token')?.value;
    let customSession = null;
    
    if (customSessionToken) {
      try {
        customSession = JSON.parse(customSessionToken);
      } catch (e) {
        // Invalid token format
      }
    }
    
    // Check if either session is valid and has admin role
    const user = session?.user || customSession;
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all subscriptions with relations
    const subscriptions = await prisma.institutionSubscription.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true,
          }
        },
        commissionTier: true
      }
    }).then(subs => subs.filter(sub => sub.institution !== null));

    // Enhance with performance data
    const enhancedSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        // Get revenue generated from payments
        const revenueGenerated = await prisma.payment.aggregate({
          where: {
            institutionId: subscription.institutionId,
            status: 'COMPLETED'
          },
          _sum: {
            amount: true
          }
        });

        // Get active students count
        const activeStudents = await prisma.studentCourseEnrollment.count({
          where: {
            course: {
              institutionId: subscription.institutionId
            },
            status: {
              in: ['IN_PROGRESS', 'ENROLLED', 'ACTIVE']
            }
          }
        });

        // Get total courses count
        const totalCourses = await prisma.course.count({
          where: {
            institutionId: subscription.institutionId
          }
        });

        return {
          ...subscription,
          commissionRate: subscription.commissionTier?.commissionRate || 0,
          revenueGenerated: revenueGenerated._sum.amount || 0,
          activeStudents,
          totalCourses
        };
      })
    );

    return NextResponse.json(enhancedSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:');
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 