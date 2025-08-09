'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Calendar, Users, DollarSign, Clock, BookOpen, Bookmark, Video, MessageCircle, Share2, User } from 'lucide-react';
import { format } from 'date-fns';
import VideoConferencingCTA from '@/components/VideoConferencingCTA'

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
  isEnrolled: boolean;
  enrollment?: {
    id: string;
    role: string;
    joinedAt: string;
    isActive: boolean;
  };
}

interface AccessLevel {
  hasSubscription: boolean;
  hasInstitutionAccess: boolean;
  institutionId?: string;
}

export default function StudentLiveClassesPage() {
  const { data: session } = useSession();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>({
    hasSubscription: false,
    hasInstitutionAccess: false,
  });
  const [activeTab, setActiveTab] = useState('available');
  const [enrollmentModal, setEnrollmentModal] = useState<{
    isOpen: boolean;
    liveClass: LiveClass | null;
  }>({
    isOpen: false,
    liveClass: null,
  });

  useEffect(() => {
    fetchLiveClasses();
  }, [currentPage, searchTerm, languageFilter, levelFilter, activeTab]);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        type: activeTab,
        ...(searchTerm && { search: searchTerm }),
        ...(languageFilter && languageFilter !== 'all' && { language: languageFilter }),
        ...(levelFilter && levelFilter !== 'all' && { level: levelFilter }),
      });

      const response = await fetch(`/api/student/live-classes?${params}`);
      if (!response.ok) throw new Error('Failed to fetch live classes');

      const data = await response.json();
      setLiveClasses(data.liveClasses);
      setTotalPages(data.pagination.pages);
      setAccessLevel(data.accessLevel);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (liveClass: LiveClass) => {
    setEnrollmentModal({
      isOpen: true,
      liveClass,
    });
  };

  const handleEnrollConfirm = async () => {
    if (!enrollmentModal.liveClass) return;

    try {
      const response = await fetch('/api/student/live-classes/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liveClassId: enrollmentModal.liveClass.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to enroll in live class');
        return;
      }

      // Close modal and refresh the list
      setEnrollmentModal({ isOpen: false, liveClass: null });
      fetchLiveClasses();
    } catch (error) {
      console.error('Error enrolling in live class:', error);
      alert('Failed to enroll in live class');
    }
  };

  const handleEnrollCancel = () => {
    setEnrollmentModal({ isOpen: false, liveClass: null });
  };

  const handleUnenroll = async (liveClassId: string) => {
    try {
      const response = await fetch(`/api/student/live-classes/enroll?liveClassId=${liveClassId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to unenroll from live class');
        return;
      }

      // Refresh the list
      fetchLiveClasses();
    } catch (error) {
      console.error('Error unenrolling from live class:', error);
      alert('Failed to unenroll from live class');
    }
  };

  const handleJoinClass = async (liveClass: LiveClass) => {
    try {
      // Check if class has started
      const now = new Date();
      const startTime = new Date(liveClass.startTime);
      const endTime = new Date(liveClass.endTime);
      const earlyAccessTime = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 minutes before

      if (now < earlyAccessTime) {
        alert('This class has not started yet. Please wait until 30 minutes before the scheduled start time.');
        return;
      }

      if (now > endTime) {
        alert('This class has already ended.');
        return;
      }

      // Check if this is early access
      const isEarlyAccess = now >= earlyAccessTime && now < startTime;

      // Always use the WebRTC session page for joining classes
      window.open(`/student/live-classes/session/${liveClass.id}`, '_blank');

      // Show appropriate message for early access
      if (isEarlyAccess) {
        alert('Welcome to early access! You can now familiarize yourself with the environment. The instructor will join at the scheduled start time.');
      }

      // Optionally, mark the student as active in the session
      try {
        const response = await fetch('/api/student/live-classes/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ liveClassId: liveClass.id }),
        });

        if (!response.ok) {
          console.warn('Failed to mark student as active in session');
        }
      } catch (error) {
        console.warn('Error marking student as active:', error);
      }
    } catch (error) {
      console.error('Error joining live class:', error);
      alert('Failed to join live class');
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Live Classes</h1>
        <div className="flex space-x-2">
          {!accessLevel.hasSubscription && (
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>

      {/* Access Level Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Access Level:</span>
              </div>
              <div className="flex space-x-2">
                {accessLevel.hasSubscription && (
                  <Badge className="bg-green-100 text-green-800">Premium Subscription</Badge>
                )}
                {accessLevel.hasInstitutionAccess && (
                  <Badge className="bg-blue-100 text-blue-800">Institution Access</Badge>
                )}
                {!accessLevel.hasSubscription && !accessLevel.hasInstitutionAccess && (
                  <Badge className="bg-gray-100 text-gray-800">No Access</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
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
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Live Classes Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Classes</TabsTrigger>
          <TabsTrigger value="enrolled">My Enrollments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Live Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading available classes...</p>
                </div>
              ) : liveClasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No available live classes found.</p>
                  {!accessLevel.hasSubscription && !accessLevel.hasInstitutionAccess && (
                    <p className="text-sm text-gray-400 mt-2">
                      Upgrade to Premium or enroll in an institution to access live classes.
                    </p>
                  )}
                  <div className="mt-6">
                    <VideoConferencingCTA variant="compact" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveClasses.map((liveClass) => (
                    <Card key={liveClass.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{liveClass.title}</CardTitle>
                            <p className="text-sm text-gray-500">{liveClass.sessionType}</p>
                          </div>
                          {liveClass.institution && (
                            <Badge variant="secondary">{liveClass.institution.name}</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {liveClass.maxParticipants} participants max
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {format(new Date(liveClass.startTime), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{liveClass.duration} minutes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {liveClass.price} {liveClass.currency}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="outline">{liveClass.language.toUpperCase()}</Badge>
                            {getLevelBadge(liveClass.level)}
                          </div>
                          <div className="pt-2">
                            <Button 
                              className="w-full" 
                              onClick={() => handleEnrollClick(liveClass)}
                            >
                              Enroll Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading enrolled classes...</p>
                </div>
              ) : liveClasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't enrolled in any live classes yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveClasses.map((liveClass) => (
                    <Card key={liveClass.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{liveClass.title}</CardTitle>
                            <p className="text-sm text-gray-500">{liveClass.sessionType}</p>
                          </div>
                          {getStatusBadge(liveClass.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {liveClass.maxParticipants} participants max
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {format(new Date(liveClass.startTime), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{liveClass.duration} minutes</span>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="outline">{liveClass.language.toUpperCase()}</Badge>
                            {getLevelBadge(liveClass.level)}
                          </div>
                          <div className="pt-2 space-y-2">
                            {(() => {
                              const now = new Date();
                              const startTime = new Date(liveClass.startTime);
                              const endTime = new Date(liveClass.endTime);
                              const earlyAccessTime = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 minutes before
                              
                              if (now < earlyAccessTime) {
                                return (
                                  <Button 
                                    className="w-full" 
                                    variant="outline"
                                    disabled
                                  >
                                    Class Not Started
                                  </Button>
                                );
                              } else if (now >= earlyAccessTime && now < startTime) {
                                return (
                                  <Button 
                                    className="w-full" 
                                    variant="outline"
                                    onClick={() => handleJoinClass(liveClass)}
                                  >
                                    Join Early (30 min before)
                                  </Button>
                                );
                              } else if (now > endTime) {
                                return (
                                  <Button 
                                    className="w-full" 
                                    variant="outline"
                                    disabled
                                  >
                                    Class Ended
                                  </Button>
                                );
                              } else {
                                return (
                                  <Button 
                                    className="w-full" 
                                    variant="outline"
                                    onClick={() => handleJoinClass(liveClass)}
                                  >
                                    Join Class
                                  </Button>
                                );
                              }
                            })()}
                            <Button 
                              className="w-full" 
                              variant="outline"
                              onClick={() => handleUnenroll(liveClass.id)}
                            >
                              Unenroll
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">No completed classes yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Enrollment Confirmation Modal */}
      <Dialog open={enrollmentModal.isOpen} onOpenChange={(open) => !open && handleEnrollCancel()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Confirm Enrollment
            </DialogTitle>
            <DialogDescription>
              Please review the class details before confirming your enrollment.
            </DialogDescription>
          </DialogHeader>

          {enrollmentModal.liveClass && (
            <div className="space-y-6">
              {/* Class Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {enrollmentModal.liveClass.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {enrollmentModal.liveClass.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {enrollmentModal.liveClass.instructor.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {format(new Date(enrollmentModal.liveClass.startTime), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {format(new Date(enrollmentModal.liveClass.startTime), 'HH:mm')} - {format(new Date(enrollmentModal.liveClass.endTime), 'HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {enrollmentModal.liveClass.duration} minutes
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">{enrollmentModal.liveClass.language.toUpperCase()}</Badge>
                  {getLevelBadge(enrollmentModal.liveClass.level)}
                  <Badge variant="secondary">{enrollmentModal.liveClass.sessionType}</Badge>
                </div>
              </div>

              {/* What to Expect */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">What to Expect</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Live Video Session</p>
                      <p className="text-sm text-gray-600">
                        Join the class via video conferencing. You'll receive a meeting link before the session starts.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Interactive Chat</p>
                      <p className="text-sm text-gray-600">
                        Participate in real-time discussions and ask questions during the session.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Share2 className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Screen Sharing</p>
                      <p className="text-sm text-gray-600">
                        Instructor may share their screen for presentations and demonstrations.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Group Learning</p>
                      <p className="text-sm text-gray-600">
                        Learn alongside other students in an interactive group environment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Early access available 30 minutes before class starts - familiarize yourself with the environment</li>
                  <li>• Please join the session at least 5 minutes before the scheduled start time</li>
                  <li>• Ensure you have a stable internet connection and working microphone</li>
                  <li>• You can access the meeting link from your enrolled classes once the session starts</li>
                  <li>• The session will be recorded if enabled by the instructor</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleEnrollCancel}>
              Cancel
            </Button>
            <Button onClick={handleEnrollConfirm} className="bg-blue-600 hover:bg-blue-700">
              Confirm Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 