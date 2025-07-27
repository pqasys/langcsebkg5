'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Eye
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface CourseProgress {
  id: string;
  courseId: string;
  title: string;
  institution: string;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';
  startDate: string;
  endDate?: string;
  lastAccessed?: string;
  modulesCompleted: number;
  totalModules: number;
  assignmentsCompleted: number;
  totalAssignments: number;
}

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  totalHoursSpent: number;
  certificatesEarned: number;
}

interface ModuleProgress {
  id: string;
  moduleId: string;
  moduleTitle: string;
  courseTitle: string;
  contentCompleted: boolean;
  exercisesCompleted: boolean;
  quizCompleted: boolean;
  timeSpent: number;
  quizScore: number | null;
  bestQuizScore: number | null;
  learningStreak: number;
  lastStudyDate: string;
  retryAttempts: number;
  achievementUnlocked: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  achievementType: string;
}

export default function StudentProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    totalHoursSpent: 0,
    certificatesEarned: 0
  });
  const [recentModules, setRecentModules] = useState<ModuleProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      return; // Wait for session to load
    }

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role?.toUpperCase() !== 'STUDENT') {
      router.push('/');
      return;
    }

    // Set active view based on query parameter
    const view = searchParams.get('view');
    if (view === 'modules') {
      setActiveView('modules');
    } else if (view === 'achievements') {
      setActiveView('achievements');
    } else if (view === 'calendar') {
      setActiveView('calendar');
    } else {
      setActiveView('overview');
    }

    fetchProgress();
  }, [session, status, searchParams]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [progressRes, modulesRes, achievementsRes] = await Promise.all([
        fetch('/api/student/progress'),
        fetch('/api/student/dashboard/recent-modules'),
        fetch('/api/student/dashboard/achievements')
      ]);

      if (progressRes.ok) {
        const data = await progressRes.json();
        setCourses(data.courses || []);
        setStats(data.stats || {
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          averageProgress: 0,
          totalHoursSpent: 0,
          certificatesEarned: 0
        });
      } else {
        toast.error('Progress API error:');
        setError('Failed to load progress data');
      }

      if (modulesRes.ok) {
        const modulesData = await modulesRes.json();
        setRecentModules(modulesData || []);
      } else {
        toast.error('Modules API error:');
        setRecentModules([]);
      }

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData || []);
      } else {
        toast.error('Achievements API error:');
        setAchievements([]);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load progress. Please try again or contact support if the problem persists.`);
      setError('Failed to fetch progress data');
      toast.error('Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'IN_PROGRESS':
        return 'text-blue-600';
      case 'DROPPED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
    console.error('Error occurred:', error);
      return 'Invalid date';
    }
  };

  const navigateToCourse = (courseId: string) => {
    router.push(`/student/courses/${courseId}`);
  };

  const navigateToModule = (courseId: string, moduleId: string) => {
    router.push(`/student/courses/${courseId}/modules/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Error Loading Progress</h1>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setError(null);
                fetchProgress();
              }}
            >
              Try Again
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
          <h1 className="text-2xl font-bold tracking-tight">Learning Progress</h1>
          <p className="text-muted-foreground">
            Track your course progress and achievements
          </p>
        </div>
      </div>

      <Breadcrumb items={[
        { label: 'Student', href: '/student' },
        { label: 'Progress', href: '/student/progress' }
      ]} />

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Recent Modules
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Study Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview Cards */}
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
                <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
                <p className="text-xs text-muted-foreground">
                  Courses completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Course Progress List */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.institution}</p>
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(course.status)}`}>{course.status}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Modules: </span>
                            {course.modulesCompleted}/{course.totalModules}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Assignments: </span>
                            {course.assignmentsCompleted}/{course.totalAssignments}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Started: {new Date(course.startDate).toLocaleDateString()}
                          {course.endDate && ` • Ends: ${new Date(course.endDate).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-4"
                      title="Go to course"
                      onClick={() => navigateToCourse(course.courseId)}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Recent Module Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentModules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent module activity.</p>
                  <p className="text-sm">Start learning to see your activity here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{module.moduleTitle}</h4>
                        <p className="text-sm text-muted-foreground">{module.courseTitle}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            {module.contentCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {module.exercisesCompleted && <CheckCircle className="w-4 h-4 text-blue-500" />}
                            {module.quizCompleted && <CheckCircle className="w-4 h-4 text-purple-500" />}
                          </div>
                          {module.quizScore && (
                            <Badge variant="outline">
                              Quiz: {module.quizScore}%
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatTime(module.timeSpent)} spent
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(module.lastStudyDate)}
                        </p>
                        {module.learningStreak > 0 && (
                          <Badge variant="secondary" className="mt-1">
                            {module.learningStreak} day streak
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-2"
                          title="Go to module"
                          onClick={() => navigateToModule(module.courseId, module.moduleId)}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </div>
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
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Unlocked {formatDate(achievement.unlockedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Study Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Study Calendar feature coming soon!</p>
                <p className="text-sm">Plan your study sessions and track your learning schedule.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 