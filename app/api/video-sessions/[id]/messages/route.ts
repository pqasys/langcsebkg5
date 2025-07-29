import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VideoConferencingService, VideoProviderConfig } from '@/lib/video-conferencing';

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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Initialize video conferencing service
    const config: VideoProviderConfig = {
      provider: (process.env.VIDEO_PROVIDER as any) || 'WEBRTC',
      apiKey: process.env.VIDEO_API_KEY,
      apiSecret: process.env.VIDEO_API_SECRET,
      accountId: process.env.VIDEO_ACCOUNT_ID,
      webhookSecret: process.env.VIDEO_WEBHOOK_SECRET,
    };

    const videoService = VideoConferencingService.getInstance(config);

    // Get session messages
    const messages = await videoService.getSessionMessages(sessionId, limit);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Failed to get messages:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();
    const { content, messageType, recipientId } = body;

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Initialize video conferencing service
    const config: VideoProviderConfig = {
      provider: (process.env.VIDEO_PROVIDER as any) || 'WEBRTC',
      apiKey: process.env.VIDEO_API_KEY,
      apiSecret: process.env.VIDEO_API_SECRET,
      accountId: process.env.VIDEO_ACCOUNT_ID,
      webhookSecret: process.env.VIDEO_WEBHOOK_SECRET,
    };

    const videoService = VideoConferencingService.getInstance(config);

    // Send message
    const message = await videoService.sendMessage(
      sessionId,
      session.user.id,
      content,
      messageType || 'TEXT',
      recipientId
    );

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 