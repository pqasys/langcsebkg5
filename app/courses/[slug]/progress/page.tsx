'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { 
  BookOpen,
  ArrowLeft,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  Target,
  BarChart2
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
  modules: {
    id: string;
    title: string;
    orderIndex: number;
    progress: {
      content_completed: boolean;
      exercises_completed: boolean;
      quiz_completed: boolean;
      quiz_score: number | null;
      started_at: string | null;
      completed_at: string | null;
    } | null;
  }[];
}

export default function CourseProgressPage({ params }: { params: { slug: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role?.toUpperCase() !== 'STUDENT') {
      router.push('/');
      return;
    }

    fetchCourseProgress();
  }, [session, status, params.slug]);

  const fetchCourseProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/student/progress');
      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }
      
      const data = await response.json();
      // Resolve course id by slug
      const courseBySlugResp = await fetch(`/api/courses/slug/${params.slug}`);
      if (!courseBySlugResp.ok) {
        setError('Course not found');
        return;
      }
      const courseBySlug = await courseBySlugResp.json();
      const course = data.courses?.find((c: CourseProgress) => c.courseId === courseBySlug.id);
      
      if (!course) {
        setError('Course not found or not enrolled');
        return;
      }
      
      setCourseProgress(course);
    } catch (error) {
      console.error('Error occurred:', error);
      setError('Failed to load course progress');
      toast.error('Failed to load course progress');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'DROPPED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const navigateToModule = (moduleId: string) => {
    // Student course routes appear id-based; resolve id first
    router.push(`/student/courses/${courseProgress?.courseId}/modules/${moduleId}`);
  };

  const navigateToAllProgress = () => {
    router.push('/student/progress');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course Progress Error</h1>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setError(null);
                  fetchCourseProgress();
                }}
              >
                Try Again
              </Button>
              <Button onClick={() => router.push('/student/progress')}>
                View All Progress
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseProgress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
            <p className="mt-2 text-gray-600">This course is not enrolled or doesn't exist.</p>
            <Button onClick={() => router.push('/student/progress')} className="mt-4">
              View All Progress
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Course Progress</h1>
            <p className="text-muted-foreground">
              {courseProgress.title} - {courseProgress.institution}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Breadcrumb items={[
          { label: 'Courses', href: '/courses' },
          { label: courseProgress.title, href: `/courses/${params.slug}` },
          { label: 'Progress', href: `/courses/${params.slug}/progress` }
        ]} />

        {/* Course Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseProgress.progress}%</div>
              <Progress value={courseProgress.progress} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(courseProgress.status)}>
                {courseProgress.status.replace('_', ' ')}
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseProgress.modulesCompleted}/{courseProgress.totalModules}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((courseProgress.modulesCompleted / courseProgress.totalModules) * 100)}% complete
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseProgress.assignmentsCompleted}/{courseProgress.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((courseProgress.assignmentsCompleted / courseProgress.totalAssignments) * 100)}% complete
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Course Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{formatDate(courseProgress.startDate)}</span>
                  </div>
                  {courseProgress.endDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date:</span>
                      <span>{formatDate(courseProgress.endDate)}</span>
                    </div>
                  )}
                  {courseProgress.lastAccessed && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Accessed:</span>
                      <span>{formatDate(courseProgress.lastAccessed)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Progress Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Modules:</span>
                    <span>{courseProgress.totalModules}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Modules:</span>
                    <span>{courseProgress.modulesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Assignments:</span>
                    <span>{courseProgress.totalAssignments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Assignments:</span>
                    <span>{courseProgress.assignmentsCompleted}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Module Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseProgress.modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-muted-foreground">Module {module.orderIndex}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToModule(module.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                  
                  {module.progress ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          {module.progress.content_completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-300" />
                          )}
                          <span>Content</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {module.progress.exercises_completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-300" />
                          )}
                          <span>Exercises</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {module.progress.quiz_completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-300" />
                          )}
                          <span>Quiz</span>
                        </div>
                        {module.progress.quiz_score && (
                          <Badge variant="outline">
                            Score: {module.progress.quiz_score}%
                          </Badge>
                        )}
                      </div>
                      {module.progress.started_at && (
                        <p className="text-xs text-muted-foreground">
                          Started: {formatDate(module.progress.started_at)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Not started yet
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={navigateToAllProgress} variant="outline">
            <BarChart2 className="h-4 w-4 mr-2" />
            View All Progress
          </Button>
          <Button onClick={() => router.push(`/student/courses/${courseProgress.courseId}`)}>
            <BookOpen className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
} 