# Video Conferencing Integration Setup Guide

This guide provides comprehensive instructions for implementing video conferencing functionality in your language learning platform.

## Overview

The video conferencing integration supports multiple providers:
- **WebRTC** (Self-hosted, recommended for development)
- **Zoom** (Production-ready, requires API keys)
- **Google Meet** (Calendar integration)
- **Twilio Video** (Enterprise-grade)

## Prerequisites

### 1. Database Migration

First, run the Prisma migration to add video session tables:

```bash
npx prisma migrate dev --name add_video_conferencing
npx prisma generate
```

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Video Conferencing Provider
VIDEO_PROVIDER=WEBRTC  # Options: WEBRTC, ZOOM, GOOGLE_MEET, TWILIO

# Zoom Configuration (if using Zoom)
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_WEBHOOK_SECRET=your_zoom_webhook_secret

# Twilio Configuration (if using Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_SECRET=your_twilio_api_secret

# Google Meet Configuration (if using Google Meet)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri

# WebRTC Configuration (if using WebRTC)
WEBRTC_ICE_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
```

## Provider Setup

### WebRTC (Recommended for Development)

WebRTC is the easiest to set up and doesn't require external API keys:

1. **No additional setup required**
2. **Works immediately** with the provided configuration
3. **Best for development and testing**

### Zoom Setup

1. **Create a Zoom App**:
   - Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
   - Click "Develop" → "Build App"
   - Choose "Meeting SDK" app type
   - Fill in app information

2. **Get API Credentials**:
   - Copy the API Key and API Secret
   - Add them to your environment variables

3. **Configure Webhooks** (Optional):
   - Set up webhook endpoints for meeting events
   - Add webhook secret to environment variables

### Twilio Video Setup

1. **Create Twilio Account**:
   - Sign up at [Twilio](https://www.twilio.com/)
   - Get Account SID and Auth Token

2. **Create Video API Key**:
   - Go to Twilio Console → Video
   - Create a new API key
   - Copy the API Key and API Secret

3. **Configure Environment**:
   - Add Twilio credentials to environment variables

### Google Meet Setup

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project

2. **Enable Google Calendar API**:
   - Go to APIs & Services → Library
   - Search for "Google Calendar API"
   - Enable the API

3. **Create OAuth 2.0 Credentials**:
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs

## API Endpoints

The following API endpoints are available:

### Create Video Session
```http
POST /api/video-sessions/create
Content-Type: application/json

{
  "title": "Spanish Conversation Practice",
  "description": "Practice speaking Spanish with native speakers",
  "sessionType": "GROUP",
  "language": "es",
  "level": "B1",
  "maxParticipants": 10,
  "startTime": "2024-01-15T14:00:00Z",
  "endTime": "2024-01-15T15:00:00Z",
  "duration": 60,
  "price": 0,
  "isPublic": false,
  "isRecorded": false,
  "allowChat": true,
  "allowScreenShare": true,
  "allowRecording": false
}
```

### Join Video Session
```http
POST /api/video-sessions/{sessionId}/join
```

### Leave Video Session
```http
POST /api/video-sessions/{sessionId}/leave
```

### Get Participants
```http
GET /api/video-sessions/{sessionId}/participants
```

### Send Message
```http
POST /api/video-sessions/{sessionId}/messages
Content-Type: application/json

{
  "content": "Hello everyone!",
  "messageType": "TEXT"
}
```

### Get Messages
```http
GET /api/video-sessions/{sessionId}/messages?limit=50
```

## WebSocket Events

The WebSocket connection handles real-time video session events:

### Client to Server Events
- `authenticate` - Authenticate user
- `join_video_session` - Join a video session
- `leave_video_session` - Leave a video session
- `video_message` - Send a message
- `video_screen_share` - Toggle screen sharing
- `video_recording` - Toggle recording

### Server to Client Events
- `video_participant_joined` - Participant joined
- `video_participant_left` - Participant left
- `video_message` - New message received
- `video_screen_share` - Screen share status
- `video_recording` - Recording status

## React Components

### VideoSessionInterface
Main video conferencing interface with:
- WebRTC video/audio streams
- Screen sharing
- Chat functionality
- Participant list
- Recording controls

### VideoSessionCreator
Form for creating new video sessions with:
- Session configuration
- Scheduling
- Participant limits
- Privacy settings

## Usage Examples

### Creating a Video Session
```typescript
import { VideoSessionCreator } from '@/components/video/VideoSessionCreator';

