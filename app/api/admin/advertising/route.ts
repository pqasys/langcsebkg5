import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get advertising statistics and campaign data
    const [
      totalRevenue,
      commissionRevenue,
      featuredInstitutions,
      premiumInstitutions,
      highCommissionInstitutions,
      courseStats
    ] = await Promise.all([
      // Total revenue from payments that have been completed/paid
      prisma.payment.aggregate({
        where: {
          status: { in: ['COMPLETED', 'PAID', 'SUCCEEDED'] }
        },
        _sum: { amount: true }
      }),
      
      // Commission revenue (use explicit commissionAmount when available)
      prisma.payment.aggregate({
        where: {
          status: { in: ['COMPLETED', 'PAID', 'SUCCEEDED'] },
          commissionAmount: { gt: 0 }
        },
        _sum: { commissionAmount: true }
      }),
      
      // Featured institutions count
      prisma.institution.count({
        where: {
          isFeatured: true,
          isApproved: true,
          status: 'ACTIVE'
        }
      }),
      
      // Premium institutions count
      prisma.institution.count({
        where: {
          subscriptionPlan: 'ENTERPRISE',
          isApproved: true,
          status: 'ACTIVE'
        }
      }),
      
      // High commission institutions count
      prisma.institution.count({
        where: {
          commissionRate: {
            gte: 20
          },
          isApproved: true,
          status: 'ACTIVE'
        }
      }),
      
      // Course statistics
      prisma.course.groupBy({
        by: ['status'],
        where: {
          institution: {
            isApproved: true,
            status: 'ACTIVE'
          }
        },
        _count: {
          id: true
        }
      })
    ]);

    // Get top performing courses by enrollment activity (proxy for performance)
    const topCourses = await prisma.course.findMany({
      where: {
        institution: {
          isApproved: true,
          status: 'ACTIVE'
        }
      },
      include: {
        institution: {
          select: {
            name: true,
            commissionRate: true,
            subscriptionPlan: true,
            isFeatured: true
          }
        },
        _count: { select: { enrollments: true } }
      },
      orderBy: {
        enrollments: { _count: 'desc' }
      },
      take: 10
    });

    // Calculate priority scores for courses
    const coursesWithPriority = topCourses.map(course => {
      let priorityScore = 0;
      
      if (course.institution.isFeatured) priorityScore += 1000;
      priorityScore += (course.institution.commissionRate || 0) * 10;
      
      const planBonus = {
        'BASIC': 0,
        'PROFESSIONAL': 50,
        'ENTERPRISE': 100
      };
      priorityScore += planBonus[course.institution.subscriptionPlan as keyof typeof planBonus] || 0;
      
      const enrollmentCount = course._count.enrollments || 0;
      return {
        ...course,
        priorityScore,
        estimatedRevenue: (enrollmentCount * course.base_price) || 0,
        commissionRevenue: (enrollmentCount * course.base_price * (course.institution.commissionRate || 0) / 100) || 0
      };
    });

    // Get advertising campaign suggestions
    const campaignSuggestions = [
      {
        id: 'featured-promotion',
        title: 'Featured Institution Promotion',
        description: 'Promote featured institutions to increase their visibility and enrollment rates',
        potentialRevenue: featuredInstitutions * 5000, // Estimated $5000 per featured institution
        cost: 0,
        roi: 'High',
        status: 'active'
      },
      {
        id: 'premium-upsell',
        title: 'Premium Plan Upsell',
        description: 'Encourage institutions to upgrade to premium plans for better placement',
        potentialRevenue: (premiumInstitutions * 20000) + (featuredInstitutions * 15000),
        cost: 0,
        roi: 'Very High',
        status: 'active'
      },
      {
        id: 'commission-optimization',
        title: 'Commission Rate Optimization',
        description: 'Work with high-performing institutions to optimize commission rates',
        potentialRevenue: highCommissionInstitutions * 10000,
        cost: 0,
        roi: 'High',
        status: 'recommended'
      }
    ];

    return NextResponse.json({
      revenue: {
        total: totalRevenue._sum.amount || 0,
        commission: commissionRevenue._sum.commissionAmount || 0,
        commissionPercentage: totalRevenue._sum.amount
          ? (((commissionRevenue._sum.commissionAmount || 0) / totalRevenue._sum.amount) * 100)
          : 0
      },
      institutions: {
        featured: featuredInstitutions,
        premium: premiumInstitutions,
        highCommission: highCommissionInstitutions,
        total: await prisma.institution.count({
          where: {
            isApproved: true,
            status: 'ACTIVE'
          }
        })
      },
      courses: {
        total: await prisma.course.count({
          where: {
            institution: {
              isApproved: true,
              status: 'ACTIVE'
            }
          }
        }),
        byStatus: courseStats,
        topPerforming: coursesWithPriority
      },
      campaigns: campaignSuggestions,
      recommendations: [
        {
          type: 'revenue',
          title: 'Increase Featured Institutions',
          description: `Adding ${Math.max(1, Math.floor(featuredInstitutions * 0.2))} more featured institutions could increase revenue by 15-20%`,
          impact: 'High',
          effort: 'Medium'
        },
        {
          type: 'optimization',
          title: 'Commission Rate Optimization',
          description: 'Working with top 5 institutions to increase commission rates by 2-3%',
          impact: 'Medium',
          effort: 'Low'
        },
        {
          type: 'placement',
          title: 'Premium Placement Strategy',
          description: 'Implement dynamic pricing for premium placement positions',
          impact: 'High',
          effort: 'High'
        }
      ]
    });

  } catch (error) {
    console.error('Error fetching advertising data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertising data' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'update-featured-status':
        const { institutionId, isFeatured } = data;
        await prisma.institution.update({
          where: { id: institutionId },
          data: { isFeatured }
        });
        return NextResponse.json({ success: true, message: 'Featured status updated' });

      case 'update-commission-rate':
        const { institutionId: instId, commissionRate } = data;
        await prisma.institution.update({
          where: { id: instId },
          data: { commissionRate }
        });
        return NextResponse.json({ success: true, message: 'Commission rate updated' });

      case 'update-subscription-plan':
        const { institutionId: subInstId, subscriptionPlan } = data;
        await prisma.institution.update({
          where: { id: subInstId },
          data: { subscriptionPlan }
        });
        return NextResponse.json({ success: true, message: 'Subscription plan updated' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating advertising data:', error);
    return NextResponse.json(
      { error: 'Failed to update advertising data' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
} 