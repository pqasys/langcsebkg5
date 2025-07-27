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

    // Get subscription counts
    const totalSubscriptions = await prisma.institutionSubscription.count();
    const activeSubscriptions = await prisma.institutionSubscription.count({
      where: { status: 'ACTIVE' }
    });

    // Calculate monthly and annual revenue
    const monthlySubscriptions = await prisma.institutionSubscription.findMany({
      where: {
        status: 'ACTIVE',
        commissionTier: {
          billingCycle: 'MONTHLY'
        }
      },
      include: {
        commissionTier: true
      }
    });

    const annualSubscriptions = await prisma.institutionSubscription.findMany({
      where: {
        status: 'ACTIVE',
        commissionTier: {
          billingCycle: 'ANNUAL'
        }
      },
      include: {
        commissionTier: true
      }
    });

    const monthlyRevenue = monthlySubscriptions.reduce((sum, sub) => sum + sub.commissionTier.price, 0);
    const annualRevenue = annualSubscriptions.reduce((sum, sub) => sum + sub.commissionTier.price, 0);

    // Calculate average commission rate
    const commissionTiers = await prisma.commissionTier.findMany({
      where: { isActive: true }
    });

    const averageCommissionRate = commissionTiers.length > 0 
      ? commissionTiers.reduce((sum, tier) => sum + tier.commissionRate, 0) / commissionTiers.length
      : 0;

    // Get top performing institutions
    const topPerformingInstitutions = await prisma.institution.findMany({
      include: {
        subscription: {
          include: {
            commissionTier: true
          }
        },
        courses: {
          include: {
            enrollments: {
              include: {
                payments: {
                  where: { status: 'COMPLETED' }
                }
              }
            }
          }
        }
      }
    });

    const institutionsWithRevenue = topPerformingInstitutions
      .map(institution => {
        const totalRevenue = institution.courses.reduce((sum, course) => {
          return sum + course.enrollments.reduce((enrollmentSum, enrollment) => {
            return enrollmentSum + enrollment.payments.reduce((paymentSum, payment) => {
              return paymentSum + payment.amount;
            }, 0);
          }, 0);
        }, 0);

        return {
          name: institution.name,
          revenue: totalRevenue,
          commissionRate: institution.subscription?.commissionTier?.commissionRate || 0
        };
      })
      .filter(inst => inst.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      totalSubscriptions,
      activeSubscriptions,
      monthlyRevenue,
      annualRevenue,
      averageCommissionRate: Math.round(averageCommissionRate * 100) / 100,
      topPerformingInstitutions: institutionsWithRevenue
    });
  } catch (error) {
    console.error('Error fetching subscription stats:');
    return NextResponse.json(
      { error: 'Failed to fetch subscription statistics' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 