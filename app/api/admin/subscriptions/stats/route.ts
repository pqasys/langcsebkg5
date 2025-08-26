import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get subscription counts
    const totalSubscriptions = await prisma.institutionSubscription.count();
    const activeSubscriptionCount = await prisma.institutionSubscription.count({
      where: { status: 'ACTIVE' }
    });

    // Get all active subscriptions
    const activeSubscriptionList = await prisma.institutionSubscription.findMany({
      where: { status: 'ACTIVE' }
    });

    // Get commission tiers for active subscriptions
    const commissionTierIds = [...new Set(activeSubscriptionList.map(s => s.commissionTierId))];
    const activeTiers = await prisma.commissionTier.findMany({
      where: { id: { in: commissionTierIds } }
    });

    // Create lookup map
    const commissionTierMap = new Map(activeTiers.map(tier => [tier.id, tier]));

    // Calculate monthly and annual revenue
    const monthlySubscriptions = activeSubscriptionList.filter(sub => {
      const tier = commissionTierMap.get(sub.commissionTierId);
      return tier?.billingCycle === 'MONTHLY';
    });

    const annualSubscriptions = activeSubscriptionList.filter(sub => {
      const tier = commissionTierMap.get(sub.commissionTierId);
      return tier?.billingCycle === 'ANNUAL';
    });

    const monthlyRevenue = monthlySubscriptions.reduce((sum, sub) => {
      const tier = commissionTierMap.get(sub.commissionTierId);
      return sum + (tier?.price || 0);
    }, 0);
    const annualRevenue = annualSubscriptions.reduce((sum, sub) => {
      const tier = commissionTierMap.get(sub.commissionTierId);
      return sum + (tier?.price || 0);
    }, 0);

    // Calculate average commission rate
    const allCommissionTiers = await prisma.commissionTier.findMany({
      where: { isActive: true }
    });

    const averageCommissionRate = allCommissionTiers.length > 0 
      ? allCommissionTiers.reduce((sum, tier) => sum + tier.commissionRate, 0) / allCommissionTiers.length
      : 0;

    // Get top performing institutions
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true
      }
    });

    // Get subscriptions for institutions
    const institutionSubscriptions = await prisma.institutionSubscription.findMany({
      where: {
        institutionId: { in: institutions.map(inst => inst.id) }
      }
    });

    // Get courses for institutions
    const institutionCourses = await prisma.course.findMany({
      where: {
        institutionId: { in: institutions.map(inst => inst.id) }
      },
      select: {
        id: true,
        institutionId: true
      }
    });

    // Get enrollments for courses
    const courseIds = institutionCourses.map(course => course.id);
    const enrollments = courseIds.length > 0 ? await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: { in: courseIds }
      },
      select: {
        id: true,
        courseId: true
      }
    }) : [];

    // Get payments for enrollments
    const enrollmentIds = enrollments.map(enrollment => enrollment.id);
    const payments = enrollmentIds.length > 0 ? await prisma.payment.findMany({
      where: {
        enrollmentId: { in: enrollmentIds },
        status: 'COMPLETED'
      },
      select: {
        amount: true,
        enrollmentId: true
      }
    }) : [];

    // Create lookup maps
    const subscriptionMap = new Map(institutionSubscriptions.map(sub => [sub.institutionId, sub]));
    const courseMap = new Map(institutionCourses.map(course => [course.id, course]));
    const enrollmentMap = new Map(enrollments.map(enrollment => [enrollment.id, enrollment]));
    const paymentMap = new Map();
    payments.forEach(payment => {
      if (!paymentMap.has(payment.enrollmentId)) {
        paymentMap.set(payment.enrollmentId, []);
      }
      paymentMap.get(payment.enrollmentId).push(payment);
    });

    const institutionsWithRevenue = institutions
      .map(institution => {
        // Get courses for this institution
        const institutionCourseIds = institutionCourses
          .filter(course => course.institutionId === institution.id)
          .map(course => course.id);

        // Get enrollments for these courses
        const courseEnrollmentIds = enrollments
          .filter(enrollment => institutionCourseIds.includes(enrollment.courseId))
          .map(enrollment => enrollment.id);

        // Calculate total revenue
        const totalRevenue = courseEnrollmentIds.reduce((sum, enrollmentId) => {
          const enrollmentPayments = paymentMap.get(enrollmentId) || [];
          return sum + enrollmentPayments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
        }, 0);

        // Get subscription commission rate
        const subscription = subscriptionMap.get(institution.id);
        const commissionRate = subscription ? commissionTierMap.get(subscription.commissionTierId)?.commissionRate || 0 : 0;

        return {
          name: institution.name,
          revenue: totalRevenue,
          commissionRate
        };
      })
      .filter(inst => inst.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      totalSubscriptions,
      activeSubscriptions: activeSubscriptionCount,
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