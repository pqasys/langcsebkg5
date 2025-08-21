'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Target,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { QuizCard } from '@/components/student/QuizCard';
import ExerciseInterface from '@/components/student/ExerciseInterface';

interface ModuleContent {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz';
  content: string;
  order_index: number;
}

interface Exercise {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'MATCHING' | 'SHORT_ANSWER';
  question: string;
  options: unknown;
  answer: string;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passing_score: number;
  time_limit?: number;
  mediaUrl?: string | null;
  quiz_type: string;
  difficulty: string;
  instructions?: string;
  allow_retry: boolean;
  max_attempts: number;
  show_results: boolean;
  show_explanations: boolean;
  quizQuestions: unknown[];
}

interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  timeSpent: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  attemptNumber: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  contentItems: ModuleContent[];
  exercises: Exercise[];
  quizzes?: Quiz[];
  student_progress: {
    content_completed: boolean;
    exercises_completed: boolean;
    quiz_completed: boolean;
  }[];
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
}

interface ProgressData {
  totalContent: number;
  totalExercises: number;
  totalQuizzes: number;
  completedContent: number;
  completedExercises: string[];
  completedExercisesCount: number;
  quizCompleted: boolean;
  progressPercent: number;
}

export default function ModulePage({ params }: { params: { id: string; moduleId: string } }) {
  const { data: session, status } = useSession();
  const { hasActiveSubscription } = useSubscription();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizAttempt[]>>({});
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [exerciseStatus, setExerciseStatus] = useState<{ [exerciseId: string]: boolean }>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role?.toUpperCase() !== 'STUDENT') {
      router.push('/');
      return;
    }

    fetchModuleDetails();
  }, [session, status, params.id, params.moduleId]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/courses/${params.id}/modules/${params.moduleId}`);
      if (!response.ok) throw new Error(`Failed to fetch module details - Context: if (!response.ok) throw new Error('Failed to fetch...`);
      const data = await response.json();
      setModule(data.module);
      setCourse(data.course);
      setProgress(data.progress);

      // Initialize exercise status
      if (data.progress?.completedExercises) {
        const statusMap: { [exerciseId: string]: boolean } = {};
        data.progress.completedExercises.forEach((exerciseId: string) => {
          statusMap[exerciseId] = true;
        });
        setExerciseStatus(statusMap);
      }

      // Fetch quiz attempts for each quiz
      if (data.module.quizzes && data.module.quizzes.length > 0) {
        const attemptsData: Record<string, QuizAttempt[]> = {};
        for (const quiz of data.module.quizzes) {
          try {
            const attemptsResponse = await fetch(`/api/student/courses/${params.id}/modules/${params.moduleId}/quizzes/${quiz.id}/attempts`);
            if (attemptsResponse.ok) {
              attemptsData[quiz.id] = await attemptsResponse.json();
            }
          } catch (error) {
            console.error('Error occurred:', error);
            toast.error(`Failed to load attempts for quiz ${quiz.id}. Please try again or contact support if the problem persists.`);
          }
        }
        setQuizAttempts(attemptsData);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load module details. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch module details');
    } finally {
      setLoading(false);
    }
  };

  const getModuleStatus = (module: Module) => {
    const progress = module.student_progress[0];
    if (!progress) return 'not_started';
    if (progress.content_completed && progress.exercises_completed && progress.quiz_completed) {
      return 'completed';
    }
    return 'in_progress';
  };

  const handleQuizComplete = async () => {
    // Refresh module details to update progress
    await fetchModuleDetails();
  };

  const handleExerciseComplete = async (exerciseId: string, isCorrect: boolean, userAnswer: string) => {
    try {
      const res = await fetch(`/api/student/exercises/${exerciseId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer, isCorrect })
      });
      if (!res.ok) throw new Error(`Failed to submit exercise - Context: body: JSON.stringify({ userAnswer, isCorrect })...`);
      setExerciseStatus((prev) => ({ ...prev, [exerciseId]: isCorrect }));
      // Refresh module details to update progress
      await fetchModuleDetails();
    } catch (err) {
      toast.error("Failed to submit exercise");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!module || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Module not found</h1>
            <p className="mt-2 text-gray-600">The module you're looking for doesn't exist or you don't have access to it.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const moduleStatus = getModuleStatus(module);

  return (
    <div className="space-y-6">
      {/* Free Trial banner for authenticated students without active subscription */}
      {session?.user && !hasActiveSubscription && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>
              Enjoy full access with a 7-day Free Trial. Cancel anytime.
            </span>
            <span className="flex gap-2">
              <Link href="/subscription/trial" className="inline-block">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900" size="sm">Start Free Trial</Button>
              </Link>
              <Link href="/subscription-signup" className="inline-block">
                <Button variant="outline" size="sm">View Plans</Button>
              </Link>
            </span>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">{module.title}</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {module.description}
          </p>
        </div>
        <Badge
          variant={
            moduleStatus === 'completed'
              ? 'default'
              : moduleStatus === 'in_progress'
              ? 'secondary'
              : 'outline'
          }
          className="self-start md:self-auto"
        >
          {moduleStatus.replace('_', ' ')}
        </Badge>
      </div>

      <Breadcrumb items={[
        { label: 'Student', href: '/student' },
        { label: 'Courses', href: '/student/courses' },
        { label: course.title, href: `/student/courses/${course.id}` },
        { label: module.title, href: `/student/courses/${course.id}/modules/${module.id}` }
      ]} />

      {/* Mobile-optimized navigation buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/student/courses/${course.id}`)}
          className="flex items-center w-full sm:w-auto h-12 text-base"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>
        
        {/* Next Module Button - This would need to be implemented with actual module ordering */}
        <Button
          variant="outline"
          onClick={() => {
            // For now, just go back to course. In a full implementation,
            // you'd find the next module in the sequence
            router.push(`/student/courses/${course.id}`);
          }}
          className="flex items-center w-full sm:w-auto h-12 text-base"
        >
          View All Modules
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Module Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Module Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {progress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Progress</span>
                <span>{progress.progressPercent}%</span>
              </div>
              <Progress value={progress.progressPercent} />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                <span>{progress.completedContent}/{progress.totalContent} content</span>
                <span>{progress.completedExercisesCount}/{progress.totalExercises} exercises</span>
                <span>{progress.quizCompleted ? "Quiz completed" : "Quiz not completed"}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">Content</p>
                <p className="text-xs text-muted-foreground">
                  {module.student_progress[0]?.content_completed ? 'Completed' : 'Not started'}
                </p>
              </div>
              {module.student_progress[0]?.content_completed && (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Target className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">Exercises</p>
                <p className="text-xs text-muted-foreground">
                  {module.student_progress[0]?.exercises_completed ? 'Completed' : 'Not started'}
                </p>
              </div>
              {module.student_progress[0]?.exercises_completed && (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">Quiz</p>
                <p className="text-xs text-muted-foreground">
                  {module.student_progress[0]?.quiz_completed ? 'Completed' : 'Not started'}
                </p>
              </div>
              {module.student_progress[0]?.quiz_completed && (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Module Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {module.contentItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {item.type === 'text' ? (
                    <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  ) : item.type === 'video' ? (
                    <Circle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  <h3 className="font-medium text-sm md:text-base">{item.title}</h3>
                </div>
                <div className="prose max-w-none text-sm md:text-base">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercises Section */}
      {module.exercises && module.exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Practice Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {module.exercises.map((exercise) => (
                <div key={exercise.id} className="mb-6">
                  <ExerciseInterface
                    exercise={exercise}
                    onComplete={handleExerciseComplete}
                    showAnswers={!!exerciseStatus[exercise.id]}
                  />
                  {exerciseStatus[exercise.id] && (
                    <Badge variant="default" className="mt-2">Completed</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quizzes Section */}
      {module.quizzes && module.quizzes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {module.quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  moduleId={params.moduleId}
                  courseId={params.id}
                  attempts={quizAttempts[quiz.id] || []}
                  onQuizComplete={handleQuizComplete}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 