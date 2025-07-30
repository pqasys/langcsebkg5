import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassesService, VideoProviderConfig } from '@/lib/live-classes';

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

    const videoService = LiveClassesService.getInstance(config);

    // Leave video session
    await videoService.leaveLiveClass(sessionId, session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Successfully left video session',
    });
  } catch (error) {
    console.error('Failed to leave video session:', error);
    return NextResponse.json(
      { error: 'Failed to leave video session' },
      { status: 500 }
    );
  }
} 