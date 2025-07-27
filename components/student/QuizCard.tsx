'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Clock, 
  Target, 
  Play, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Trophy,
  BookOpen
} from 'lucide-react';
import { QuizInterface } from './QuizInterface';

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  points: number;
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
  quizQuestions: QuizQuestion[];
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

interface QuizCardProps {
  quiz: Quiz;
  moduleId: string;
  courseId: string;
  attempts?: QuizAttempt[];
  onQuizComplete: () => void;
}

export function QuizCard({ quiz, moduleId, courseId, attempts = [], onQuizComplete }: QuizCardProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(false);

  const latestAttempt = attempts.length > 0 ? attempts[0] : null;
  const isCompleted = latestAttempt?.status === 'COMPLETED';
  const canRetry = quiz.allow_retry && (!quiz.max_attempts || attempts.length < quiz.max_attempts);
  const passed = latestAttempt?.percentage && latestAttempt.percentage >= quiz.passing_score;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuizTypeIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT': return <Target className="h-4 w-4" />;
      case 'PRACTICE': return <BookOpen className="h-4 w-4" />;
      case 'ADAPTIVE': return <Trophy className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/courses/${courseId}/modules/${moduleId}/quizzes/${quiz.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setShowQuiz(true);
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to start quiz');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to starting quiz. Please try again or contact support if the problem persists.`);
      toast.error('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (result: unknown) => {
    setShowQuiz(false);
    onQuizComplete();
    toast.success(`Quiz completed! Score: ${result.percentage}%`);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start space-x-3">
              {getQuizTypeIcon(quiz.quiz_type)}
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base md:text-lg leading-tight">{quiz.title}</CardTitle>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </Badge>
              {isCompleted && (
                <Badge variant={passed ? "default" : "destructive"} className="text-xs">
                  {passed ? "PASSED" : "FAILED"}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mobile-optimized quiz stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold">{quiz.quizQuestions.length}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold">{quiz.passing_score}%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Passing Score</div>
            </div>
            {quiz.time_limit && (
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">{quiz.time_limit}m</div>
                <div className="text-xs md:text-sm text-muted-foreground">Time Limit</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold">{attempts.length}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Attempts</div>
            </div>
          </div>

          {/* Latest Attempt Results */}
          {latestAttempt && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Latest Attempt</span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {(() => {
                    const dateToFormat = latestAttempt.completedAt || latestAttempt.startedAt;
                    if (!dateToFormat) return 'No date available';
                    
                    try {
                      const date = new Date(dateToFormat);
                      if (isNaN(date.getTime())) return 'Invalid date';
                      return date.toLocaleDateString();
                    } catch (error) {
    console.error('Error occurred:', error);
                      return 'Invalid date';
                    }
                  })()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span>
                    {latestAttempt.percentage !== undefined && latestAttempt.percentage !== null 
                      ? `${latestAttempt.percentage}%` 
                      : 'N/A'
                    }
                    {latestAttempt.score !== undefined && latestAttempt.maxScore !== undefined && 
                     latestAttempt.score !== null && latestAttempt.maxScore !== null
                      ? ` (${latestAttempt.score}/${latestAttempt.maxScore})`
                      : ''
                    }
                  </span>
                </div>
                <Progress value={latestAttempt.percentage || 0} className="h-2" />
              </div>
              {latestAttempt.timeSpent > 0 && (
                <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Time spent: {Math.floor(latestAttempt.timeSpent / 60)}m {latestAttempt.timeSpent % 60}s</span>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {quiz.instructions && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Instructions</h4>
              <p className="text-xs md:text-sm text-muted-foreground">{quiz.instructions}</p>
            </div>
          )}

          {/* Mobile-optimized action buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4">
            <div className="flex items-center space-x-2">
              {isCompleted && (
                <div className="flex items-center space-x-1">
                  {passed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!isCompleted && (
                <Button onClick={handleStartQuiz} disabled={loading} className="w-full sm:w-auto h-10">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </>
                  )}
                </Button>
              )}
              {isCompleted && canRetry && (
                <Button variant="outline" onClick={handleStartQuiz} disabled={loading} className="w-full sm:w-auto h-10">
                  <Play className="h-4 w-4 mr-2" />
                  Retry Quiz
                </Button>
              )}
              {isCompleted && !canRetry && (
                <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Max attempts reached</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-optimized quiz interface dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Quiz: {quiz.title}</DialogTitle>
          </DialogHeader>
          <QuizInterface
            quiz={quiz}
            moduleId={moduleId}
            courseId={courseId}
            onComplete={handleQuizComplete}
            onClose={handleCloseQuiz}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 