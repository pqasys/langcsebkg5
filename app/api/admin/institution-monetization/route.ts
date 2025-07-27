import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all approved institutions with their data
    const institutions = await prisma.institution.findMany({
      where: {
        isApproved: true,
        status: 'ACTIVE'
      },
      include: {
        courses: {
          where: {
            status: 'PUBLISHED'
          },
          select: {
            id: true
          }
        },
        users: {
          where: {
            role: 'STUDENT'
          },
          select: {
            id: true
          }
        },
        bookings: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            id: true,
            amount: true,
            createdAt: true
          }
        }
      }
    });

    // Calculate analytics for each institution
    const institutionsWithAnalytics = await Promise.all(
      institutions.map(async (institution) => {
        // Calculate revenue generated from completed bookings
        const totalRevenue = institution.bookings.reduce((sum, booking) => {
          return sum + (booking.amount || 0);
        }, 0);

        // Calculate priority score
        let priorityScore = 0;
        if (institution.isFeatured) priorityScore += 1000;
        
        const planBonus = {
          'BASIC': 0,
          'PROFESSIONAL': 100,
          'ENTERPRISE': 200
        };
        priorityScore += planBonus[institution.subscriptionPlan as keyof typeof planBonus] || 0;
        priorityScore += (institution.commissionRate || 0) * 5;

        return {
          id: institution.id,
          name: institution.name,
          subscriptionPlan: institution.subscriptionPlan,
          isFeatured: institution.isFeatured,
          commissionRate: institution.commissionRate,
          courseCount: institution.courses.length,
          studentCount: institution.users.length,
          bookingCount: institution.bookings.length,
          priorityScore,
          revenueGenerated: totalRevenue,
          leadStats: {
            totalViews: 0, // Placeholder - would need LeadEvent model
            totalContacts: 0, // Placeholder - would need LeadEvent model
            conversionRate: 0
          }
        };
      })
    );

    // Calculate overall stats
    const totalRevenue = institutionsWithAnalytics.reduce((sum, inst) => sum + inst.revenueGenerated, 0);
    const premiumListings = institutionsWithAnalytics.filter(inst => inst.subscriptionPlan === 'ENTERPRISE').length;
    const sponsoredListings = institutionsWithAnalytics.filter(inst => inst.subscriptionPlan === 'PROFESSIONAL').length;
    const featuredInstitutions = institutionsWithAnalytics.filter(inst => inst.isFeatured).length;
    const totalLeads = institutionsWithAnalytics.reduce((sum, inst) => sum + inst.leadStats.totalContacts, 0);
    const averageConversionRate = institutionsWithAnalytics.length > 0 
      ? institutionsWithAnalytics.reduce((sum, inst) => sum + inst.leadStats.conversionRate, 0) / institutionsWithAnalytics.length
      : 0;

    // Calculate monthly growth (placeholder - would need historical data)
    const monthlyGrowth = 15; // Placeholder percentage

    const stats = {
      totalRevenue,
      premiumListings,
      sponsoredListings,
      featuredInstitutions,
      totalLeads,
      averageConversionRate,
      monthlyGrowth
    };

    return NextResponse.json({
      institutions: institutionsWithAnalytics,
      stats
    });

  } catch (error) {
    console.error('Error fetching institution monetization data:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch institution data',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 