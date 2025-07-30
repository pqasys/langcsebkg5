import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CertificateService } from '@/lib/services/certificate-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const announcements = await CertificateService.getPublicAnnouncements(limit);

    return NextResponse.json({
      success: true,
      data: announcements,
      pagination: {
        page,
        limit,
        total: announcements.length
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

    const { certificateId, isPublic } = await request.json();

    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    // Share certificate and create announcement
    const result = await CertificateService.shareCertificate(
      certificateId,
      session.user.id,
      isPublic
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: isPublic ? 'Certificate shared with community!' : 'Certificate made private'
    });

  } catch (error) {
    console.error('Error sharing certificate:', error);
    return NextResponse.json(
      { error: 'Failed to share certificate' },
      { status: 500 }
    );
  }
} 