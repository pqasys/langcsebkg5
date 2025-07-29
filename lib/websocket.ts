import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export interface WebSocketMessage {
  type: 'notification' | 'course_update' | 'payment_update' | 'system_alert' | 'video_session_update' | 'video_participant_joined' | 'video_participant_left' | 'video_message' | 'video_screen_share' | 'video_recording_started' | 'video_recording_stopped';
  data: unknown;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

class WebSocketService {
  private static instance: WebSocketService;
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]
  private sessionParticipants: Map<string, Set<string>> = new Map(); // sessionId -> Set<userId>

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('🔌 WebSocket server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(` Client connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string }) => {
        try {
          // Store user-socket mapping
          const { userId } = data;
          if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, []);
          }
          this.userSockets.get(userId)!.push(socket.id);
          
          socket.data.userId = userId;
          socket.join(`user:${userId}`);
          
          console.log(` User ${userId} authenticated on socket ${socket.id}`);
          
          // Send any pending notifications
          await this.sendPendingNotifications(userId);
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('error', { message: 'Authentication failed' });
        }
      });

      // Handle user joining specific rooms (courses, institutions, etc.)
      socket.on('join_room', (data: { room: string }) => {
        socket.join(data.room);
        console.log(` Socket ${socket.id} joined room: ${data.room}`);
      });

      // Handle user leaving rooms
      socket.on('leave_room', (data: { room: string }) => {
        socket.leave(data.room);
        console.log(` Socket ${socket.id} left room: ${data.room}`);
      });

      // Video session specific handlers
      socket.on('join_video_session', async (data: { sessionId: string, userId: string }) => {
        try {
          const { sessionId, userId } = data;
          
          // Join video session room
          socket.join(`video_session:${sessionId}`);
          
          // Track participant
          if (!this.sessionParticipants.has(sessionId)) {
            this.sessionParticipants.set(sessionId, new Set());
          }
          this.sessionParticipants.get(sessionId)!.add(userId);
          
          // Notify other participants
          socket.to(`video_session:${sessionId}`).emit('video_participant_joined', {
            sessionId,
            userId,
            timestamp: new Date()
          });
          
          console.log(` User ${userId} joined video session ${sessionId}`);
        } catch (error) {
          console.error('Error joining video session:', error);
          socket.emit('error', { message: 'Failed to join video session' });
        }
      });

      socket.on('leave_video_session', async (data: { sessionId: string, userId: string }) => {
        try {
          const { sessionId, userId } = data;
          
          // Leave video session room
          socket.leave(`video_session:${sessionId}`);
          
          // Remove from participants
          const participants = this.sessionParticipants.get(sessionId);
          if (participants) {
            participants.delete(userId);
            if (participants.size === 0) {
              this.sessionParticipants.delete(sessionId);
            }
          }
          
          // Notify other participants
          socket.to(`video_session:${sessionId}`).emit('video_participant_left', {
            sessionId,
            userId,
            timestamp: new Date()
          });
          
          console.log(` User ${userId} left video session ${sessionId}`);
        } catch (error) {
          console.error('Error leaving video session:', error);
          socket.emit('error', { message: 'Failed to leave video session' });
        }
      });

      socket.on('video_message', async (data: { sessionId: string, userId: string, content: string, messageType?: string, recipientId?: string }) => {
        try {
          const { sessionId, userId, content, messageType, recipientId } = data;
          
          const message = {
            sessionId,
            userId,
            content,
            messageType: messageType || 'TEXT',
            recipientId,
            timestamp: new Date()
          };
          
          // Broadcast to session participants
          if (recipientId) {
            // Private message
            socket.to(`user:${recipientId}`).emit('video_private_message', message);
            socket.emit('video_private_message', message);
          } else {
            // Public message
            socket.to(`video_session:${sessionId}`).emit('video_message', message);
            socket.emit('video_message', message);
          }
          
          console.log(` Video message sent in session ${sessionId}`);
        } catch (error) {
          console.error('Error sending video message:', error);
          socket.emit('error', { message: 'Failed to send video message' });
        }
      });

      socket.on('video_screen_share', (data: { sessionId: string, userId: string, isSharing: boolean }) => {
        try {
          const { sessionId, userId, isSharing } = data;
          
          socket.to(`video_session:${sessionId}`).emit('video_screen_share', {
            sessionId,
            userId,
            isSharing,
            timestamp: new Date()
          });
          
          console.log(` Screen share ${isSharing ? 'started' : 'stopped'} by user ${userId} in session ${sessionId}`);
        } catch (error) {
          console.error('Error handling screen share:', error);
          socket.emit('error', { message: 'Failed to handle screen share' });
        }
      });

      socket.on('video_recording', (data: { sessionId: string, userId: string, isRecording: boolean }) => {
        try {
          const { sessionId, userId, isRecording } = data;
          
          socket.to(`video_session:${sessionId}`).emit('video_recording', {
            sessionId,
            userId,
            isRecording,
            timestamp: new Date()
          });
          
          console.log(` Recording ${isRecording ? 'started' : 'stopped'} by user ${userId} in session ${sessionId}`);
        } catch (error) {
          console.error('Error handling recording:', error);
          socket.emit('error', { message: 'Failed to handle recording' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const userId = socket.data.userId;
        if (userId) {
          const userSockets = this.userSockets.get(userId);
          if (userSockets) {
            const index = userSockets.indexOf(socket.id);
            if (index > -1) {
              userSockets.splice(index, 1);
            }
            if (userSockets.length === 0) {
              this.userSockets.delete(userId);
            }
          }
        }
        console.log(` Client disconnected: ${socket.id}`);
      });

      // Handle ping/pong for connection health
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // Send notification to specific user
  public async sendToUser(userId: string, message: WebSocketMessage) {
    if (!this.io) {
      // // // // // // // // // // // // console.warn('WebSocket server not initialized');
      return;
    }

    const userSockets = this.userSockets.get(userId);
    if (!userSockets || userSockets.length === 0) {
      console.log(`No active sockets for user ${userId}, storing for later`);
      await this.storePendingNotification(userId, message);
      return;
    }

    this.io.to(`user:${userId}`).emit('notification', message);
    console.log(`📨 Sent notification to user ${userId}:`, message.type);
  }

  // Send notification to all users in a room
  public sendToRoom(room: string, message: WebSocketMessage) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return;
    }

    this.io.to(room).emit('notification', message);
    console.log(`📨 Sent notification to room ${room}:`, message.type);
  }

  // Send notification to all connected users
  public broadcast(message: WebSocketMessage) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return;
    }

    this.io.emit('notification', message);
    console.log(`📨 Broadcasted notification:`, message.type);
  }

  // Send notification to users with specific roles
  public async sendToRole(role: string, message: WebSocketMessage) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return;
    }

    this.io.to(`role:${role}`).emit('notification', message);
    console.log(`📨 Sent notification to role ${role}:`, message.type);
  }

  // Send video session specific notifications
  public sendToVideoSession(sessionId: string, message: WebSocketMessage) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return;
    }

    this.io.to(`video_session:${sessionId}`).emit('video_session_update', message);
    console.log(`📨 Sent video session update to session ${sessionId}:`, message.type);
  }

  // Get active participants for a video session
  public getVideoSessionParticipants(sessionId: string): string[] {
    const participants = this.sessionParticipants.get(sessionId);
    return participants ? Array.from(participants) : [];
  }

  // Store pending notification for offline users
  private async storePendingNotification(userId: string, message: WebSocketMessage) {
    try {
      const { prisma } = await import('./prisma');
      
      await prisma.pendingWebSocketNotification.create({
        data: {
          userId,
          type: message.type,
          data: message.data,
          timestamp: message.timestamp,
        }
      });
    } catch (error) {
      console.error('Failed to store pending notification:', error);
    }
  }

  // Send pending notifications when user comes online
  private async sendPendingNotifications(userId: string) {
    try {
      const { prisma } = await import('./prisma');
      const { logger } = await import('./logger');
      
      const pendingNotifications = await prisma.pendingWebSocketNotification.findMany({
        where: {
          userId,
          sent: false
        },
        orderBy: {
          timestamp: 'asc'
        }
      });

      for (const notification of pendingNotifications) {
        const message: WebSocketMessage = {
          type: notification.type as any,
          data: notification.data,
          timestamp: notification.timestamp,
          userId
        };

        this.io?.to(`user:${userId}`).emit('notification', message);
        
        // Mark as sent
        await prisma.pendingWebSocketNotification.update({
          where: { id: notification.id },
          data: { sent: true, sentAt: new Date() }
        });
      }

      if (pendingNotifications.length > 0) {
        console.log(` Sent ${pendingNotifications.length} pending notifications to user ${userId}`);
      }
    } catch (error) {
      console.error('Failed to send pending notifications:', error);
    }
  }

  // Get connection statistics
  public getStats() {
    if (!this.io) return null;

    return {
      connectedClients: this.io.engine.clientsCount,
      activeUsers: this.userSockets.size,
      totalUserSockets: Array.from(this.userSockets.values()).reduce((sum, sockets) => sum + sockets.length, 0),
      activeVideoSessions: this.sessionParticipants.size,
      totalVideoParticipants: Array.from(this.sessionParticipants.values()).reduce((sum, participants) => sum + participants.size, 0)
    };
  }

  // Force disconnect a user
  public disconnectUser(userId: string) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        this.io?.sockets.sockets.get(socketId)?.disconnect();
      });
      this.userSockets.delete(userId);
      console.log(` Force disconnected user ${userId}`);
    }
  }
}

