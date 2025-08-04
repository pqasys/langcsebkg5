# WebRTC Live Classroom Implementation

## Overview

This implementation provides a self-hosted WebRTC solution for live classroom functionality, replacing external meeting URLs with a fully integrated video conferencing system.

## Architecture

### **Frontend Components**
- **Live Class Session Page**: `app/student/live-classes/session/[id]/page.tsx`
- **WebRTC Client**: Handles peer connections, media streams, and signaling
- **Socket.IO Client**: Manages real-time communication with signaling server

### **Backend Components**
- **Custom Server**: `server.js` - Integrates Next.js with Socket.IO
- **Signaling Server**: `lib/websocket-server.ts` - Handles WebRTC signaling
- **Session Management**: Manages participants and room state

## Features

### **🎥 Video/Audio Communication**
- **Peer-to-Peer**: Direct connections between participants
- **Media Controls**: Mute/unmute audio, enable/disable video
- **Screen Sharing**: Share screen or specific applications
- **Multiple Participants**: Support for multiple students and instructors

### **💬 Real-time Chat**
- **Text Messaging**: Send and receive chat messages
- **System Messages**: Automatic notifications for join/leave events
- **Participant List**: Real-time participant status

### **🔧 Technical Features**
- **STUN Servers**: Google's public STUN servers for NAT traversal
- **ICE Candidates**: Automatic connection establishment
- **Session Management**: Proper cleanup and resource management
- **Error Handling**: Graceful fallbacks and error recovery

## Implementation Details

### **1. WebRTC Setup**

```typescript
// Initialize media stream
const stream = await navigator.mediaDevices.getUserMedia({
  video: isVideoEnabled,
  audio: isAudioEnabled
});

// Create peer connection
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
});
```

### **2. Signaling with Socket.IO**

```typescript
// Connect to signaling server
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

// Join session
socket.emit('join-session', {
  sessionId: liveClassId,
  userId: session?.user?.id,
  userName: session?.user?.name,
  isInstructor: false
});

// Handle WebRTC signaling
socket.on('offer', handleOffer);
socket.on('answer', handleAnswer);
socket.on('ice-candidate', handleIceCandidate);
```

### **3. Peer Connection Management**

```typescript
// Create peer connection for each participant
const createPeerConnection = async (userId: string) => {
  const pc = new RTCPeerConnection({ iceServers: [...] });
  
  // Add local stream tracks
  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
  });
  
  // Handle incoming streams
  pc.ontrack = (event) => {
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, event.streams[0]);
      return newMap;
    });
  };
  
  return pc;
};
```

## Setup Instructions

### **1. Install Dependencies**

```bash
npm install socket.io socket.io-client
```

### **2. Environment Configuration**

Add to `.env.local`:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### **3. Start Development Server**

```bash
npm run dev
```

The custom server will start both Next.js and the Socket.IO signaling server.

## Usage Flow

### **1. Student Joins Live Class**
1. Navigate to live classes page
2. Click "Join Early" or "Join Class" button
3. Grant camera/microphone permissions
4. Automatically connect to signaling server
5. Establish peer connections with other participants

### **2. Real-time Communication**
- **Video/Audio**: Automatically streams to all participants
- **Chat**: Send messages visible to all session participants
- **Screen Share**: Click screen share button to share screen
- **Controls**: Use media controls to mute/unmute, enable/disable video

### **3. Session Management**
- **Join/Leave**: Automatic participant list updates
- **Connection Status**: Real-time connection indicators
- **Error Recovery**: Automatic reconnection attempts

## Technical Considerations

### **STUN/TURN Servers**
- **Current**: Using Google's public STUN servers
- **Production**: Consider deploying your own STUN/TURN servers
- **Fallback**: Implement TURN servers for restrictive networks

### **Scalability**
- **Current**: Peer-to-peer connections (scales with participants)
- **Large Groups**: Consider SFU (Selective Forwarding Unit) for 10+ participants
- **Load Balancing**: Multiple signaling servers for high traffic

### **Security**
- **Authentication**: Session-based authentication required
- **Authorization**: Check enrollment before allowing join
- **Encryption**: WebRTC provides end-to-end encryption
- **Room Access**: Validate session membership

### **Performance**
- **Bandwidth**: Adaptive bitrate for different connections
- **CPU**: Optimize video encoding/decoding
- **Memory**: Proper cleanup of media streams and connections

## Browser Support

### **Required Features**
- **WebRTC**: RTCPeerConnection, getUserMedia
- **WebSocket**: Socket.IO client support
- **MediaDevices**: Camera and microphone access

### **Supported Browsers**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## Troubleshooting

### **Common Issues**

#### **1. Camera/Microphone Access**
```javascript
// Check permissions
navigator.permissions.query({ name: 'camera' }).then(result => {
  console.log('Camera permission:', result.state);
});
```

#### **2. Connection Issues**
```javascript
// Check STUN server connectivity
pc.oniceconnectionstatechange = () => {
  console.log('ICE connection state:', pc.iceConnectionState);
};
```

#### **3. Signaling Server**
```javascript
// Check Socket.IO connection
socket.on('connect', () => {
  console.log('Connected to signaling server');
});

socket.on('connect_error', (error) => {
  console.error('Signaling server error:', error);
});
```

### **Debug Mode**
Enable debug logging:
```javascript
// Socket.IO debug
localStorage.debug = '*';

// WebRTC debug
pc.onicecandidate = (event) => {
  console.log('ICE candidate:', event.candidate);
};
```

## Production Deployment

### **1. Environment Setup**
```env
NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
NODE_ENV=production
```

### **2. STUN/TURN Servers**
```javascript
const iceServers = [
  { urls: 'stun:stun.your-domain.com:3478' },
  { 
    urls: 'turn:turn.your-domain.com:3478',
    username: 'username',
    credential: 'password'
  }
];
```

### **3. Load Balancing**
- Deploy multiple signaling servers
- Use Redis for session state sharing
- Implement health checks and failover

### **4. Monitoring**
- Monitor WebRTC connection quality
- Track signaling server performance
- Log connection failures and errors

## Future Enhancements

### **1. Advanced Features**
- **Recording**: Server-side session recording
- **Whiteboard**: Collaborative drawing tools
- **File Sharing**: Real-time file transfer
- **Breakout Rooms**: Sub-group functionality

### **2. Performance Optimizations**
- **Adaptive Quality**: Dynamic video quality adjustment
- **Bandwidth Management**: Intelligent bitrate control
- **Connection Pooling**: Optimize peer connections

### **3. Analytics**
- **Session Metrics**: Duration, participation, quality
- **User Engagement**: Interaction patterns
- **Technical Metrics**: Connection quality, error rates

## Conclusion

This WebRTC implementation provides a complete, self-hosted solution for live classroom functionality. It offers real-time video/audio communication, chat, and screen sharing capabilities while maintaining security and scalability for production use.

The modular architecture allows for easy extension and customization, while the comprehensive error handling ensures a robust user experience across different network conditions and devices. 