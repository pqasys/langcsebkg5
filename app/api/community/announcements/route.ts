import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    const where: any = { isPublic: true };
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    
    if (language) where.language = language;
    if (level) where.cefrLevel = level;

    const announcements = await prisma.communityAnnouncement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    const total = await prisma.communityAnnouncement.count({
      where
    });

    return NextResponse.json({
      success: true,
      data: announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, message, language, cefrLevel, certificateId } = await request.json();

    if (!title || !message || !language || !cefrLevel) {
      return NextResponse.json({ 
        error: 'Title, message, language, and CEFR level are required' 
      }, { status: 400 });
    }

    const announcement = await prisma.communityAnnouncement.create({
      data: {
        userId: session.user.id,
        title,
        message,
        language,
        cefrLevel,
        certificateId: certificateId || null,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: announcement,
      message: 'Achievement shared with community!'
    });

  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to share achievement' },
      { status: 500 }
    );
  }
} 