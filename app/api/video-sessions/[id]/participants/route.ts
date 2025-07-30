import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassesService, VideoProviderConfig } from '@/lib/live-classes';

export async function GET(
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

    // Get active participants
    const participants = await videoService.getActiveParticipants(sessionId);

    return NextResponse.json({
      success: true,
      participants,
    });
  } catch (error) {
    console.error('Failed to get participants:', error);
    return NextResponse.json(
      { error: 'Failed to get participants' },
      { status: 500 }
    );
  }
} 