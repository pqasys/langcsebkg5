'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { 
  User,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  Edit,
  Globe,
  Languages,
  Target,
  Heart,
  Eye,
  Globe2,
  Link,
  Share2
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface StudentDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
  enrolledCourses: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: 'in_progress' | 'completed' | 'dropped';
    progress: number;
  }[];
  completedCourses: {
    id: string;
    name: string;
    completionDate: string;
    status: string;
  }[];
  // Additional student information
  bio?: string;
  native_language?: string;
  spoken_languages?: string[];
  learning_goals?: string;
  interests?: string[];
  social_visibility?: string;
  timezone?: string;
  date_of_birth?: string;
  gender?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, string>;
}

interface EnrollmentDates {
  startDate: string;
  endDate: string;
}

interface EnrollmentModification {
  id: string;
  dates: EnrollmentDates;
  reason: string;
  notes: string;
  confirmed: boolean;
}

export default function StudentDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingEnrollment, setEditingEnrollment] = useState<EnrollmentModification | null>(null);
  const [savingDates, setSavingDates] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  useEffect(() => {
    if (status === 'loading') {
      return; // Wait for session to load
    }

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (!session?.user?.role || (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN')) {
      router.push('/dashboard');
      return;
    }

    fetchStudentDetails();
  }, [session, status, params.id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/students/${params.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch student details - Context: throw new Error('Failed to fetch student details')...`);
      }
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load student details. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  const validateDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid date format';
    }

    if (start < today) {
      return 'Start date cannot be in the past';
    }

    if (end < today) {
      return 'End date cannot be in the past';
    }

    if (start >= end) {
      return 'End date must be after start date';
    }

    return null;
  };

  const handleDateChange = (field: keyof EnrollmentDates, value: string) => {
    if (!editingEnrollment?.dates) return;

    const newDates = {
      ...editingEnrollment.dates,
      [field]: value,
    };
    
    const error = validateDates(newDates.startDate, newDates.endDate);
    setDateError(error);

    // Check if dates have changed from original
    const originalStartDate = new Date(student?.enrolledCourses.find(c => c.id === editingEnrollment.id)?.start_date || '').toISOString().split('T')[0];
    const originalEndDate = new Date(student?.enrolledCourses.find(c => c.id === editingEnrollment.id)?.end_date || '').toISOString().split('T')[0];
    const hasDateChanges = newDates.startDate !== originalStartDate || newDates.endDate !== originalEndDate;
    setHasChanges(hasDateChanges);

    setEditingEnrollment(prev => ({
      ...prev!,
      dates: newDates,
    }));
  };

  const handleReasonChange = (value: string) => {
    if (!editingEnrollment) return;
    setEditingEnrollment(prev => ({
      ...prev!,
      reason: value,
    }));
  };

  const handleNotesChange = (value: string) => {
    if (!editingEnrollment) return;
    setEditingEnrollment(prev => ({
      ...prev!,
      notes: value,
    }));
  };

  const handleConfirmationChange = (checked: boolean) => {
    if (!editingEnrollment) return;
    setEditingEnrollment(prev => ({
      ...prev!,
      confirmed: checked,
    }));
  };

  const handleCloseDialog = () => {
    if (hasChanges) {
      setShowUnsavedDialog(true);
    } else {
      setEditingEnrollment(null);
      setDateError(null);
      setHasChanges(false);
    }
  };

  const handleConfirmClose = () => {
    setEditingEnrollment(null);
    setDateError(null);
    setHasChanges(false);
    setShowUnsavedDialog(false);
  };

  const handleCancelClose = () => {
    setShowUnsavedDialog(false);
  };

  const handleUpdateEnrollmentDates = async () => {
    if (!editingEnrollment || !editingEnrollment.dates) return;

    const { dates, reason, notes, confirmed } = editingEnrollment;
    const { startDate, endDate } = dates;
    
    // Validate required fields
    if (!reason || reason.trim() === '') {
      toast.error('Please select a reason for the change');
      return;
    }

    if (!confirmed) {
      toast.error('Please confirm that you understand the implications');
      return;
    }

    const error = validateDates(startDate, endDate);
    if (error) {
      setDateError(error);
      return;
    }

    setSavingDates(true);
    try {
      // Use admin endpoint for date modifications
      const response = await fetch(`/api/admin/enrollments/${editingEnrollment.id}/dates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          reason,
          notes,
          confirmed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update enrollment dates');
      }

      toast.success('Enrollment dates updated successfully');
      fetchStudentDetails();
      handleCloseDialog();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating enrollment dates. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to update enrollment dates');
    } finally {
      setSavingDates(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to formatting date. Please try again or contact support if the problem persists.`);
      return 'Invalid Date';
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Student not found</h1>
            <p className="mt-2 text-gray-600">The student you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Details</h1>
          <p className="text-muted-foreground">
            View and manage student information
          </p>
        </div>
      </div>

      <Breadcrumb items={[
        { label: 'Institution', href: '/institution' },
        { label: 'Students', href: '/institution/students' },
        { label: student?.name || 'Student Details', href: `/institution/students/${params.id}` }
      ]} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <User className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold">Student Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Info Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{student.phone}</span>
                  </div>
                )}
                {student.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{student.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Join: {formatDate(student.joinDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Last Active: {formatDate(student.lastActive)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Additional Student Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Details */}
              {(student.bio || student.native_language || student.spoken_languages || student.date_of_birth || student.gender || student.location) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {student.bio && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Bio</h4>
                        <p className="text-sm text-gray-600">{student.bio}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {student.native_language && (
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Native Language</span>
                            <p className="text-sm text-gray-600">{student.native_language}</p>
                          </div>
                        </div>
                      )}
                      {student.spoken_languages && student.spoken_languages.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Spoken Languages</span>
                            <p className="text-sm text-gray-600">{student.spoken_languages.join(', ')}</p>
                          </div>
                        </div>
                      )}
                      {student.date_of_birth && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Date of Birth</span>
                            <p className="text-sm text-gray-600">{formatDate(student.date_of_birth)}</p>
                          </div>
                        </div>
                      )}
                      {student.gender && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Gender</span>
                            <p className="text-sm text-gray-600">{student.gender}</p>
                          </div>
                        </div>
                      )}
                      {student.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Location</span>
                            <p className="text-sm text-gray-600">{student.location}</p>
                          </div>
                        </div>
                      )}
                      {student.timezone && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Timezone</span>
                            <p className="text-sm text-gray-600">{student.timezone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Learning Information */}
              {(student.learning_goals || student.interests) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Learning Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {student.learning_goals && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Learning Goals</h4>
                        <p className="text-sm text-gray-600">{student.learning_goals}</p>
                      </div>
                    )}
                    {student.interests && student.interests.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {student.interests.map((interest, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Social & Online Presence */}
              {(student.website || student.social_links || student.social_visibility) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Social & Online Presence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {student.website && (
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Website</span>
                          <p className="text-sm text-gray-600">
                            <a href={student.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {student.website}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    {student.social_links && Object.keys(student.social_links).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Social Media</h4>
                        <div className="space-y-2">
                          {Object.entries(student.social_links).map(([platform, url]) => (
                            <div key={platform} className="flex items-center gap-2">
                              <Globe2 className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700 capitalize">{platform}:</span>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                {url}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {student.social_visibility && (
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Profile Visibility</span>
                          <p className="text-sm text-gray-600 capitalize">{student.social_visibility.toLowerCase()}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Course Information */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="enrolled" className="w-full">
                <TabsList>
                  <TabsTrigger value="enrolled">Enrolled Courses ({student.enrolledCourses.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed Courses ({student.completedCourses.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="enrolled">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {student.enrolledCourses.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.name}</TableCell>
                              <TableCell>{formatDate(course.start_date)}</TableCell>
                              <TableCell>{formatDate(course.end_date)}</TableCell>
                              <TableCell>
                                <Badge variant={course.status === 'in_progress' ? 'default' : 'secondary'}>
                                  {course.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{course.progress}%</TableCell>
                              <TableCell>

                                {session?.user?.role === 'ADMIN' ? (
                                  <Dialog 
                                    open={!!editingEnrollment && editingEnrollment.id === course.id} 
                                    onOpenChange={(open) => {
                                      if (!open) {
                                        handleCloseDialog();
                                      }
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const startDate = new Date(course.start_date).toISOString().split('T')[0];
                                          const endDate = new Date(course.end_date).toISOString().split('T')[0];
                                          setEditingEnrollment({
                                            id: course.id,
                                            dates: {
                                              startDate,
                                              endDate
                                            },
                                            reason: '',
                                            notes: '',
                                            confirmed: false
                                          });
                                          setDateError(null);
                                          setHasChanges(false);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Edit Enrollment Dates</DialogTitle>
                                      <DialogDescription>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                                          <div className="flex">
                                            <div className="flex-shrink-0">
                                              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                            <div className="ml-3">
                                              <h3 className="text-sm font-medium text-yellow-800">
                                                Important Warning
                                              </h3>
                                              <div className="mt-2 text-sm text-yellow-700">
                                                <p>Modifying enrollment dates may affect:</p>
                                                <ul className="list-disc list-inside mt-1 space-y-1">
                                                  <li>Billing and payment schedules</li>
                                                  <li>Student progress tracking</li>
                                                  <li>Course completion records</li>
                                                  <li>Financial calculations</li>
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                          id="startDate"
                                          type="date"
                                          value={editingEnrollment?.dates?.startDate || ''}
                                          onChange={(e) => handleDateChange('startDate', e.target.value)}
                                          className={dateError ? 'border-red-500' : ''}
                                          min={new Date().toISOString().split('T')[0]}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                          id="endDate"
                                          type="date"
                                          value={editingEnrollment?.dates?.endDate || ''}
                                          onChange={(e) => handleDateChange('endDate', e.target.value)}
                                          className={dateError ? 'border-red-500' : ''}
                                          min={editingEnrollment?.dates?.startDate || new Date().toISOString().split('T')[0]}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="reason">Reason for Change *</Label>
                                        <select
                                          id="reason"
                                          value={editingEnrollment?.reason || ''}
                                          onChange={(e) => handleReasonChange(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                        >
                                          <option value="">Select a reason</option>
                                          <option value="STUDENT_ILLNESS">Student Illness</option>
                                          <option value="STUDENT_EMERGENCY">Student Emergency</option>
                                          <option value="STUDENT_SCHEDULE_CONFLICT">Schedule Conflict</option>
                                          <option value="INSTITUTION_COURSE_UPDATE">Course Update</option>
                                          <option value="INSTITUTION_INSTRUCTOR_CHANGE">Instructor Change</option>
                                          <option value="SYSTEM_ERROR_CORRECTION">System Error Correction</option>
                                          <option value="OTHER">Other</option>
                                        </select>
                                      </div>
                                      <div>
                                        <Label htmlFor="notes">Additional Notes</Label>
                                        <textarea
                                          id="notes"
                                          value={editingEnrollment?.notes || ''}
                                          onChange={(e) => handleNotesChange(e.target.value)}
                                          rows={3}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Provide additional details about why this change is necessary..."
                                        />
                                      </div>
                                      {dateError && (
                                        <p className="text-sm text-red-500">{dateError}</p>
                                      )}
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          id="confirmed"
                                          checked={editingEnrollment?.confirmed || false}
                                          onChange={(e) => handleConfirmationChange(e.target.checked)}
                                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                          required
                                        />
                                        <Label htmlFor="confirmed" className="text-sm">
                                          I understand the implications and confirm this change
                                        </Label>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={handleCloseDialog}
                                        disabled={savingDates}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleUpdateEnrollmentDates}
                                        disabled={savingDates || !!dateError || !hasChanges || !editingEnrollment?.reason || !editingEnrollment?.confirmed}
                                        className={(!hasChanges || !editingEnrollment?.reason || !editingEnrollment?.confirmed) ? 'opacity-50 cursor-not-allowed' : ''}
                                      >
                                        {savingDates ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                          </>
                                        ) : (
                                          'Save Changes'
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    Contact admin for changes
                                  </div>
                                )}

                                <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Unsaved Changes</DialogTitle>
                                      <DialogDescription>
                                        You have unsaved changes. Are you sure you want to close without saving?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={handleCancelClose}
                                      >
                                        Continue Editing
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={handleConfirmClose}
                                      >
                                        Discard Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Completion Date</TableHead>
                            <TableHead>Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {student.completedCourses.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.name}</TableCell>
                              <TableCell>{new Date(course.completionDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant="default">{course.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 