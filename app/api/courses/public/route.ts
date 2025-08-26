import { NextResponse } from 'next/server'
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma'
import { logger, logError } from '../../../../lib/logger';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    // Get all approved courses with enhanced prioritization
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          // Platform courses (always show these)
          {
            institutionId: null,
            status: { in: ['PUBLISHED', 'ACTIVE'] }
          },
          // Institution courses with approved and active institutions
          {
            institution: {
              isApproved: true,
              status: 'ACTIVE'
            },
            status: { in: ['PUBLISHED', 'ACTIVE'] },
            // Show courses that started within the last 6 months or start within the next 6 months
            OR: [
              {
                startDate: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0) - 6 * 30 * 24 * 60 * 60 * 1000) // Started within last 6 months
                }
              },
              {
                startDate: {
                  lte: new Date(new Date().setHours(0, 0, 0, 0) + 6 * 30 * 24 * 60 * 60 * 1000) // Starting within next 6 months
                }
              }
            ]
          }
        ]
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
            commissionRate: true,
            isApproved: true,
            status: true,
            subscriptionPlan: true, // Legacy field for backward compatibility
            isFeatured: true, // For featured institution status
            subscriptions: {
              include: {
                commissionTier: true
              }
            }
          }
        },

        courseTags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: [
        // Primary: Featured institutions first
        { institution: { isFeatured: 'desc' } },
        // Secondary: Higher commission rates
        { institution: { commissionRate: 'desc' } },
        // Tertiary: Sooner start dates
        { startDate: 'asc' },
        // Quaternary: Newer courses
        { createdAt: 'desc' }
      ]
    })

    // Calculate priority scores for advanced sorting
    const coursesWithPriority = courses.map(course => {
      let priorityScore = 0;
      
      // Featured institution bonus (highest priority)
      if (course.institution?.isFeatured) {
        priorityScore += 1000;
      }
      
      // Commission rate bonus (0-50 points based on rate)
      priorityScore += (course.institution?.commissionRate || 0) * 10;
      
      // Subscription plan bonus - use new unified architecture when available
      let subscriptionPlan = 'BASIC'; // Default fallback
      
      if (course.institution?.subscriptions?.[0]?.status === 'ACTIVE' && course.institution.subscriptions[0].commissionTier) {
        // Use new unified architecture
        subscriptionPlan = course.institution.subscriptions[0].commissionTier.planType;
      } else if (course.institution?.subscriptionPlan) {
        // Fallback to legacy field for backward compatibility
        subscriptionPlan = course.institution.subscriptionPlan;
      }
      
      const planBonus = {
        'STARTER': 25,
        'BASIC': 0,
        'PROFESSIONAL': 50,
        'ENTERPRISE': 100
      };
      priorityScore += planBonus[subscriptionPlan as keyof typeof planBonus] || 0;
      
      // Recency bonus (newer courses get slight boost)
      const daysSinceCreation = Math.floor((Date.now() - new Date(course.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      priorityScore += Math.max(0, 30 - daysSinceCreation); // Up to 30 points for very new courses
      
      // Start date proximity bonus (sooner courses get boost). Guard against missing startDate
      const daysUntilStart = course.startDate
        ? Math.floor((new Date(course.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : Number.POSITIVE_INFINITY;
      if (Number.isFinite(daysUntilStart)) {
        priorityScore += Math.max(0, 30 - daysUntilStart); // Up to 30 points for courses starting soon
      }
      
      // Commission rate band categorization
      const commissionRate = course.institution?.commissionRate || 0;
      const commissionBand = commissionRate >= 25 ? 'VERY_HIGH' : 
                            commissionRate >= 20 ? 'HIGH' : 
                            commissionRate >= 15 ? 'MEDIUM' : 'LOW';
      
      return {
        ...course,
        // Keep priorityScore for internal sorting but don't expose it publicly
        priorityScore,
        // Add advertising eligibility flags
        isPremiumPlacement: subscriptionPlan === 'ENTERPRISE',
        isFeaturedPlacement: course.institution?.isFeatured || false,
        isHighCommission: commissionRate >= 20,
        isVeryHighCommission: commissionRate >= 25,
        commissionBand,
        effectiveSubscriptionPlan: subscriptionPlan,
        // Add commission rate band for better categorization (but don't expose the actual rate)
        commissionRateBand: {
          band: commissionBand,
          description: commissionBand === 'VERY_HIGH' ? 'Very High Commission' :
                      commissionBand === 'HIGH' ? 'High Commission' :
                      commissionBand === 'MEDIUM' ? 'Medium Commission' : 'Standard Commission'
        }
      };
    });

    // Sort by calculated priority score
    coursesWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

    // Remove sensitive data from public response
    const publicCourses = coursesWithPriority.map(course => {
      const { priorityScore, ...publicCourse } = course;
      return publicCourse;
    });

    return NextResponse.json(publicCourses)
  } catch (error) {
    console.error('Error fetching public courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
