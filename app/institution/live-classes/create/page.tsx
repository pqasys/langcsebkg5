'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Users, Video, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LiveClassFormData {
  title: string;
  description: string;
  sessionType: string;
  language: string;
  level: string;
  maxParticipants: number;
  startTime: string;
  endTime: string;
  isPublic: boolean;
  isRecorded: boolean;
  allowChat: boolean;
  allowScreenShare: boolean;
  allowRecording: boolean;
  courseId?: string;
  moduleId?: string;
  features?: string[];
}

interface Course {
  id: string;
  title: string;
}

export default function InstitutionCreateLiveClassPage() {
  const { data: session } = useSession();
  const { userType, canAccessLiveClasses } = useSubscription();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<LiveClassFormData>({
    title: '',
    description: '',
    sessionType: 'GROUP',
    language: 'en',
    level: 'BEGINNER',
    maxParticipants: 10,
    startTime: '',
    endTime: '',
    isPublic: true,
    isRecorded: false,
    allowChat: true,
    allowScreenShare: true,
    allowRecording: false,
    courseId: '',
    moduleId: '',
    features: [],
  });

  useEffect(() => {
    if (userType !== 'INSTITUTION_STAFF') {
      toast.error('Only institution staff can create video sessions');
      router.push('/institution/live-classes');
      return;
    }

    fetchCourses();
  }, [userType, router]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/institution/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        console.error('Failed to fetch courses:', response.status);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const handleInputChange = (field: keyof LiveClassFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins;
    }
    return 0;
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error('Start and end times are required');
      return false;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    const now = new Date();

    if (startTime <= now) {
      toast.error('Start time must be in the future');
      return false;
    }

    if (endTime <= startTime) {
      toast.error('End time must be after start time');
      return false;
    }

    if (formData.maxParticipants < 1 || formData.maxParticipants > 100) {
      toast.error('Maximum participants must be between 1 and 100');
      return false;
    }

    if (formData.price < 0) {
      toast.error('Price cannot be negative');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const duration = calculateDuration();
      const sessionData = {
        ...formData,
        duration,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: 0, // Live classes are free for subscribers
        currency: 'USD', // Default currency
      };

      const response = await fetch('/api/institution/live-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create live class');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Live class created successfully');
        router.push('/institution/live-classes');
      } else {
        throw new Error(data.error || 'Failed to create live class');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create live class');
    } finally {
      setLoading(false);
    }
  };

  if (userType !== 'INSTITUTION_STAFF') {
    return (
      <div className="text-center py-12">
        <Video className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          Only institution staff can create video sessions.
        </p>
        <div className="mt-6">
          <Link href="/institution/live-classes">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Live Classes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/institution/live-classes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Live Class</h1>
            <p className="text-gray-600">
              Create a new live class session for your institution (included in subscriptions)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Session Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter session title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sessionType">Session Type *</Label>
                  <Select value={formData.sessionType} onValueChange={(value) => handleInputChange('sessionType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GROUP">Group Session</SelectItem>
                      <SelectItem value="PRIVATE">Private Session</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter session description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxParticipants">Max Participants *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Course Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="courseId">Course</Label>
                <Select value={formData.courseId} onValueChange={(value) => handleInputChange('courseId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>

              {formData.startTime && formData.endTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Duration: {calculateDuration()} minutes
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Access */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Live Classes are included in institution subscriptions:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>STARTER</strong> ($99/month): Basic video conferencing</li>
                    <li>• <strong>PROFESSIONAL</strong> ($299/month): Advanced video conferencing with module integration</li>
                    <li>• <strong>ENTERPRISE</strong> ($799/month): Unlimited video conferencing with all features</li>
                  </ul>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Institution classes:</strong> Available to institution students based on their subscription tier.</p>
                  <p><strong>Access control:</strong> Students must be enrolled in this institution to join.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublic">Public Session</Label>
                  <p className="text-sm text-gray-500">
                    Allow anyone to see and join this session
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isRecorded">Record Session</Label>
                  <p className="text-sm text-gray-500">
                    Automatically record the session for later viewing
                  </p>
                </div>
                <Switch
                  id="isRecorded"
                  checked={formData.isRecorded}
                  onCheckedChange={(checked) => handleInputChange('isRecorded', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowChat">Allow Chat</Label>
                  <p className="text-sm text-gray-500">
                    Enable text chat during the session
                  </p>
                </div>
                <Switch
                  id="allowChat"
                  checked={formData.allowChat}
                  onCheckedChange={(checked) => handleInputChange('allowChat', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowScreenShare">Allow Screen Sharing</Label>
                  <p className="text-sm text-gray-500">
                    Enable screen sharing for participants
                  </p>
                </div>
                <Switch
                  id="allowScreenShare"
                  checked={formData.allowScreenShare}
                  onCheckedChange={(checked) => handleInputChange('allowScreenShare', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowRecording">Allow Participant Recording</Label>
                  <p className="text-sm text-gray-500">
                    Allow participants to record their own sessions
                  </p>
                </div>
                <Switch
                  id="allowRecording"
                  checked={formData.allowRecording}
                  onCheckedChange={(checked) => handleInputChange('allowRecording', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="breakoutRooms">Breakout Rooms</Label>
                  <p className="text-sm text-gray-500">
                    Enable small-group rooms during the session
                  </p>
                </div>
                <Switch
                  id="breakoutRooms"
                  checked={(formData.features || []).some(f => f.toLowerCase().includes('breakout'))}
                  onCheckedChange={(checked) => {
                    const current = formData.features || [];
                    const next = checked
                      ? Array.from(new Set([...current, 'Breakout Rooms']))
                      : current.filter(f => f.toLowerCase() !== 'breakout rooms' && !/breakout/i.test(f));
                    handleInputChange('features', next);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fileSharing">File Sharing</Label>
                  <p className="text-sm text-gray-500">
                    Allow participants to share files during the session
                  </p>
                </div>
                <Switch
                  id="fileSharing"
                  checked={(formData.features || []).some(f => f.toLowerCase().includes('file'))}
                  onCheckedChange={(checked) => {
                    const current = formData.features || [];
                    const next = checked
                      ? Array.from(new Set([...current, 'File Sharing']))
                      : current.filter(f => f.toLowerCase() !== 'file sharing' && !/file\s*sharing/i.test(f) && !/file/i.test(f));
                    handleInputChange('features', next);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/institution/live-classes">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Creating...' : 'Create Live Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 