import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all subscriptions with institution details and performance metrics
    const subscriptions = await prisma.institutionSubscription.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Enhance with performance data
    const enhancedSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        // Commission rate is already available from the include
        const commissionTier = subscription.commissionTier;

        // Get revenue generated from payments
        const revenueGenerated = await prisma.payment.aggregate({
          where: {
            enrollment: {
              course: {
                institutionId: subscription.institutionId
              }
            },
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
          commissionRate: commissionTier?.commissionRate || 0,
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