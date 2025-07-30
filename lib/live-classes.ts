import { prisma } from './prisma';
import { logger } from './logger';

export interface LiveClassData {
  id: string;
  title: string;
  description?: string;
  sessionType: 'GROUP' | 'ONE_ON_ONE' | 'WORKSHOP';
  language: string;
  level: string;
  maxParticipants: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  instructorId: string;
  institutionId?: string;
  courseId?: string;
  moduleId?: string;
  price: number;
  isPublic: boolean;
  isRecorded: boolean;
  allowChat: boolean;
  allowScreenShare: boolean;
  allowRecording: boolean;
}

export interface VideoProviderConfig {
  provider: 'ZOOM' | 'GOOGLE_MEET' | 'WEBRTC' | 'TWILIO';
  apiKey?: string;
  apiSecret?: string;
  accountId?: string;
  webhookSecret?: string;
}

export interface MeetingData {
  meetingId: string;
  meetingUrl: string;
  joinUrl: string;
  password?: string;
  hostKey?: string;
}

export class LiveClassesService {
  private static instance: LiveClassesService;
  private config: VideoProviderConfig;

  private constructor(config: VideoProviderConfig) {
    this.config = config;
  }

  public static getInstance(config?: VideoProviderConfig): LiveClassesService {
    if (!LiveClassesService.instance) {
      if (!config) {
        throw new Error('LiveClassesService requires configuration on first initialization');
      }
      LiveClassesService.instance = new LiveClassesService(config);
    }
    return LiveClassesService.instance;
  }

  /**
   * Create a new live class session
   */
  public async createLiveClass(data: LiveClassData): Promise<LiveClassData & { meetingData: MeetingData }> {
    try {
      // Create session in database
      const session = await prisma.videoSession.create({
        data: {
          id: data.id,
          title: data.title,
          description: data.description,
          sessionType: data.sessionType,
          language: data.language,
          level: data.level,
          maxParticipants: data.maxParticipants,
          startTime: data.startTime,
          endTime: data.endTime,
          duration: data.duration,
          instructorId: data.instructorId,
          institutionId: data.institutionId,
          courseId: data.courseId,
          moduleId: data.moduleId,
          price: data.price,
          isPublic: data.isPublic,
          isRecorded: data.isRecorded,
          allowChat: data.allowChat,
          allowScreenShare: data.allowScreenShare,
          allowRecording: data.allowRecording,
        }
      });

      // Create meeting with provider
      const meetingData = await this.createMeetingWithProvider(session);

      // Update session with meeting data
      await prisma.videoSession.update({
        where: { id: session.id },
        data: {
          meetingId: meetingData.meetingId,
          meetingUrl: meetingData.meetingUrl,
        }
      });

      return {
        ...session,
        meetingData
      };
    } catch (error) {
      logger.error('Failed to create live class session:', error);
      throw new Error('Failed to create live class session');
    }
  }

  /**
   * Create meeting with the configured provider
   */
  private async createMeetingWithProvider(session: any): Promise<MeetingData> {
    switch (this.config.provider) {
      case 'ZOOM':
        return this.createZoomMeeting(session);
      case 'GOOGLE_MEET':
        return this.createGoogleMeetMeeting(session);
      case 'WEBRTC':
        return this.createWebRTCMeeting(session);
      case 'TWILIO':
        return this.createTwilioMeeting(session);
      default:
        throw new Error(`Unsupported video provider: ${this.config.provider}`);
    }
  }

