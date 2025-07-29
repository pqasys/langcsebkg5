import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VideoConferencingService, VideoProviderConfig } from '@/lib/video-conferencing';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;

    // Initialize video conferencing service
    const config: VideoProviderConfig = {
      provider: (process.env.VIDEO_PROVIDER as any) || 'WEBRTC',
      apiKey: process.env.VIDEO_API_KEY,
      apiSecret: process.env.VIDEO_API_SECRET,
      accountId: process.env.VIDEO_ACCOUNT_ID,
      webhookSecret: process.env.VIDEO_WEBHOOK_SECRET,
    };

    const videoService = VideoConferencingService.getInstance(config);

    // Join video session
    const result = await videoService.joinVideoSession(sessionId, session.user.id);

    return NextResponse.json({
      success: true,
      session: result.session,
      participant: result.participant,
      meetingData: result.meetingData,
    });
  } catch (error) {
    console.error('Failed to join video session:', error);
    return NextResponse.json(
      { error: 'Failed to join video session' },
      { status: 500 }
    );
  }
} 