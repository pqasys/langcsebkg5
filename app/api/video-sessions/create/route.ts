import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassesService, VideoProviderConfig } from '@/lib/live-classes';
import { LiveClassAttendanceService } from '@/lib/live-class-attendance-service';
import { LiveClassSubscriptionService } from '@/lib/live-class-subscription-service';

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
      // Attendance threshold settings
      minAttendanceThreshold,
      profitMarginThreshold,
      instructorHourlyRate,
      platformRevenuePerStudent,
      autoCancelIfBelowThreshold,
    } = body;

    // Enforce: All sessions must be linked to a course (directly or via module)
    if (!courseId && !moduleId) {
      return NextResponse.json({ error: 'A courseId or moduleId is required to create a live class' }, { status: 400 });
    }

    // Validate required fields
    if (!title || !sessionType || !language || !level || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate session duration - must be exactly 60 minutes for live classes
    const calculatedDuration = duration || Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
    const durationValidation = LiveClassSubscriptionService.validateSessionDuration(calculatedDuration);
    
    if (!durationValidation.isValid) {
      return NextResponse.json({ 
        error: durationValidation.reason 
      }, { status: 400 });
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
      duration: calculatedDuration, // Use validated duration
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
      // Attendance threshold settings
      minAttendanceThreshold: minAttendanceThreshold || 4,
      profitMarginThreshold: profitMarginThreshold || 8,
      instructorHourlyRate: instructorHourlyRate || 25.0,
      platformRevenuePerStudent: platformRevenuePerStudent || 24.99,
      autoCancelIfBelowThreshold: autoCancelIfBelowThreshold !== false,
    };

    const result = await videoService.createLiveClass(sessionData);

    // Set up automatic attendance threshold checking
    try {
      await LiveClassAttendanceService.setupThresholdChecking(result.id);
    } catch (thresholdError) {
      console.warn('Failed to set up attendance threshold checking:', thresholdError);
      // Don't fail the session creation if threshold setup fails
    }

    return NextResponse.json({
      success: true,
      session: result,
      attendanceThreshold: {
        minRequired: sessionData.minAttendanceThreshold,
        profitThreshold: sessionData.profitMarginThreshold,
        autoCancel: sessionData.autoCancelIfBelowThreshold
      }
    });
  } catch (error) {
    console.error('Failed to create video session:', error);
    return NextResponse.json(
      { error: 'Failed to create video session' },
      { status: 500 }
    );
  }
} 