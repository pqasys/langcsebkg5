const { Server: SocketIOServer } = require('socket.io');

class WebRTCSignalingServer {
  constructor() {
    this.io = null;
    this.sessions = new Map();
  }

  initialize(server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3001",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join session
      socket.on('join-session', async (data) => {
        const { sessionId, userId, userName, isInstructor } = data;
        
        // Join socket room
        socket.join(sessionId);
        
        // Add to session participants
        if (!this.sessions.has(sessionId)) {
          this.sessions.set(sessionId, {
            id: sessionId,
            participants: new Map()
          });
        }
        
        const session = this.sessions.get(sessionId);
        const participant = {
          id: userId,
          name: userName,
          isInstructor,
          socketId: socket.id
        };
        
        session.participants.set(userId, participant);
        
        // Notify others in the session
        socket.to(sessionId).emit('user-joined', {
          userId,
          userName,
          isInstructor
        });
        
        // Send current participants to the new user
        const participants = Array.from(session.participants.values());
        socket.emit('participants-update', { participants });
        
        console.log(`User ${userName} joined session ${sessionId}`);
      });

      // WebRTC signaling
      socket.on('offer', (data) => {
        const { targetUserId, offer, sessionId } = data;
        const session = this.sessions.get(sessionId);
        const targetParticipant = session?.participants.get(targetUserId);
        
        if (targetParticipant) {
          socket.to(targetParticipant.socketId).emit('offer', {
            offer,
            fromUserId: data.userId
          });
        }
      });

      socket.on('answer', (data) => {
        const { targetUserId, answer, sessionId } = data;
        const session = this.sessions.get(sessionId);
        const targetParticipant = session?.participants.get(targetUserId);
        
        if (targetParticipant) {
          socket.to(targetParticipant.socketId).emit('answer', {
            answer,
            fromUserId: data.userId
          });
        }
      });

      socket.on('ice-candidate', (data) => {
        const { targetUserId, candidate, sessionId } = data;
        const session = this.sessions.get(sessionId);
        const targetParticipant = session?.participants.get(targetUserId);
        
        if (targetParticipant) {
          socket.to(targetParticipant.socketId).emit('ice-candidate', {
            candidate,
            fromUserId: data.userId
          });
        }
      });

      // Chat messages
      socket.on('chat-message', (data) => {
        const { sessionId, message, userId, userName } = data;
        socket.to(sessionId).emit('chat-message', {
          message,
          userId,
          userName,
          timestamp: new Date()
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Remove user from all sessions
        for (const [sessionId, session] of this.sessions) {
          for (const [userId, participant] of session.participants) {
            if (participant.socketId === socket.id) {
              session.participants.delete(userId);
              
              // Notify others
              socket.to(sessionId).emit('user-left', {
                userId,
                userName: participant.name
              });
              
              // Update participants list
              const participants = Array.from(session.participants.values());
              socket.to(sessionId).emit('participants-update', { participants });
              
              console.log(`User ${participant.name} left session ${sessionId}`);
              break;
            }
          }
        }
      });
    });

    console.log('WebRTC signaling server initialized');
  }

  getIO() {
    return this.io;
  }
}

// Singleton instance
let signalingServer = null;

function getSignalingServer() {
  if (!signalingServer) {
    signalingServer = new WebRTCSignalingServer();
  }
  return signalingServer;
}

function initializeSignalingServer(server) {
  const signalingServer = getSignalingServer();
  signalingServer.initialize(server);
}

module.exports = {
  WebRTCSignalingServer,
  getSignalingServer,
  initializeSignalingServer
}; 