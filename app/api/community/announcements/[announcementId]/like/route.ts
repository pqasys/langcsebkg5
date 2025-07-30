import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CertificateService } from '@/lib/services/certificate-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { announcementId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { announcementId } = params;

    if (!announcementId) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    await CertificateService.likeAnnouncement(announcementId);

    return NextResponse.json({
      success: true,
      message: 'Announcement liked successfully'
    });

  } catch (error) {
    console.error('Error liking announcement:', error);
    return NextResponse.json(
      { error: 'Failed to like announcement' },
      { status: 500 }
    );
  }
} 