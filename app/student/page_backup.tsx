'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { 
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  Award,
  Users,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Play,
  CheckCircle
} from 'lucide-react';
import CourseAccessStatus from '@/app/components/student/CourseAccessStatus';
import { QuizProgress } from '@/components/student/QuizProgress';
import LearningPath from '@/app/components/student/LearningPath';
import ProgressVisualization from '@/app/components/student/ProgressVisualization';

interface CourseProgress {
  id: string;
  courseId: string;
  title: string;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'ACTIVE';
  startDate: string;
  endDate: string;
  institution: {
    name: string;
  };
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  activeCourses: number;
}

// New interfaces for enhanced progress tracking
interface LearningStats {
  totalTimeSpent: number;
  averageSessionTime: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  thisWeekSessions: number;
  averageScore: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  achievementType: string;
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

// Quiz-related interfaces
interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  courseTitle: string;
  moduleTitle: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  timeSpent: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  attemptNumber: number;
  passed: boolean;
}

interface QuizStats {
  totalAttempts: number;
  completedQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  bestScore: number;
  quizzesPassed: number;
  totalQuizzes: number;
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    activeCourses: 0
  });

  // New state for enhanced progress tracking
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentModules, setRecentModules] = useState<ModuleProgress[]>([]);

  // Quiz-related state
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [recentQuizAttempts, setRecentQuizAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch existing dashboard data
      const dashboardResponse = await fetch('/api/student/dashboard');
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setCourses(dashboardData.courses);
        setStats(dashboardData.stats);
      }

      // Fetch new progress tracking data
      const [statsRes, achievementsRes, modulesRes, quizStatsRes] = await Promise.all([
        fetch('/api/student/dashboard/stats'),
        fetch('/api/student/dashboard/achievements'),
        fetch('/api/student/dashboard/recent-modules'),
        fetch('/api/student/dashboard/quiz-stats')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setLearningStats(statsData);
      }

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData);
      }

      if (modulesRes.ok) {
        const modulesData = await modulesRes.json();
        setRecentModules(modulesData);
      }

      if (quizStatsRes.ok) {
        const quizData = await quizStatsRes.json();
        setQuizStats(quizData.stats);
        setRecentQuizAttempts(quizData.recentAttempts);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to load dashboard data:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Learning Path Section - NEW */}
      {session?.user?.id && (
        <LearningPath studentId={session.user.id} />
      )}

      {/* Progress Visualization */}
      {session?.user?.id && (
        <ProgressVisualization studentId={session.user.id} />
      )}

      {/* Enhanced Learning Stats */}
      {learningStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(learningStats.totalTimeSpent)}</div>
              <p className="text-xs text-muted-foreground">
                {learningStats.totalSessions} sessions completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.currentStreak} days</div>
              <p className="text-xs text-muted-foreground">
                Longest: {learningStats.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.thisWeekSessions} sessions</div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatTime(learningStats.averageSessionTime)} per session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                Across all quizzes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz Progress Section */}
      {quizStats && (
        <QuizProgress 
          recentAttempts={recentQuizAttempts}
          stats={quizStats}
        />
      )}

      {/* Original Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Continue Learning
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pick up where you left off or start something new
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Access to Recent Modules */}
            {recentModules.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recent Modules</h4>
                {recentModules.slice(0, 3).map((module) => (
                  <div key={module.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                       onClick={() => {
                         // We need to get the courseId from the course relationship
                         // For now, we'll navigate to the courses page and let the user select
                         router.push('/student/courses');
                       }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{module.moduleTitle}</h5>
                        <p className="text-xs text-muted-foreground">{module.courseTitle}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {module.contentCompleted && <CheckCircle className="w-3 h-3 text-green-500" />}
                        {module.exercisesCompleted && <CheckCircle className="w-3 h-3 text-blue-500" />}
                        {module.quizCompleted && <CheckCircle className="w-3 h-3 text-purple-500" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(module.timeSpent)} spent
                      </span>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Active Courses */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Active Courses</h4>
              {courses.filter(c => c.status === 'ACTIVE' || c.status === 'IN_PROGRESS').slice(0, 3).map((course) => (
                <div key={course.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                     onClick={() => router.push(`/student/courses/${course.courseId}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{course.title}</h5>
                      <p className="text-xs text-muted-foreground">{course.institution.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {course.progress}%
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {course.status.replace('_', ' ')}
                    </span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      View Course
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Quick Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/student/courses')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Courses
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/student/progress')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/student/progress?view=achievements')}
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Content: Achievements and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Recent Achievements
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
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
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

        {/* Recent Module Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
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
                {recentModules.slice(0, 5).map((module) => (
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
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(module.lastStudyDate)}
                      </p>
                      {module.learningStreak > 0 && (
                        <Badge variant="secondary" className="mt-1">
                          {module.learningStreak} day streak
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.institution.name}
                  </p>
                </div>
                <CourseAccessStatus enrollment={course} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.institution.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={course.progress} className="w-[100px]" />
                      <span className="text-sm text-muted-foreground">
                        {course.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === 'COMPLETED'
                          ? 'default'
                          : course.status === 'IN_PROGRESS'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {course.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(course.startDate)}</TableCell>
                  <TableCell>{formatDate(course.endDate)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/student/courses/${course.courseId}`)}
                    >
                      View Course
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 