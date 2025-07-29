'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Share, 
  Monitor,
  MessageSquare,
  Users,
  Settings,
  MonitorOff,
  Play,
  Square,
  Send,
  MoreVertical,
  Maximize,
  Minimize
} from 'lucide-react';
import { toast } from 'sonner';

interface VideoSessionInterfaceProps {
  sessionId: string;
  onLeave?: () => void;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  image?: string;
  isActive: boolean;
  role: 'INSTRUCTOR' | 'PARTICIPANT' | 'OBSERVER';
}

interface Message {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  content: string;
  messageType: string;
  timestamp: Date;
  isPrivate: boolean;
  recipientId?: string;
}

export function VideoSessionInterface({ sessionId, onLeave }: VideoSessionInterfaceProps) {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize video session
  useEffect(() => {
    if (!session?.user?.id) return;

    initializeVideoSession();
    return () => {
      cleanupVideoSession();
    };
  }, [session?.user?.id]);

  const initializeVideoSession = async () => {
    try {
      // Join video session via API
      const response = await fetch(`/api/video-sessions/${sessionId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join video session');
      }

      const data = await response.json();
      setIsConnected(true);

      // Initialize WebSocket connection
      initializeWebSocket();

      // Get local media stream
      await getLocalMediaStream();

      // Load initial data
      await loadParticipants();
      await loadMessages();

    } catch (error) {
      console.error('Failed to initialize video session:', error);
      toast.error('Failed to join video session');
    }
  };

  const initializeWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/socket`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        type: 'authenticate',
        userId: session?.user?.id
      }));
      
      socket.send(JSON.stringify({
        type: 'join_video_session',
        sessionId,
        userId: session?.user?.id
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socketRef.current = socket;
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'video_participant_joined':
        handleParticipantJoined(data);
        break;
      case 'video_participant_left':
        handleParticipantLeft(data);
        break;
      case 'video_message':
        handleNewMessage(data);
        break;
      case 'video_screen_share':
        handleScreenShare(data);
        break;
      case 'video_recording':
        handleRecording(data);
        break;
    }
  };

  const getLocalMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer connection
      initializePeerConnection(stream);

    } catch (error) {
      console.error('Failed to get local media stream:', error);
      toast.error('Failed to access camera/microphone');
    }
  };

  const initializePeerConnection = (stream: MediaStream) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      remoteStreamRef.current = event.streams[0];
    };

    peerConnectionRef.current = peerConnection;
  };

  const loadParticipants = async () => {
    try {
      const response = await fetch(`/api/video-sessions/${sessionId}/participants`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error('Failed to load participants:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/video-sessions/${sessionId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleParticipantJoined = (data: any) => {
    // Update participants list
    loadParticipants();
  };

  const handleParticipantLeft = (data: any) => {
    // Update participants list
    loadParticipants();
  };

  const handleNewMessage = (data: any) => {
    setMessages(prev => [...prev, data]);
  };

  const handleScreenShare = (data: any) => {
    setIsScreenSharing(data.isSharing);
  };

  const handleRecording = (data: any) => {
    setIsRecording(data.isRecording);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
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
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        
        // Notify other participants
        socketRef.current?.send(JSON.stringify({
          type: 'video_screen_share',
          sessionId,
          userId: session?.user?.id,
          isSharing: true
        }));
      } else {
        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        
        setIsScreenSharing(false);
        
        // Notify other participants
        socketRef.current?.send(JSON.stringify({
          type: 'video_screen_share',
          sessionId,
          userId: session?.user?.id,
          isSharing: false
        }));
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
      toast.error('Failed to toggle screen sharing');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Notify other participants
    socketRef.current?.send(JSON.stringify({
      type: 'video_recording',
      sessionId,
      userId: session?.user?.id,
      isRecording: !isRecording
    }));
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/video-sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'TEXT'
        }),
      });

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const leaveSession = async () => {
    try {
      await fetch(`/api/video-sessions/${sessionId}/leave`, {
        method: 'POST',
      });

      cleanupVideoSession();
      onLeave?.();
    } catch (error) {
      console.error('Failed to leave session:', error);
    }
  };

  const cleanupVideoSession = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Close WebSocket
    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsConnected(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-lg font-semibold">Video Session</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-300 text-sm">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-48 h-36">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-80 rounded-full p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className={`rounded-full ${isMuted ? 'bg-red-500 text-white' : 'text-white border-gray-600'}`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVideo}
                className={`rounded-full ${!isVideoEnabled ? 'bg-red-500 text-white' : 'text-white border-gray-600'}`}
              >
                {!isVideoEnabled ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleScreenShare}
                className={`rounded-full ${isScreenSharing ? 'bg-blue-500 text-white' : 'text-white border-gray-600'}`}
              >
                {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleRecording}
                className={`rounded-full ${isRecording ? 'bg-red-500 text-white' : 'text-white border-gray-600'}`}
              >
                {isRecording ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={leaveSession}
                className="rounded-full"
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 flex flex-col">
          {/* Participants */}
          {showParticipants && (
            <Card className="m-4">
              <CardHeader>
                <CardTitle className="text-white">Participants ({participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        {participant.image ? (
                          <img src={participant.image} alt={participant.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <span className="text-white text-sm">{participant.name[0]}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{participant.name}</p>
                        <p className="text-gray-400 text-xs">{participant.role}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${participant.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat */}
          {showChat && (
            <Card className="m-4 flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-white">Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex space-x-2">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{message.user.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{message.user.name}</p>
                        <p className="text-gray-300 text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white border-gray-600"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button size="sm" onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 