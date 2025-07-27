'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  CheckCircle,
  XCircle,
  BookOpen
} from 'lucide-react';

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

interface QuizProgressProps {
  recentAttempts: QuizAttempt[];
  stats: QuizStats;
}

export function QuizProgress({ recentAttempts, stats }: QuizProgressProps) {
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

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Quiz Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.completedQuizzes} quizzes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalQuizzes > 0 ? Math.round((stats.quizzesPassed / stats.totalQuizzes) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.quizzesPassed} of {stats.totalQuizzes} passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestScore}%</div>
            <p className="text-xs text-muted-foreground">
              Highest quiz score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Time spent on quizzes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quiz Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Recent Quiz Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttempts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No quiz activity yet.</p>
              <p className="text-sm">Start taking quizzes to see your activity here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAttempts.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{attempt.quizTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      {attempt.courseTitle} • {attempt.moduleTitle}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        {attempt.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      {attempt.timeSpent > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {formatTime(attempt.timeSpent)} spent
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(attempt.percentage || 0)}`}>
                      {attempt.percentage !== undefined && attempt.percentage !== null 
                        ? `${attempt.percentage}%` 
                        : 'N/A'
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(attempt.completedAt || attempt.startedAt)}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      Attempt {attempt.attemptNumber}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Progress Chart */}
      {recentAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAttempts.slice(0, 10).map((attempt, index) => (
                <div key={attempt.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1 mr-4">
                      {attempt.quizTitle}
                    </span>
                    <span className={`font-medium ${getScoreColor(attempt.percentage || 0)}`}>
                      {attempt.percentage !== undefined && attempt.percentage !== null 
                        ? `${attempt.percentage}%` 
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <Progress 
                    value={attempt.percentage || 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 