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
  Target
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ModuleProgressCard } from '@/components/course/ModuleProgressCard';

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  level: string;
  estimated_duration: number;
  progress: {
    contentCompleted: boolean;
    exercisesCompleted: boolean;
    quizCompleted: boolean;
    timeSpent: number;
    quizScore?: number;
    notes?: string;
    difficultyRating?: number;
    feedback?: string;
    lastAccessedAt?: Date;
  }[];
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  institution: {
    id: string;
    name: string;
  };
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'ACTIVE' | 'PAUSED';
  progress: number;
  startDate: string;
  endDate: string;
  modules: Module[];
}

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetails | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role?.toUpperCase() !== 'STUDENT') {
      router.push('/');
      return;
    }

    fetchCourseDetails();
  }, [session, status, params.id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/courses/${params.id}`);
      if (!response.ok) throw new Error(`Failed to fetch course details - Context: if (!response.ok) throw new Error('Failed to fetch...`);
      const data = await response.json();
      setCourse(data);
      
      // If we're using an enrollment ID, redirect to the course ID URL
      if (params.id !== data.id) {
        router.replace(`/student/courses/${data.id}`);
        return;
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load course details. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (moduleId: string, data: unknown) => {
    try {
      const response = await fetch(`/api/student/modules/${moduleId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to update progress - Context: body: JSON.stringify(data),...`);
      
      // Refresh course details to get updated progress
      await fetchCourseDetails();
      toast.success('Progress updated successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating progress. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
            <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or you don't have access to it.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Breadcrumb items={[
        { label: 'Student', href: '/student' },
        { label: 'Courses', href: '/student/courses' },
        { label: course.title, href: `/student/courses/${course.id}` }
      ]} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {course.description}
          </p>
        </div>
        <Badge
          variant={
            course.status === 'ACTIVE'
              ? 'default'
              : course.status === 'COMPLETED'
              ? 'success'
              : course.status === 'PAUSED'
              ? 'warning'
              : 'secondary'
          }
          className="self-start md:self-auto"
        >
          {course.status ? course.status.replace('_', ' ') : 'Unknown'}
        </Badge>
      </div>

      {/* Mobile-optimized stats grid */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{course.progress}%</div>
            <Progress value={course.progress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                course.status === 'ACTIVE'
                  ? 'default'
                  : course.status === 'COMPLETED'
                  ? 'success'
                  : course.status === 'PAUSED'
                  ? 'warning'
                  : 'secondary'
              }
              className="text-xs"
            >
              {course.status ? course.status.replace('_', ' ') : 'Unknown'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Start Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm md:text-2xl font-bold">
              {new Date(course.startDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">End Date</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm md:text-2xl font-bold">
              {new Date(course.endDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Section */}
      {course.modules && course.modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Play className="w-5 h-5 mr-2" />
              Quick Access
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Continue your learning journey
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Find next incomplete module */}
              {(() => {
                const nextModule = course.modules.find(module => {
                  const progress = module.progress[0];
                  if (!progress) return true; // No progress, start here
                  return !progress.contentCompleted || !progress.exercisesCompleted || !progress.quizCompleted;
                });
                
                if (nextModule) {
                  return (
                    <Button
                      onClick={() => router.push(`/student/courses/${course.id}/modules/${nextModule.id}`)}
                      className="flex items-center h-12 text-base"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {nextModule.progress[0] ? 'Continue Learning' : 'Start Learning'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  );
                }
                
                // All modules completed
                return (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/student/courses/${course.id}/modules/${course.modules[0].id}`)}
                    className="flex items-center h-12 text-base"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Review Course
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                );
              })()}
              
              <Button
                variant="outline"
                onClick={() => router.push('/student/progress')}
                className="flex items-center h-12 text-base"
              >
                <Target className="h-4 w-4 mr-2" />
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module) => (
                <ModuleProgressCard
                  key={module.id}
                  module={{
                    id: module.id,
                    title: module.title,
                    description: module.description,
                    level: module.level,
                    estimated_duration: module.estimated_duration
                  }}
                  progress={module.progress[0] || {
                    contentCompleted: false,
                    exercisesCompleted: false,
                    quizCompleted: false,
                    timeSpent: 0
                  }}
                  onUpdateProgress={(data) => handleUpdateProgress(module.id, data)}
                  courseId={course.id}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No modules available for this course yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 