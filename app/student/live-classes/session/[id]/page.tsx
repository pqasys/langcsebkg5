'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { io, Socket } from 'socket.io-client';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageCircle, 
  Send, 
  Users, 
  Share2, 
  Settings,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff
} from 'lucide-react';
import { format } from 'date-fns';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  sessionType: string;
  language: string;
  level: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  meetingUrl?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'USER' | 'SYSTEM';
}

interface Participant {
  id: string;
  name: string;
  isInstructor: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

export default function LiveClassSessionPage() {
  const { data: session } = useSession();
  const params = useParams();
  const liveClassId = params.id as string;

  // State management
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // Socket.IO connection
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchLiveClass();
  }, [liveClassId]);

  const fetchLiveClass = async () => {
    try {
      const response = await fetch(`/api/student/live-classes/${liveClassId}`);
      if (!response.ok) throw new Error('Failed to fetch live class');
      
      const data = await response.json();
      setLiveClass(data.liveClass);
    } catch (error) {
      setError('Failed to load live class');
      console.error('Error fetching live class:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize Socket.IO connection
      initializeSocket();

      // Join the session
      await joinSession();
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setError('Failed to access camera/microphone');
    }
  };

  const initializeSocket = () => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket']
    });
    
    socket.on('connect', () => {
      console.log('Socket.IO connected');
      socket.emit('join-session', {
        sessionId: liveClassId,
        userId: session?.user?.id,
        userName: session?.user?.name,
        isInstructor: false
      });
    });

    socket.on('user-joined', (data) => {
      handleUserJoined(data);
    });

    socket.on('user-left', (data) => {
      handleUserLeft(data);
    });

    socket.on('offer', (data) => {
      handleOffer(data);
    });

    socket.on('answer', (data) => {
      handleAnswer(data);
    });

    socket.on('ice-candidate', (data) => {
      handleIceCandidate(data);
    });

    socket.on('chat-message', (data) => {
      handleChatMessage(data);
    });

    socket.on('participants-update', (data) => {
      setParticipants(data.participants);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    socketRef.current = socket;
  };



  const handleUserJoined = async (data: any) => {
    const { userId, userName, isInstructor } = data;
    
    // Add to participants list
    setParticipants(prev => [...prev, {
      id: userId,
      name: userName,
      isInstructor,
      isAudioEnabled: true,
      isVideoEnabled: true,
      isScreenSharing: false
    }]);

    // Create peer connection for new user
    if (userId !== session?.user?.id) {
      await createPeerConnection(userId);
    }
  };

  const handleUserLeft = (data: any) => {
    const { userId } = data;
    
    // Remove from participants
    setParticipants(prev => prev.filter(p => p.id !== userId));
    
    // Close peer connection
    const pc = peerConnections.current.get(userId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(userId);
    }
    
    // Remove remote stream
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  };

  const createPeerConnection = async (userId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming streams
    pc.ontrack = (event) => {
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, event.streams[0]);
        return newMap;
      });
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          targetUserId: userId,
          candidate: event.candidate,
          sessionId: liveClassId
        });
      }
    };

    peerConnections.current.set(userId, pc);
    return pc;
  };

  const handleOffer = async (data: any) => {
    const { offer, fromUserId } = data;
    let pc = peerConnections.current.get(fromUserId);
    
    if (!pc) {
      pc = await createPeerConnection(fromUserId);
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (socketRef.current) {
      socketRef.current.emit('answer', {
        targetUserId: fromUserId,
        answer,
        sessionId: liveClassId
      });
    }
  };

  const handleAnswer = async (data: any) => {
    const { answer, fromUserId } = data;
    const pc = peerConnections.current.get(fromUserId);
    
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async (data: any) => {
    const { candidate, fromUserId } = data;
    const pc = peerConnections.current.get(fromUserId);
    
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleChatMessage = (data: any) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: data.userId,
      userName: data.userName,
      message: data.message,
      timestamp: new Date(),
      type: 'USER'
    };
    
    setChatMessages(prev => [...prev, newMessage]);
  };

  const joinSession = async () => {
    try {
      const response = await fetch('/api/student/live-classes/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liveClassId })
      });

      if (!response.ok) throw new Error('Failed to join session');
      
      setIsJoined(true);
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        message: `${session?.user?.name} joined the session`,
        timestamp: new Date(),
        type: 'SYSTEM'
      };
      setChatMessages([systemMessage]);
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Failed to join session');
    }
  };

  const sendChatMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('chat-message', {
      sessionId: liveClassId,
      message: newMessage.trim(),
      userId: session?.user?.id,
      userName: session?.user?.name
    });
    setNewMessage('');
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        // Replace video track
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = Array.from(peerConnections.current.values())[0]?.getSenders()
          .find(s => s.track?.kind === 'video');
        
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
        
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        const videoTrack = localStreamRef.current?.getVideoTracks()[0];
        const sender = Array.from(peerConnections.current.values())[0]?.getSenders()
          .find(s => s.track?.kind === 'video');
        
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const leaveSession = () => {
    // Close Socket.IO connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();

    setIsJoined(false);
  };

  if (!session?.user || session.user.role !== 'STUDENT') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Access denied. Student privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Loading live class session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !liveClass) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error || 'Live class not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-white text-lg font-semibold">{liveClass.title}</h1>
          <p className="text-gray-300 text-sm">
            {format(new Date(liveClass.startTime), 'MMM dd, yyyy HH:mm')} - {format(new Date(liveClass.endTime), 'HH:mm')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-600">
            {isJoined ? 'Connected' : 'Disconnected'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={leaveSession}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            Leave Session
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                  You {!isVideoEnabled && '(Camera Off)'}
                </div>
              </div>

              {/* Remote Videos */}
              {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
                const participant = participants.find(p => p.id === userId);
                return (
                  <div key={userId} className="relative bg-gray-800 rounded-lg overflow-hidden">
                    <video
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      ref={(el) => {
                        if (el) el.srcObject = stream;
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                      {participant?.name || 'Unknown'} {!participant?.isVideoEnabled && '(Camera Off)'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-4 flex justify-center space-x-4">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12 p-0"
            >
              {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12 p-0"
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "destructive" : "outline"}
              size="sm"
              onClick={toggleScreenShare}
              className="rounded-full w-12 h-12 p-0"
            >
              {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={leaveSession}
              className="rounded-full w-12 h-12 p-0"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 flex flex-col">
          {/* Participants */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-4 h-4 text-gray-300" />
              <h3 className="text-white font-medium">Participants ({participants.length})</h3>
            </div>
            <ScrollArea className="h-32">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-2 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">
                    {participant.name}
                    {participant.isInstructor && ' (Instructor)'}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-gray-300" />
                <h3 className="text-white font-medium">Chat</h3>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`text-sm ${message.type === 'SYSTEM' ? 'text-gray-400 italic' : 'text-white'}`}>
                    {message.type === 'USER' && (
                      <span className="font-medium text-blue-400">{message.userName}: </span>
                    )}
                    {message.message}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <Button size="sm" onClick={sendChatMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Button (if not joined) */}
      {!isJoined && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Join Live Class</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Click the button below to join the live class session.
              </p>
              <Button onClick={initializeWebRTC} className="w-full">
                Join Session
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 