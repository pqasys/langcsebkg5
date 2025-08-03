'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Instructor {
  id: string;
  name: string;
  email: string;
}

interface Institution {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
}

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
  isPublic: boolean;
  isRecorded: boolean;
  allowChat: boolean;
  allowScreenShare: boolean;
  allowRecording: boolean;
  instructorId: string;
  institutionId?: string;
  courseId?: string;
  moduleId?: string;
}

export default function EditLiveClassPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<LiveClass>({
    id: '',
    title: '',
    description: '',
    sessionType: '',
    language: '',
    level: '',
    startTime: '',
    endTime: '',
    duration: 60,
    maxParticipants: 10,
    price: 0,
    currency: 'USD',
    isPublic: false,
    isRecorded: false,
    allowChat: true,
    allowScreenShare: true,
    allowRecording: false,
    instructorId: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchLiveClass(params.id as string);
      fetchInstructors();
      fetchInstitutions();
      fetchCourses();
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
      
      // Convert dates to local datetime-local format
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      
      setFormData({
        ...data,
        startTime: startTime.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
        institutionId: data.institutionId || 'platform',
        courseId: data.courseId || 'no-course',
      });
    } catch (error) {
      console.error('Error fetching live class:', error);
      toast.error('Failed to load live class details');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/admin/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data.instructors || []);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/admin/institutions');
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data.institutions || []);
      }
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (field: keyof LiveClass, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.instructorId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const sessionData = {
        ...formData,
        instructorId: formData.instructorId || undefined,
        institutionId: formData.institutionId || undefined,
        courseId: formData.courseId || undefined,
        moduleId: formData.moduleId || undefined,
      };

      console.log('Submitting session data:', sessionData);

      const response = await fetch(`/api/admin/live-classes/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to update live class (${response.status})`);
      }

      toast.success('Live class updated successfully!');
      router.push('/admin/live-classes');
    } catch (error) {
      console.error('Error updating live class:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update live class');
    } finally {
      setSaving(false);
    }
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
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p>Loading live class details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Live Class</h1>
          <p className="text-gray-600">Update live class details and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter class title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sessionType">Session Type</Label>
                <Select value={formData.sessionType} onValueChange={(value) => handleInputChange('sessionType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LECTURE">Lecture</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="CONVERSATION">Conversation</SelectItem>
                    <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                    <SelectItem value="PRACTICE">Practice Session</SelectItem>
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
                placeholder="Enter class description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
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
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  min="15"
                  max="480"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="instructorId">Instructor *</Label>
                <Select value={formData.instructorId} onValueChange={(value) => handleInputChange('instructorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.length > 0 ? (
                      instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name} ({instructor.email})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-instructors" disabled>
                        No instructors available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="institutionId">Institution</Label>
                <Select value={formData.institutionId || 'platform'} onValueChange={(value) => handleInputChange('institutionId', value === 'platform' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform">Platform (No Institution)</SelectItem>
                    {institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="courseId">Course</Label>
                <Select value={formData.courseId || 'no-course'} onValueChange={(value) => handleInputChange('courseId', value === 'no-course' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-course">No Course</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Session Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="isPublic" className="text-base font-medium text-gray-900">
                  Public Session
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Allow anyone to see and join this session
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.isPublic 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {formData.isPublic ? 'ON' : 'OFF'}
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                  aria-label="Toggle public session"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="isRecorded" className="text-base font-medium text-gray-900">
                  Record Session
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Automatically record the session for later viewing
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.isRecorded 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {formData.isRecorded ? 'ON' : 'OFF'}
                </div>
                <Switch
                  id="isRecorded"
                  checked={formData.isRecorded}
                  onCheckedChange={(checked) => handleInputChange('isRecorded', checked)}
                  aria-label="Toggle session recording"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="allowChat" className="text-base font-medium text-gray-900">
                  Allow Chat
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Enable text chat during the session
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.allowChat 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {formData.allowChat ? 'ENABLED' : 'DISABLED'}
                </div>
                <Switch
                  id="allowChat"
                  checked={formData.allowChat}
                  onCheckedChange={(checked) => handleInputChange('allowChat', checked)}
                  aria-label="Toggle chat functionality"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="allowScreenShare" className="text-base font-medium text-gray-900">
                  Allow Screen Sharing
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Enable screen sharing for participants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.allowScreenShare 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {formData.allowScreenShare ? 'ENABLED' : 'DISABLED'}
                </div>
                <Switch
                  id="allowScreenShare"
                  checked={formData.allowScreenShare}
                  onCheckedChange={(checked) => handleInputChange('allowScreenShare', checked)}
                  aria-label="Toggle screen sharing functionality"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="allowRecording" className="text-base font-medium text-gray-900">
                  Allow Participant Recording
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Allow participants to record their own sessions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.allowRecording 
                    ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {formData.allowRecording ? 'ALLOWED' : 'BLOCKED'}
                </div>
                <Switch
                  id="allowRecording"
                  checked={formData.allowRecording}
                  onCheckedChange={(checked) => handleInputChange('allowRecording', checked)}
                  aria-label="Toggle participant recording functionality"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Live Class
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 