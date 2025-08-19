import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Create or update a rating
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetId, rating, comment } = body || {};

    if (!targetType || !targetId) {
      return NextResponse.json({ error: 'targetType and targetId are required' }, { status: 400 });
    }

    const normalizedRating = Number(rating);
    if (!normalizedRating || normalizedRating < 1 || normalizedRating > 5) {
      return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 });
    }

    // Upsert rating
    await prisma.rating.upsert({
      where: {
        unique_user_target_rating: {
          userId: session.user.id,
          targetType: targetType as any,
          targetId,
        },
      },
      create: {
        userId: session.user.id,
        targetType: targetType as any,
        targetId,
        rating: normalizedRating,
        comment: comment ?? null,
      },
      update: {
        rating: normalizedRating,
        comment: comment ?? null,
      },
    });

    return NextResponse.json({ message: 'Rating saved' });
  } catch (error: any) {
    console.error('Error saving rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fetch aggregate rating for a target
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType');
    const targetId = searchParams.get('targetId');

    if (!targetType || !targetId) {
      return NextResponse.json({ error: 'targetType and targetId are required' }, { status: 400 });
    }

    const [stats, count] = await Promise.all([
      prisma.rating.aggregate({
        where: { targetType: targetType as any, targetId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.rating.count({ where: { targetType: targetType as any, targetId } }),
    ]);

    return NextResponse.json({
      average: stats._avg.rating ?? null,
      count,
    });
  } catch (error: any) {
    console.error('Error fetching rating stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