  /**
   * Create Zoom meeting
   */
  private async createZoomMeeting(session: any): Promise<MeetingData> {
    try {
      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: session.title,
          type: 2, // Scheduled meeting
          start_time: session.startTime.toISOString(),
          duration: session.duration,
          password: this.generateMeetingPassword(),
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            mute_upon_entry: false,
            watermark: false,
            use_pmi: false,
            approval_type: 0,
            audio: 'both',
            auto_recording: session.isRecorded ? 'cloud' : 'none',
            alternative_hosts: '',
            close_registration: false,
            waiting_room: false,
            meeting_authentication: false,
            encryption_type: 'enhanced_encryption',
            breakout_room: {
              enable: false
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Zoom API error: ${response.statusText}`);
      }

      const meeting = await response.json();

      return {
        meetingId: meeting.id.toString(),
        meetingUrl: meeting.join_url,
        joinUrl: meeting.join_url,
        password: meeting.password,
        hostKey: meeting.host_key
      };
    } catch (error) {
      logger.error('Failed to create Zoom meeting:', error);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  /**
   * Create Google Meet meeting
   */
  private async createGoogleMeetMeeting(session: any): Promise<MeetingData> {
    try {
      // For Google Meet, we typically use calendar events
      // This is a simplified implementation
      const meetingId = this.generateMeetingId();
      const meetingUrl = `https://meet.google.com/${meetingId}`;

      return {
        meetingId,
        meetingUrl,
        joinUrl: meetingUrl,
      };
    } catch (error) {
      logger.error('Failed to create Google Meet meeting:', error);
      throw new Error('Failed to create Google Meet meeting');
    }
  }

  /**
   * Create WebRTC meeting (self-hosted)
   */
  private async createWebRTCMeeting(session: any): Promise<MeetingData> {
    try {
      const meetingId = this.generateMeetingId();
      const meetingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/video-session/${meetingId}`;

      return {
        meetingId,
        meetingUrl,
        joinUrl: meetingUrl,
      };
    } catch (error) {
      logger.error('Failed to create WebRTC meeting:', error);
      throw new Error('Failed to create WebRTC meeting');
    }
  }

  /**
   * Create Twilio Video meeting
   */
  private async createTwilioMeeting(session: any): Promise<MeetingData> {
    try {
      const response = await fetch(`https://video.twilio.com/v1/Rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          UniqueName: session.id,
          Type: 'group',
          MaxParticipants: session.maxParticipants.toString(),
          RecordParticipantsOnConnect: session.isRecorded.toString(),
          MediaRegion: 'us1',
        })
      });

      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.statusText}`);
      }

      const room = await response.json();

      return {
        meetingId: room.sid,
        meetingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/video-session/${room.sid}`,
        joinUrl: `${process.env.NEXT_PUBLIC_APP_URL}/video-session/${room.sid}`,
      };
    } catch (error) {
      logger.error('Failed to create Twilio meeting:', error);
      throw new Error('Failed to create Twilio meeting');
    }
  }

  /**
   * Join a live class session
   */
  public async joinLiveClass(sessionId: string, userId: string): Promise<{
    session: any;
    participant: any;
    meetingData: MeetingData;
  }> {
    try {
      // Get session
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        include: {
          instructor: true,
          participants: {
            include: { user: true }
          }
        }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Check if user is already a participant
      let participant = await prisma.videoSessionParticipant.findUnique({
        where: {
          sessionId_userId: {
            sessionId,
            userId
          }
        }
      });

      // Create participant if not exists
      if (!participant) {
        participant = await prisma.videoSessionParticipant.create({
          data: {
            sessionId,
            userId,
            role: userId === session.instructorId ? 'INSTRUCTOR' : 'PARTICIPANT',
            joinedAt: new Date(),
            isActive: true,
          }
        });
      } else {
        // Update participant status
        await prisma.videoSessionParticipant.update({
          where: { id: participant.id },
          data: {
            joinedAt: new Date(),
            isActive: true,
            lastSeen: new Date(),
          }
        });
      }

      const meetingData: MeetingData = {
        meetingId: session.meetingId!,
        meetingUrl: session.meetingUrl!,
        joinUrl: session.meetingUrl!,
      };

      return { session, participant, meetingData };
    } catch (error) {
      logger.error('Failed to join live class session:', error);
      throw new Error('Failed to join live class session');
    }
  }

  /**
   * Leave a live class session
   */
  public async leaveLiveClass(sessionId: string, userId: string): Promise<void> {
    try {
      const participant = await prisma.videoSessionParticipant.findUnique({
        where: {
          sessionId_userId: {
            sessionId,
            userId
          }
        }
      });

      if (participant) {
        await prisma.videoSessionParticipant.update({
          where: { id: participant.id },
          data: {
            leftAt: new Date(),
            isActive: false,
            duration: participant.duration + Math.floor((Date.now() - participant.joinedAt!.getTime()) / 1000),
          }
        });
      }
    } catch (error) {
      logger.error('Failed to leave live class session:', error);
      throw new Error('Failed to leave live class session');
    }
  }

  /**
   * Get active participants for a session
   */
  public async getActiveParticipants(sessionId: string): Promise<any[]> {
    try {
      const participants = await prisma.videoSessionParticipant.findMany({
        where: {
          sessionId,
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          }
        }
      });

      return participants;
    } catch (error) {
      logger.error('Failed to get active participants:', error);
      throw new Error('Failed to get active participants');
    }
  }

  /**
   * Send message in live class session
   */
  public async sendMessage(sessionId: string, userId: string, content: string, messageType: string = 'TEXT', recipientId?: string): Promise<any> {
    try {
      const message = await prisma.videoSessionMessage.create({
        data: {
          sessionId,
          userId,
          content,
          messageType,
          recipientId,
          isPrivate: !!recipientId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          }
        }
      });

      return message;
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Get session messages
   */
  public async getSessionMessages(sessionId: string, limit: number = 50): Promise<any[]> {
    try {
      const messages = await prisma.videoSessionMessage.findMany({
        where: {
          sessionId,
          isPrivate: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit
      });

      return messages.reverse();
    } catch (error) {
      logger.error('Failed to get session messages:', error);
      throw new Error('Failed to get session messages');
    }
  }

  /**
   * Update session status
   */
  public async updateSessionStatus(sessionId: string, status: string): Promise<void> {
    try {
      await prisma.videoSession.update({
        where: { id: sessionId },
        data: { status }
      });
    } catch (error) {
      logger.error('Failed to update session status:', error);
      throw new Error('Failed to update session status');
    }
  }

  /**
   * Generate meeting password
   */
  private generateMeetingPassword(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Generate meeting ID
   */
  private generateMeetingId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
} 