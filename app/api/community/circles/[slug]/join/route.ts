import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = params.slug;

    // Check if circle exists
    const circle = await prisma.communityCircle.findUnique({
      where: { slug: slug }
    });

    if (!circle) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.communityCircleMembership.findUnique({
      where: {
        circleId_userId: {
          circleId: circle.id,
          userId: session.user.id
        }
      }
    });

    if (existingMembership) {
      return NextResponse.json({ error: 'Already a member of this circle' }, { status: 400 });
    }

    // Create membership
    await prisma.communityCircleMembership.create({
      data: {
        circleId: circle.id,
        userId: session.user.id,
        role: 'MEMBER'
      }
    });

    // Check if user has a paid subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionStatus: true }
    });

    const hasPaidSubscription = user?.subscriptionStatus === 'ACTIVE';

    return NextResponse.json({
      success: true,
      message: 'Successfully joined circle',
      showSubscriptionReminder: !hasPaidSubscription,
      circleName: circle.name
    });

  } catch (error) {
    console.error('Error joining circle:', error);
    return NextResponse.json(
      { error: 'Failed to join circle' },
      { status: 500 }
    );
  }
}


