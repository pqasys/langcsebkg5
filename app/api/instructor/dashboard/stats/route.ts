import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Access denied. Instructor role required.' }, { status: 403 });
    }

    // Get instructor's live classes
    const liveClasses = await prisma.videoSession.findMany({
      where: { instructorId: session.user.id },
      include: {
        participants: true,
        instructorCommissions: true
      }
    });

    // Get instructor's tier assignment
    const tierAssignment = await prisma.instructorCommissionTierAssignment.findFirst({
      where: { instructorId: session.user.id },
      include: {
        tier: true
      }
    });

    // Calculate statistics
    const totalClasses = liveClasses.length;
    const completedClasses = liveClasses.filter(c => c.status === 'COMPLETED').length;
    const thisMonthClasses = liveClasses.filter(c => {
      const classDate = new Date(c.startTime);
      const now = new Date();
      return classDate.getMonth() === now.getMonth() && classDate.getFullYear() === now.getFullYear();
    }).length;

    // Calculate total students
    const totalStudents = liveClasses.reduce((sum, classItem) => {
      return sum + classItem.participants.length;
    }, 0);

    // Calculate earnings
    const totalEarnings = liveClasses.reduce((sum, classItem) => {
      const classCommissions = classItem.instructorCommissions.reduce((commissionSum, commission) => {
        return commissionSum + commission.amount;
      }, 0);
      return sum + classCommissions;
    }, 0);

    const thisMonthEarnings = liveClasses
      .filter(c => {
        const classDate = new Date(c.startTime);
        const now = new Date();
        return classDate.getMonth() === now.getMonth() && classDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, classItem) => {
        const classCommissions = classItem.instructorCommissions.reduce((commissionSum, commission) => {
          return commissionSum + commission.amount;
        }, 0);
        return sum + classCommissions;
      }, 0);

    // Calculate average rating (placeholder - would need rating system)
    const averageRating = 4.5; // This would come from actual ratings
    const completionRate = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

    // Get tier information
    const currentTier = tierAssignment?.tier || { displayName: 'Bronze', minSessions: 0, maxSessions: 10 };
    const nextTier = await prisma.instructorCommissionTier.findFirst({
      where: {
        minSessions: { gt: currentTier.maxSessions },
        isActive: true
      },
      orderBy: { minSessions: 'asc' }
    });

    // Calculate tier progress
    const tierProgress = nextTier 
      ? Math.min(100, Math.round((totalClasses / nextTier.minSessions) * 100))
      : 100;

    const nextTierRequirements = nextTier 
      ? `Complete ${nextTier.minSessions - totalClasses} more classes to reach ${nextTier.displayName} tier`
      : 'You have reached the highest tier!';

    const stats = {
      totalClasses,
      totalStudents,
      totalEarnings,
      averageRating,
      completionRate,
      thisMonthClasses,
      thisMonthEarnings,
      tierLevel: currentTier.displayName,
      tierProgress,
      nextTierRequirements
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching instructor stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor statistics' },
      { status: 500 }
    );
  }
}
