'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  instructorId?: string;
  institutionId?: string;
  courseId?: string;
  // Additional display fields
  features?: string[];
  tags?: string[];
  materials?: string[];
  rating?: number;
  reviews?: number;
  currency?: string;
  price?: number; // Added price field
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  institution?: {
    id: string;
    name: string;
  } | null;
}

interface Institution {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  institution?: {
    id: string;
    name: string;
  } | null;
  // Extra fields for subscription-based platform courses
  requiresSubscription?: boolean;
  subscriptionTier?: string;
  institutionId?: string | null;
  isPlatformCourse?: boolean;
}

export default function AdminCreateLiveClassPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
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
    instructorId: '',
    institutionId: '',
    courseId: '',
    currency: 'USD',
    features: [],
    tags: [],
    materials: [],
    rating: undefined,
    reviews: 0,
    price: 0, // Initialize price
  });

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/admin/live-classes');
      return;
    }

    fetchInstructors(); // Fetch all instructors initially
    fetchInstitutions();
    fetchCourses();
  }, [session, router]);

  const fetchInstructors = async (institutionId?: string, courseId?: string) => {
    try {
      const params = new URLSearchParams();
      params.append('role', 'INSTRUCTOR');
      
      if (institutionId) {
        params.append('institutionId', institutionId);
      }
      
      if (courseId) {
        params.append('courseId', courseId);
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setInstructors(data.users || []);
      } else {
        console.error('Failed to fetch instructors:', response.status);
        setInstructors([]);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/admin/institutions');
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data || []);
      } else {
        console.error('Failed to fetch institutions:', response.status);
        setInstitutions([]);
      }
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setInstitutions([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
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

    // Refetch instructors when institution or course changes
    if (field === 'institutionId' || field === 'courseId') {
      const newInstitutionId = field === 'institutionId' ? value : formData.institutionId;
      const newCourseId = field === 'courseId' ? value : formData.courseId;
      
      // Clear instructor selection when context changes
      if (field === 'institutionId' || field === 'courseId') {
        setFormData(prev => ({
          ...prev,
          instructorId: ''
        }));
      }
      
      // Fetch instructors based on new context
      fetchInstructors(
        newInstitutionId === 'none' ? undefined : newInstitutionId,
        newCourseId === 'none' ? undefined : newCourseId
      );
    }
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

    if (!formData.instructorId) {
      toast.error('Instructor is required');
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
        // Handle empty values for optional fields
        instructorId: formData.instructorId || undefined,
        institutionId: formData.institutionId || null,
        courseId: formData.courseId || null,
        price: 0,
        currency: formData.currency || 'USD',
        features: formData.features,
        tags: formData.tags,
        materials: formData.materials,
        rating: formData.rating,
        reviews: formData.reviews,
      };

      console.log('Submitting session data:', sessionData);

      const response = await fetch('/api/admin/live-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to create live class (${response.status})`);
      }

      toast.success('Live class created successfully');
      router.push('/admin/live-classes');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create live class');
    } finally {
      setLoading(false);
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

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/live-classes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Live Class</h1>
            <p className="text-gray-600">
              Create platform-wide or institution-specific live class sessions (included in subscriptions)
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
                      {instructors.length === 0 ? (
                        <SelectItem value="no-instructors" disabled>
                          No instructors available for selected context
                        </SelectItem>
                      ) : (
                        instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.name} ({instructor.email})
                            {instructor.institution ? ` - ${instructor.institution.name}` : ' - Platform-wide'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {instructors.length === 0 && (
                    <p className="text-sm text-amber-600 mt-1">
                      No instructors available. Try selecting a different institution or course.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="institutionId">Institution</Label>
                  <Select value={formData.institutionId || "none"} onValueChange={(value) => handleInputChange('institutionId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform-wide (no institution)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Platform-wide (available to all subscribers)</SelectItem>
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
                  <Select value={formData.courseId || "none"} onValueChange={(value) => handleInputChange('courseId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific course</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} {course.institution ? `(${course.institution.name})` : '(Platform-wide)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Subscription plan hint when platform-wide and subscription-based */}
                  {(() => {
                    const selectedCourse = courses.find(c => c.id === formData.courseId);
                    const isPlatformWide = (formData.institutionId === 'none' || !formData.institutionId) && selectedCourse && (selectedCourse.institutionId === null || !selectedCourse.institutionId);
                    if (selectedCourse && isPlatformWide && selectedCourse.requiresSubscription) {
                      return (
                        <p className="mt-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
                          Subscription Plan: <strong>{selectedCourse.subscriptionTier || 'SUBSCRIPTION'}</strong> (price derives from course plan)
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <p><strong>Platform-wide classes:</strong> Available to all subscribers, not tied to any specific institution.</p>
                <p><strong>Institution classes:</strong> Only available to students enrolled in that specific institution.</p>
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
                  <h4 className="font-semibold text-blue-900 mb-2">Live Classes are included in subscriptions:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>BASIC</strong> ($12.99/month): No video conferencing</li>
                    <li>• <strong>PREMIUM</strong> ($24.99/month): Limited video sessions (2/month)</li>
                    <li>• <strong>PRO</strong> ($49.99/month): Unlimited video sessions</li>
                    <li>• <strong>Institutions</strong>: Video conferencing included in PROFESSIONAL and ENTERPRISE tiers</li>
                  </ul>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Platform-wide classes:</strong> Available to all subscribers based on their tier limits.</p>
                  <p><strong>Institution classes:</strong> Available to institution students based on their subscription tier.</p>
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
              {/* Display Settings for feature parity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price as any}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    disabled={formData.institutionId === 'none' && formData.courseId && formData.courseId !== 'none'}
                  />
                  {formData.institutionId === 'none' && formData.courseId && formData.courseId !== 'none' && (
                    <p className="text-xs text-gray-500 mt-1">Price is derived from the platform-wide subscription plan of the selected course.</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency || 'USD'} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating ?? ''}
                  onChange={(e) => handleInputChange('rating', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="reviews">Reviews</Label>
                <Input
                  id="reviews"
                  type="number"
                  min="0"
                  value={formData.reviews || 0}
                  onChange={(e) => handleInputChange('reviews', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Features (comma-separated)</Label>
                <Input
                  placeholder="Screen Sharing, Recording, Chat"
                  value={(formData.features || []).join(', ')}
                  onChange={(e) => handleInputChange('features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  placeholder="Beginner, Workshop"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
              <div>
                <Label>Materials (comma-separated)</Label>
                <Input
                  placeholder="PDF, Slides"
                  value={(formData.materials || []).join(', ')}
                  onChange={(e) => handleInputChange('materials', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
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

              {/* Breakout Rooms */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <Label htmlFor="breakoutRooms" className="text-base font-medium text-gray-900">
                    Breakout Rooms
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Enable small-group rooms during the session
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (formData.features || []).some(f => f.toLowerCase().includes('breakout'))
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {(formData.features || []).some(f => f.toLowerCase().includes('breakout')) ? 'ENABLED' : 'DISABLED'}
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
                    aria-label="Toggle breakout rooms"
                  />
                </div>
              </div>

              {/* File Sharing */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <Label htmlFor="fileSharing" className="text-base font-medium text-gray-900">
                    File Sharing
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Allow participants to share files during the session
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (formData.features || []).some(f => f.toLowerCase().includes('file'))
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {(formData.features || []).some(f => f.toLowerCase().includes('file')) ? 'ENABLED' : 'DISABLED'}
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
                    aria-label="Toggle file sharing"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/live-classes">
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