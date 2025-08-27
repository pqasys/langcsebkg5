import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassAttendanceService } from '@/lib/live-class-attendance-service';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/video-sessions/[id]/attendance-threshold - Get attendance analysis
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

    // Check if user has permission to view this session
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: {
        instructor: true,
        participants: true
      }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Only instructor, institution staff, or admin can view attendance analysis
    const canView = 
      session.user.role === 'ADMIN' ||
      session.user.id === videoSession.instructorId ||
      (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId === videoSession.institutionId);

    if (!canView) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get attendance analysis
    const analysis = await LiveClassAttendanceService.analyzeAttendanceThreshold(sessionId);
    const profitabilityReport = await LiveClassAttendanceService.getProfitabilityReport(sessionId);

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        profitabilityReport,
        session: {
          id: videoSession.id,
          title: videoSession.title,
          startTime: videoSession.startTime,
          status: videoSession.status,
          thresholdCheckStatus: videoSession.thresholdCheckStatus,
          cancellationDeadline: videoSession.cancellationDeadline,
          attendanceCheckTime: videoSession.attendanceCheckTime
        }
      }
    });
  } catch (error) {
    console.error('Error getting attendance threshold analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/video-sessions/[id]/attendance-threshold - Check attendance threshold
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

    // Check if user has permission to manage this session
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: { instructor: true }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Only instructor, institution staff, or admin can check attendance threshold
    const canManage = 
      session.user.role === 'ADMIN' ||
      session.user.id === videoSession.instructorId ||
      (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId === videoSession.institutionId);

    if (!canManage) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check attendance threshold
    const checkResult = await LiveClassAttendanceService.checkAttendanceThreshold(sessionId);

    return NextResponse.json({
      success: true,
      data: checkResult
    });
  } catch (error) {
    console.error('Error checking attendance threshold:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/video-sessions/[id]/attendance-threshold - Update threshold settings
export async function PUT(
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

    // Check if user has permission to manage this session
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: { instructor: true }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Only instructor, institution staff, or admin can update threshold settings
    const canManage = 
      session.user.role === 'ADMIN' ||
      session.user.id === videoSession.instructorId ||
      (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId === videoSession.institutionId);

    if (!canManage) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate input
    const {
      minAttendanceThreshold,
      profitMarginThreshold,
      instructorHourlyRate,
      platformRevenuePerStudent,
      autoCancelIfBelowThreshold
    } = body;

    const updateData: any = {};

    if (typeof minAttendanceThreshold === 'number' && minAttendanceThreshold > 0) {
      updateData.minAttendanceThreshold = minAttendanceThreshold;
    }

    if (typeof profitMarginThreshold === 'number' && profitMarginThreshold > 0) {
      updateData.profitMarginThreshold = profitMarginThreshold;
    }

    if (typeof instructorHourlyRate === 'number' && instructorHourlyRate > 0) {
      updateData.instructorHourlyRate = instructorHourlyRate;
    }

    if (typeof platformRevenuePerStudent === 'number' && platformRevenuePerStudent > 0) {
      updateData.platformRevenuePerStudent = platformRevenuePerStudent;
    }

    if (typeof autoCancelIfBelowThreshold === 'boolean') {
      updateData.autoCancelIfBelowThreshold = autoCancelIfBelowThreshold;
    }

    // Update session
    const updatedSession = await prisma.videoSession.update({
      where: { id: sessionId },
      data: updateData
    });

    // Re-check attendance threshold with new settings
    const checkResult = await LiveClassAttendanceService.checkAttendanceThreshold(sessionId);

    return NextResponse.json({
      success: true,
      data: {
        session: updatedSession,
        checkResult
      }
    });
  } catch (error) {
    console.error('Error updating attendance threshold settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
