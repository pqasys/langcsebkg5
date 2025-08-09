import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassesService, VideoProviderConfig } from '@/lib/live-classes';
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

    // Trial short-circuit: allow join if user has active TRIAL with quota
    const subscription = await prisma.studentSubscription.findUnique({ where: { studentId: session.user.id } });
    const now = new Date();
    const isTrialActive = !!subscription && (subscription.planType || '').toUpperCase() === 'TRIAL' && subscription.status === 'ACTIVE' && subscription.endDate > now && (subscription.attendanceQuota || 0) > 0;

    // Join video session (service handles capacity/seat logic)
    const result = await videoService.joinLiveClass(sessionId, session.user.id);

    // If trial, consume seat after successful join
    if (isTrialActive) {
      try {
        await prisma.studentSubscription.update({
          where: { studentId: session.user.id },
          data: {
            attendanceQuota: Math.max(0, (subscription.attendanceQuota || 0) - 1),
            ...(Math.max(0, (subscription.attendanceQuota || 0) - 1) === 0 ? { status: 'CANCELLED' } : {})
          }
        });
      } catch (e) {
        // Non-fatal: user already joined; log and continue
        console.error('Failed to consume trial after join:', e);
      }
    }

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