function CreateSessionPage() {
  return (
    <VideoSessionCreator
      onSessionCreated={(sessionId) => {
        router.push(`/video-session/${sessionId}`);
      }}
      courseId="course-123"
      institutionId="institution-456"
    />
  );
}
```

### Joining a Video Session
```typescript
import { VideoSessionInterface } from '@/components/video/VideoSessionInterface';

function VideoSessionPage({ params }: { params: { id: string } }) {
  return (
    <VideoSessionInterface
      sessionId={params.id}
      onLeave={() => router.push('/dashboard')}
    />
  );
}
```

## Security Considerations

### Authentication
- All video session endpoints require authentication
- Users can only join sessions they're authorized for
- Private sessions require explicit invitation

### Privacy
- Video streams are encrypted end-to-end
- Chat messages are stored securely
- Recording requires explicit consent

### Rate Limiting
- Implement rate limiting on video session creation
- Limit concurrent sessions per user
- Monitor for abuse

## Performance Optimization

### WebRTC Optimization
- Use TURN servers for NAT traversal
- Implement adaptive bitrate
- Optimize video quality based on connection

### Scalability
- Use Redis for session state management
- Implement horizontal scaling for WebSocket servers
- Use CDN for video recordings

## Monitoring and Analytics

### Key Metrics
- Session duration
- Participant engagement
- Video quality metrics
- Chat activity
- Recording usage

### Error Tracking
- Connection failures
- Media access issues
- WebSocket disconnections
- API errors

## Troubleshooting

### Common Issues

1. **Camera/Microphone Access**
   - Ensure HTTPS in production
   - Check browser permissions
   - Test with different browsers

2. **WebRTC Connection Issues**
   - Check firewall settings
   - Verify STUN/TURN server configuration
   - Test network connectivity

3. **Zoom API Errors**
   - Verify API credentials
   - Check rate limits
   - Ensure webhook configuration

4. **Database Errors**
   - Run Prisma migrations
   - Check database connectivity
   - Verify schema changes

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_VIDEO_CONFERENCING=true
```

## Production Deployment

### Recommended Setup
1. **Use Zoom or Twilio** for production
2. **Implement proper monitoring**
3. **Set up backup providers**
4. **Configure CDN for recordings**
5. **Implement proper error handling**

### Scaling Considerations
- Use load balancers for WebSocket servers
- Implement session persistence
- Set up auto-scaling
- Monitor resource usage

## Cost Considerations

### Provider Costs
- **WebRTC**: Free (self-hosted)
- **Zoom**: Pay-per-use or subscription
- **Twilio**: Pay-per-minute
- **Google Meet**: Free with Google Workspace

### Infrastructure Costs
- WebSocket server hosting
- Database storage for sessions
- CDN for recordings
- Monitoring and analytics

## Future Enhancements

### Planned Features
- Breakout rooms
- Whiteboard collaboration
- File sharing
- Advanced analytics
- Mobile app support
- AI-powered features

### Integration Opportunities
- Calendar integration
- LMS integration
- Payment processing
- Analytics platforms
- CRM systems

## Support

For technical support:
1. Check the troubleshooting section
2. Review error logs
3. Test with different providers
4. Contact development team

## Contributing

To contribute to video conferencing features:
1. Follow the existing code structure
2. Add comprehensive tests
3. Update documentation
4. Follow security best practices 