export const webSocketService = WebSocketService.getInstance();

// Helper function to send course-related notifications
export const sendCourseNotification = async (
  userId: string,
  courseId: string,
  type: 'enrollment' | 'update' | 'reminder' | 'completion',
  data: unknown
) => {
  const message: WebSocketMessage = {
    type: 'course_update',
    data: {
      courseId,
      notificationType: type,
      ...data
    },
    timestamp: new Date(),
    userId
  };

  await webSocketService.sendToUser(userId, message);
};

// Helper function to send payment notifications
export const sendPaymentNotification = async (
  userId: string,
  paymentId: string,
  type: 'confirmation' | 'failed' | 'pending' | 'refund',
  data: unknown
) => {
  const message: WebSocketMessage = {
    type: 'payment_update',
    data: {
      paymentId,
      notificationType: type,
      ...data
    },
    timestamp: new Date(),
    userId
  };

  await webSocketService.sendToUser(userId, message);
};

// Helper function to send system alerts
export const sendSystemAlert = async (
  userId: string,
  alertType: 'maintenance' | 'update' | 'security' | 'general',
  data: unknown
) => {
  const message: WebSocketMessage = {
    type: 'system_alert',
    data: {
      alertType,
      ...data
    },
    timestamp: new Date(),
    userId
  };

  await webSocketService.sendToUser(userId, message);
}; 