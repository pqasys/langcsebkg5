'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { 
  BookOpen, 
  Award, 
  Clock, 
  BarChart2, 
  Play, 
  Calendar,
  Target,
  Star,
  CheckCircle,
  TrendingUp,
  ExternalLink,
  ArrowRight,
  Eye,
  Download,
  Printer,
  Trophy,
  Users,
  BookMarked,
  GraduationCap,
  Activity
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface Course {
  id: string;
  title: string;
  description: string;
  institution: string;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  startDate: string;
  endDate?: string;
  modulesCompleted: number;
  totalModules: number;
  imageUrl?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  achievementType: string;
  source?: string;
  isPublic?: boolean;
  certificateId?: string;
  language?: string;
  languageName?: string;
  cefrLevel?: string;
  score?: number;
  totalQuestions?: number;
  completionDate?: string;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  totalHoursSpent: number;
  certificatesEarned: number;
  achievementsUnlocked: number;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    totalHoursSpent: 0,
    certificatesEarned: 0,
    achievementsUnlocked: 0
  });

  // Handle session loading and authentication
  useEffect(() => {
    if (status === 'loading') {
      return; // Still loading, wait
    }

    if (status === 'unauthenticated' || !session) {
      console.log('StudentDashboard: No session, redirecting to signin');
      router.replace('/auth/signin');
      return;
    }

    // Check if user is actually a student
    if (session.user?.role !== 'STUDENT') {
      console.log('StudentDashboard: User is not a student, redirecting');
      router.replace('/dashboard');
      return;
    }

    // Session is valid, fetch dashboard data
    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [progressRes, achievementsRes, certificatesRes] = await Promise.all([
        fetch('/api/student/progress'),
        fetch('/api/student/dashboard/achievements'),
        fetch('/api/certificates')
      ]);

      // Handle progress data
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        console.log('Progress data:', progressData);
        
        // Transform course data
        const transformedCourses = (progressData.courses || []).map((course: any) => ({
          id: course.courseId,
          title: course.title,
          description: `Course at ${course.institution}`,
          institution: course.institution,
          progress: course.progress || 0,
          status: course.status || 'NOT_STARTED',
          startDate: course.startDate,
          endDate: course.endDate,
          modulesCompleted: course.modulesCompleted || 0,
          totalModules: course.totalModules || 0
        }));
        
        setCourses(transformedCourses);
        
        // Set stats
        if (progressData.stats) {
          setStats({
            totalCourses: progressData.stats.totalCourses || 0,
            completedCourses: progressData.stats.completedCourses || 0,
            inProgressCourses: progressData.stats.inProgressCourses || 0,
            averageProgress: progressData.stats.averageProgress || 0,
            totalHoursSpent: progressData.stats.totalHoursSpent || 0,
            certificatesEarned: progressData.stats.certificatesEarned || 0,
            achievementsUnlocked: 0 // Will be updated below
          });
        }
      } else {
        console.error('Progress API error:', progressRes.status, progressRes.statusText);
        toast.error('Failed to load course progress');
      }

      // Handle achievements data
      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        console.log('Achievements data:', achievementsData);
        setAchievements(achievementsData || []);
      } else {
        console.error('Achievements API error:', achievementsRes.status, achievementsRes.statusText);
        toast.error('Failed to load achievements');
      }

      // Handle certificates data
      if (certificatesRes.ok) {
        const certificatesResponse = await certificatesRes.json();
        console.log('Certificates response:', certificatesResponse);
        const certificatesData = certificatesResponse.data || certificatesResponse || [];
        console.log('Certificates data:', certificatesData);
        
        const certificateAchievements = certificatesData.map((cert: any) => ({
          id: cert.certificateId || cert.id,
          title: `${cert.languageName || 'Language'} Proficiency Test`,
          description: `Achieved ${cert.cefrLevel || 'Unknown'} level with ${cert.score || 0}/${cert.totalQuestions || 0} (${cert.score && cert.totalQuestions ? Math.round((cert.score / cert.totalQuestions) * 100) : 0}% accuracy)`,
          icon: '🏆',
          unlockedAt: cert.completionDate || cert.createdAt,
          achievementType: 'certificate',
          source: 'Certificate',
          isPublic: cert.isPublic || false,
          certificateId: cert.certificateId || cert.id,
          language: cert.language,
          languageName: cert.languageName,
          cefrLevel: cert.cefrLevel,
          score: cert.score,
          totalQuestions: cert.totalQuestions,
          completionDate: cert.completionDate || cert.createdAt
        }));
        
        // Merge certificates with other achievements
        const allAchievements = [...(achievements || []), ...certificateAchievements];
        allAchievements.sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
        setAchievements(allAchievements);
        
        // Update stats with certificate count
        setStats(prev => ({
          ...prev,
          certificatesEarned: certificatesData.length,
          achievementsUnlocked: allAchievements.length
        }));
      } else {
        console.error('Certificates API error:', certificatesRes.status, certificatesRes.statusText);
        toast.error('Failed to load certificates');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(`Failed to load dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-50';
      case 'NOT_STARTED':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'A1': 'bg-gray-100 text-gray-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-green-100 text-green-800',
      'B2': 'bg-yellow-100 text-yellow-800',
      'C1': 'bg-orange-100 text-orange-800',
      'C2': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const handlePrint = async (achievementId: string) => {
    try {
      const response = await fetch(`/certificates/${achievementId}`);
      if (response.ok) {
        const htmlContent = await response.text();
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
          setTimeout(() => {
            newWindow.print();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error printing certificate:', error);
      toast.error('Failed to print certificate');
    }
  };

  const handleDownload = async (achievementId: string) => {
    try {
      const response = await fetch(`/api/certificates/${achievementId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${achievementId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleView = (achievementId: string) => {
    window.open(`/certificates/${achievementId}`, '_blank');
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dashboard Error</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          </div>
          <Button 
            onClick={() => {
              setError(null);
              fetchDashboardData();
            }}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show unauthenticated state
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchDashboardData}
          disabled={loading}
        >
          {loading ? <FaSpinner className="h-4 w-4 animate-spin mr-2" /> : <Activity className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <Breadcrumb items={[
        { label: 'Student', href: '/student' }
      ]} />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedCourses} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
            <Progress value={stats.averageProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHoursSpent}h</div>
            <p className="text-xs text-muted-foreground">
              Total learning hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.achievementsUnlocked}</div>
            <p className="text-xs text-muted-foreground">
              {stats.certificatesEarned} certificates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No courses enrolled yet.</p>
                  <p className="text-sm">Browse available courses to get started!</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push('/courses')}
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">{course.institution}</p>
                          </div>
                          <Badge className={getStatusColor(course.status)}>
                            {course.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Modules: </span>
                              {course.modulesCompleted}/{course.totalModules}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Started: </span>
                              {formatDate(course.startDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-4"
                        title="Go to course"
                        onClick={() => router.push(`/student/courses/${course.id}`)}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No achievements unlocked yet.</p>
                  <p className="text-sm">Keep learning to earn achievements!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.slice(0, 6).map((achievement) => (
                    <div key={achievement.id} className="flex flex-col p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <span className="text-lg">{achievement.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Unlocked {formatDate(achievement.unlockedAt)}</span>
                          {achievement.cefrLevel && (
                            <Badge className={getLevelColor(achievement.cefrLevel)}>
                              {achievement.cefrLevel}
                            </Badge>
                          )}
                        </div>
                        
                        {achievement.score && achievement.totalQuestions && (
                          <div className="text-center py-2 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">
                              {achievement.score}/{achievement.totalQuestions}
                            </div>
                            <div className="text-xs text-gray-600">
                              {Math.round((achievement.score / achievement.totalQuestions) * 100)}% Accuracy
                            </div>
                          </div>
                        )}
                        
                        {/* Action buttons for certificates */}
                        {achievement.source === 'Certificate' && achievement.certificateId && (
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(achievement.certificateId!)}
                              className="flex items-center gap-1 flex-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrint(achievement.certificateId!)}
                              className="flex items-center gap-1"
                            >
                              <Printer className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(achievement.certificateId!)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {achievements.length > 6 && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/student/progress?view=achievements')}
                  >
                    View All Achievements
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
                    <div className="text-sm text-blue-600">Total Courses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completedCourses}</div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.inProgressCourses}</div>
                    <div className="text-sm text-orange-600">In Progress</div>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/student/progress')}
                  >
                    View Detailed Progress
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push('/courses')}
            >
              <BookOpen className="h-6 w-6" />
              <span>Browse Courses</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push('/student/progress')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Progress</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push('/achievements')}
            >
              <Award className="h-6 w-6" />
              <span>All Achievements</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
