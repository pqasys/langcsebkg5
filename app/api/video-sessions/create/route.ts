import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassesService, VideoProviderConfig } from '@/lib/live-classes';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      sessionType,
      language,
      level,
      maxParticipants,
      startTime,
      endTime,
      duration,
      institutionId,
      courseId,
      moduleId,
      price,
      isPublic,
      isRecorded,
      allowChat,
      allowScreenShare,
      allowRecording,
    } = body;

    // Enforce: All sessions must be linked to a course (directly or via module)
    if (!courseId && !moduleId) {
      return NextResponse.json({ error: 'A courseId or moduleId is required to create a live class' }, { status: 400 });
    }

    // Validate required fields
    if (!title || !sessionType || !language || !level || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize video conferencing service
    const config: VideoProviderConfig = {
      provider: (process.env.VIDEO_PROVIDER as any) || 'WEBRTC',
      apiKey: process.env.VIDEO_API_KEY,
      apiSecret: process.env.VIDEO_API_SECRET,
      accountId: process.env.VIDEO_ACCOUNT_ID,
      webhookSecret: process.env.VIDEO_WEBHOOK_SECRET,
    };

    const videoService = LiveClassesService.getInstance(config);

    // Create video session
    const sessionData = {
      id: crypto.randomUUID(),
      title,
      description,
      sessionType,
      language,
      level,
      maxParticipants: maxParticipants || 10,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration: duration || Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000),
      instructorId: session.user.id,
      institutionId,
      courseId,
      moduleId,
      price: price || 0,
      isPublic: isPublic || false,
      isRecorded: isRecorded || false,
      allowChat: allowChat !== false,
      allowScreenShare: allowScreenShare !== false,
      allowRecording: allowRecording || false,
    };

    const result = await videoService.createLiveClass(sessionData);

    return NextResponse.json({
      success: true,
      session: result,
    });
  } catch (error) {
    console.error('Failed to create video session:', error);
    return NextResponse.json(
      { error: 'Failed to create video session' },
      { status: 500 }
    );
  }
} 