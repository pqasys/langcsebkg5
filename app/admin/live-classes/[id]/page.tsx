'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Globe, 
  Video, 
  MessageSquare, 
  Share2, 
  Record,
  Building,
  BookOpen,
  User,
  Mail,
  Phone
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
  price: number;
  currency: string;
  status: string;
  isPublic: boolean;
  isRecorded: boolean;
  allowChat: boolean;
  allowScreenShare: boolean;
  allowRecording: boolean;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  institution?: {
    id: string;
    name: string;
  };
  course?: {
    id: string;
    title: string;
  };
  participants: Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    leftAt: string;
    isActive: boolean;
  }>;
  features?: any;
  tags?: string[];
  materials?: any;
  rating?: number;
  reviews?: any;
  isBooked: boolean;
  isCompleted: boolean;
  isCancelled: boolean;
}

export default function LiveClassViewPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchLiveClass(params.id as string);
    }
  }, [params.id]);

  const fetchLiveClass = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/live-classes/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch live class');
      }

      const data = await response.json();
      setLiveClass(data);
    } catch (error) {
      console.error('Error fetching live class:', error);
      setError('Failed to load live class details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      BEGINNER: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
      INTERMEDIATE: { color: 'bg-yellow-100 text-yellow-800', label: 'Intermediate' },
      ADVANCED: { color: 'bg-red-100 text-red-800', label: 'Advanced' },
    };

    const config = levelConfig[level as keyof typeof levelConfig] || { color: 'bg-gray-100 text-gray-800', label: level };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Access denied. Admin privileges required.</p>
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
            <p className="text-center text-gray-500">Loading live class details...</p>
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
            <div className="mt-4 text-center">
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{liveClass.title}</h1>
            <p className="text-gray-600">{liveClass.sessionType}</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/live-classes/${liveClass.id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{liveClass.title}</h3>
                <p className="text-gray-600 mt-2">{liveClass.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Language: {liveClass.language.toUpperCase()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Level: {getLevelBadge(liveClass.level)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {format(new Date(liveClass.startTime), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {format(new Date(liveClass.startTime), 'HH:mm')} - {format(new Date(liveClass.endTime), 'HH:mm')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Public Session</span>
                  </div>
                  <Badge variant={liveClass.isPublic ? "default" : "secondary"}>
                    {liveClass.isPublic ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                  <Badge variant={liveClass.isRecorded ? "default" : "secondary"}>
                    {liveClass.isRecorded ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Chat</span>
                  </div>
                  <Badge variant={liveClass.allowChat ? "default" : "secondary"}>
                    {liveClass.allowChat ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Screen Share</span>
                  </div>
                  <Badge variant={liveClass.allowScreenShare ? "default" : "secondary"}>
                    {liveClass.allowScreenShare ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Participants ({liveClass.participants.length}/{liveClass.maxParticipants})</CardTitle>
            </CardHeader>
            <CardContent>
              {liveClass.participants.length > 0 ? (
                <div className="space-y-3">
                  {liveClass.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">User ID: {participant.userId}</p>
                          <p className="text-sm text-gray-500">Role: {participant.role}</p>
                        </div>
                      </div>
                      <Badge variant={participant.isActive ? "default" : "secondary"}>
                        {participant.isActive ? "Active" : "Left"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No participants yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(liveClass.status)}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Price</span>
                <span className="font-semibold">
                  {liveClass.price} {liveClass.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Duration</span>
                <span className="text-sm">{liveClass.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Participants</span>
                <span className="text-sm">{liveClass.maxParticipants}</span>
              </div>
            </CardContent>
          </Card>

          {/* Instructor */}
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{liveClass.instructor.name}</p>
                  <p className="text-sm text-gray-500">{liveClass.instructor.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institution */}
          {liveClass.institution && (
            <Card>
              <CardHeader>
                <CardTitle>Institution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{liveClass.institution.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course */}
          {liveClass.course && (
            <Card>
              <CardHeader>
                <CardTitle>Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{liveClass.course.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 