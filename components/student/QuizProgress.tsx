'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Quiz progress component is working!</p>
          <p>Average Score: {stats.averageScore}%</p>
          <p>Total Attempts: {stats.totalAttempts}</p>
        </CardContent>
      </Card>
    </div>
  );
} 