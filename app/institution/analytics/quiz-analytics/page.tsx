'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Brain,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface QuizAnalytics {
  overview: {
    totalQuizzes: number;
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
    averageTime: number;
  };
  performanceByQuiz: Array<{
    quizId: string;
    quizTitle: string;
    attempts: number;
    averageScore: number;
    completionRate: number;
    averageTime: number;
  }>;
  difficultyAnalysis: Array<{
    difficulty: string;
    count: number;
    averageScore: number;
    successRate: number;
  }>;
  questionPerformance: Array<{
    questionId: string;
    question: string;
    type: string;
    difficulty: string;
    timesAsked: number;
    timesCorrect: number;
    successRate: number;
    averageTime: number;
  }>;
  adaptiveQuizStats: {
    totalAdaptiveQuizzes: number;
    averageAbilityEstimate: number;
    averageConfidence: number;
    terminationReasons: Array<{
      reason: string;
      count: number;
    }>;
  };
  timeSeriesData: Array<{
    date: string;
    attempts: number;
    averageScore: number;
    completions: number;
  }>;
}

export default function QuizAnalyticsPage() {
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedQuiz, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/analytics/quiz?quizId=${selectedQuiz}&timeRange=${timeRange}`);
      if (!response.ok) throw new Error(`Failed to fetch analytics - Context: if (!response.ok) throw new Error('Failed to fetch...`);
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load analytics. Please try again or contact support if the problem persists.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading quiz analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quiz Analytics Dashboard</h1>
        <div className="flex gap-4">
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Quiz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quizzes</SelectItem>
              {analytics.performanceByQuiz.map((quiz) => (
                <SelectItem key={quiz.quizId} value={quiz.quizId}>
                  {quiz.quizTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalQuizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalAttempts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.averageScore.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.completionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics.overview.averageTime)}m</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
          <TabsTrigger value="adaptive">Adaptive Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performanceByQuiz.map((quiz) => (
                    <div key={quiz.quizId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{quiz.quizTitle}</h4>
                          <div className="text-sm text-muted-foreground">
                            {quiz.attempts} attempts • {quiz.averageTime.toFixed(1)}m avg
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{quiz.averageScore.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">
                            {quiz.completionRate.toFixed(1)}% completion
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.difficultyAnalysis.map((item) => (
                    <div key={item.difficulty} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.difficulty}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.count} questions
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.averageScore.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">
                            {item.successRate.toFixed(1)}% success
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.successRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.performanceByQuiz.map((quiz) => (
                  <div key={quiz.quizId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium">{quiz.quizTitle}</h4>
                        <div className="flex gap-4 mt-2">
                          <div className="text-sm">
                            <span className="font-medium">{quiz.attempts}</span> attempts
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{quiz.averageTime.toFixed(1)}m</span> avg time
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {quiz.averageScore.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quiz.completionRate.toFixed(1)}% completion
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Question Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.questionPerformance.map((question) => (
                  <div key={question.questionId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{question.question}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{question.type}</Badge>
                          <Badge variant="outline">{question.difficulty}</Badge>
                          <Badge variant="outline">{question.successRate.toFixed(1)}%</Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{question.timesAsked} attempts</div>
                        <div>{question.timesCorrect} correct</div>
                        <div>{Math.round(question.averageTime)}s avg</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${question.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adaptive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Adaptive Quiz Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Adaptive Quiz Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.adaptiveQuizStats.totalAdaptiveQuizzes}
                    </div>
                    <div className="text-sm text-muted-foreground">Adaptive Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.adaptiveQuizStats.averageAbilityEstimate.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Ability</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(analytics.adaptiveQuizStats.averageConfidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Confidence</div>
                </div>
              </CardContent>
            </Card>

            {/* Termination Reasons */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Termination Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.adaptiveQuizStats.terminationReasons.map((reason) => (
                    <div key={reason.reason} className="flex justify-between items-center">
                      <span className="text-sm">{reason.reason}</span>
                      <Badge variant="outline">{reason.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 