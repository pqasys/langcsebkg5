import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const announcementId = params.id;

    // Check if announcement exists
    const announcement = await prisma.communityAnnouncement.findUnique({
      where: { id: announcementId }
    });

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Check if user already liked
    const existingLike = await prisma.communityAnnouncementLike.findUnique({
      where: {
        announcementId_userId: {
          announcementId,
          userId: session.user.id
        }
      }
    });

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    // Create like
    await prisma.communityAnnouncementLike.create({
      data: {
        announcementId,
        userId: session.user.id
      }
    });

    // Update announcement like count
    await prisma.communityAnnouncement.update({
      where: { id: announcementId },
      data: {
        likes: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Liked successfully'
    });

  } catch (error) {
    console.error('Error liking announcement:', error);
    return NextResponse.json(
      { error: 'Failed to like announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const announcementId = params.id;

    // Delete like
    const deletedLike = await prisma.communityAnnouncementLike.deleteMany({
      where: {
        announcementId,
        userId: session.user.id
      }
    });

    if (deletedLike.count === 0) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    // Update announcement like count
    await prisma.communityAnnouncement.update({
      where: { id: announcementId },
      data: {
        likes: {
          decrement: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Unliked successfully'
    });

  } catch (error) {
    console.error('Error unliking announcement:', error);
    return NextResponse.json(
      { error: 'Failed to unlike announcement' },
      { status: 500 }
    );
  }
}
