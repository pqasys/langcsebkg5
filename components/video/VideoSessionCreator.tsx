'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Users, Video, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface VideoSessionCreatorProps {
  onSessionCreated?: (sessionId: string) => void;
  onCancel?: () => void;
  courseId?: string;
  moduleId?: string;
  institutionId?: string;
}

export function VideoSessionCreator({ 
  onSessionCreated, 
  onCancel, 
  courseId, 
  moduleId, 
  institutionId 
}: VideoSessionCreatorProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sessionType: 'GROUP' as 'GROUP' | 'ONE_ON_ONE' | 'WORKSHOP',
    language: 'en',
    level: 'B1',
    maxParticipants: 10,
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    duration: 60,
    price: 0,
    isPublic: false,
    isRecorded: false,
    allowChat: true,
    allowScreenShare: true,
    allowRecording: false,
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
  ];

  const levels = [
    { code: 'A1', name: 'Beginner (A1)' },
    { code: 'A2', name: 'Elementary (A2)' },
    { code: 'B1', name: 'Intermediate (B1)' },
    { code: 'B2', name: 'Upper Intermediate (B2)' },
    { code: 'C1', name: 'Advanced (C1)' },
    { code: 'C2', name: 'Proficient (C2)' },
  ];

  const sessionTypes = [
    { code: 'GROUP', name: 'Group Session', description: 'Multiple participants learning together' },
    { code: 'ONE_ON_ONE', name: 'One-on-One', description: 'Individual tutoring session' },
    { code: 'WORKSHOP', name: 'Workshop', description: 'Interactive workshop with activities' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDurationChange = (duration: number) => {
    const startTime = formData.startTime;
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    setFormData(prev => ({
      ...prev,
      duration,
      endTime
    }));
  };

  const handleStartTimeChange = (date: Date) => {
    const endTime = new Date(date.getTime() + formData.duration * 60 * 1000);
    
    setFormData(prev => ({
      ...prev,
      startTime: date,
      endTime
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a session title');
      return false;
    }

    if (formData.startTime <= new Date()) {
      toast.error('Start time must be in the future');
      return false;
    }

    if (formData.maxParticipants < 1) {
      toast.error('Maximum participants must be at least 1');
      return false;
    }

    if (formData.duration < 15) {
      toast.error('Session duration must be at least 15 minutes');
      return false;
    }

    return true;
  };

  const createSession = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/video-sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          courseId,
          moduleId,
          institutionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create video session');
      }

      const data = await response.json();
      toast.success('Video session created successfully!');
      
      onSessionCreated?.(data.session.id);
      
      // Navigate to the video session
      router.push(`/video-session/${data.session.id}`);
      
    } catch (error) {
      console.error('Failed to create video session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create video session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Create Video Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter session title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter session description"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sessionType">Session Type</Label>
                <Select
                  value={formData.sessionType}
                  onValueChange={(value) => handleInputChange('sessionType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTypes.map((type) => (
                      <SelectItem key={type.code} value={type.code}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange('level', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.code} value={level.code}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Scheduling</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.startTime, 'PPP p')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startTime}
                      onSelect={(date) => date && handleStartTimeChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="480"
                  value={formData.duration}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>End Time</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {format(formData.endTime, 'PPP p')}
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Participants</span>
            </h3>

            <div>
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Session</Label>
                  <p className="text-sm text-gray-500">Allow anyone to join</p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Record Session</Label>
                  <p className="text-sm text-gray-500">Automatically record the session</p>
                </div>
                <Switch
                  checked={formData.isRecorded}
                  onCheckedChange={(checked) => handleInputChange('isRecorded', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Chat</Label>
                  <p className="text-sm text-gray-500">Enable chat during session</p>
                </div>
                <Switch
                  checked={formData.allowChat}
                  onCheckedChange={(checked) => handleInputChange('allowChat', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Screen Share</Label>
                  <p className="text-sm text-gray-500">Enable screen sharing</p>
                </div>
                <Switch
                  checked={formData.allowScreenShare}
                  onCheckedChange={(checked) => handleInputChange('allowScreenShare', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Recording</Label>
                  <p className="text-sm text-gray-500">Allow participants to record</p>
                </div>
                <Switch
                  checked={formData.allowRecording}
                  onCheckedChange={(checked) => handleInputChange('allowRecording', checked)}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className="mt-1"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={createSession}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Session'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 