import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SubscriptionGovernanceService } from '@/lib/subscription-governance-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { sessionId, action } = await request.json();
    
    if (!sessionId || !action) {
      return NextResponse.json({ 
        error: 'Session ID and action are required' 
      }, { status: 400 });
    }
    
    if (!['join', 'leave'].includes(action)) {
      return NextResponse.json({ 
        error: 'Action must be either "join" or "leave"' 
      }, { status: 400 });
    }
    
    // Verify the session exists
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: sessionId }
    });
    
    if (!videoSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Get user's active subscription
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: session.user.id,
        status: 'ACTIVE'
      }
    });
    
    if (!subscription) {
      return NextResponse.json({ 
        error: 'No active subscription found' 
      }, { status: 402 });
    }
    
    if (action === 'join') {
      // Check if user can attend the session
      const attendanceCheck = await SubscriptionGovernanceService.canAttendLiveSession(
        session.user.id,
        sessionId
      );
      
      if (!attendanceCheck.canAttend) {
        return NextResponse.json({
          error: 'Cannot attend session',
          reason: attendanceCheck.reason,
          quotaInfo: attendanceCheck.quotaInfo
        }, { status: 402 });
      }
      
      // Record attendance with quota tracking
      const participant = await SubscriptionGovernanceService.recordLiveSessionAttendance(
        session.user.id,
        sessionId,
        subscription.id
      );
      
      return NextResponse.json({
        success: true,
        participant,
        message: 'Successfully joined session'
      });
      
    } else if (action === 'leave') {
      // Update participant record to mark as left
      const participant = await prisma.videoSessionParticipant.update({
        where: {
          sessionId_userId: {
            sessionId,
            userId: session.user.id
          }
        },
        data: {
          leftAt: new Date(),
          isActive: false
        }
      });
      
      return NextResponse.json({
        success: true,
        participant,
        message: 'Successfully left session'
      });
    }
    
  } catch (error) {
    console.error('Error handling live session attendance:', error);
    return NextResponse.json(
      { error: 'Failed to handle session attendance' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Check attendance eligibility
    const attendanceCheck = await SubscriptionGovernanceService.canAttendLiveSession(
      session.user.id,
      sessionId
    );
    
    return NextResponse.json({
      canAttend: attendanceCheck.canAttend,
      reason: attendanceCheck.reason,
      quotaInfo: attendanceCheck.quotaInfo
    });
    
  } catch (error) {
    console.error('Error checking attendance eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check attendance eligibility' },
      { status: 500 }
    );
  }
} 