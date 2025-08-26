'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Award,
  Star,
  CheckCircle,
  Play,
  Pause,
  Zap
} from 'lucide-react';

interface ProgressData {
  dailyProgress: {
    date: string;
    timeSpent: number;
    modulesCompleted: number;
    quizzesTaken: number;
    score: number;
  }[];
  weeklyStats: {
    week: string;
    totalTime: number;
    averageScore: number;
    streak: number;
  }[];
  subjectBreakdown: {
    subject: string;
    progress: number;
    timeSpent: number;
    modulesCompleted: number;
  }[];
  milestones: {
    id: string;
    title: string;
    description: string;
    achieved: boolean;
    achievedAt?: string;
    target: number;
    current: number;
    type: 'time' | 'modules' | 'score' | 'streak';
  }[];
}

interface ProgressVisualizationProps {
  studentId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export default function ProgressVisualization({ studentId, timeRange = '30d' }: ProgressVisualizationProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProgressData | null>(null);
  const [selectedChart, setSelectedChart] = useState<'daily' | 'weekly' | 'subjects' | 'milestones'>('daily');

  useEffect(() => {
    fetchProgressData();
  }, [studentId, timeRange]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/progress-visualization?studentId=${studentId}&timeRange=${timeRange}`);
      if (response.ok) {
        const progressData = await response.json();
        setData(progressData);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load progress data. Please try again or contact support if the problem persists.`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'time':
        return <Clock className="w-4 h-4" />;
      case 'modules':
        return <CheckCircle className="w-4 h-4" />;
      case 'score':
        return <Target className="w-4 h-4" />;
      case 'streak':
        return <Zap className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'time':
        return 'text-blue-600';
      case 'modules':
        return 'text-green-600';
      case 'score':
        return 'text-purple-600';
      case 'streak':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progress Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progress Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No progress data available.</p>
            <p className="text-sm">Start learning to see your progress visualization!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure all data properties exist with fallbacks
  const safeData = {
    dailyProgress: data.dailyProgress || [],
    weeklyStats: data.weeklyStats || [],
    subjectBreakdown: data.subjectBreakdown || [],
    milestones: data.milestones || []
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progress Visualization
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedChart === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart('daily')}
            >
              <LineChart className="w-4 h-4 mr-1" />
              Daily
            </Button>
            <Button
              variant={selectedChart === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart('weekly')}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Weekly
            </Button>
            <Button
              variant={selectedChart === 'subjects' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart('subjects')}
            >
              <PieChart className="w-4 h-4 mr-1" />
              Subjects
            </Button>
            <Button
              variant={selectedChart === 'milestones' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart('milestones')}
            >
              <Award className="w-4 h-4 mr-1" />
              Milestones
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedChart === 'daily' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {safeData.dailyProgress && safeData.dailyProgress.length > 0 ? formatTime(safeData.dailyProgress[safeData.dailyProgress.length - 1].timeSpent) : '0m'}
                </div>
                <div className="text-sm text-muted-foreground">Today's Study Time</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {safeData.dailyProgress && safeData.dailyProgress.length > 0 ? safeData.dailyProgress[safeData.dailyProgress.length - 1].modulesCompleted : 0}
                </div>
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {safeData.dailyProgress && safeData.dailyProgress.length > 0 ? safeData.dailyProgress[safeData.dailyProgress.length - 1].quizzesTaken : 0}
                </div>
                <div className="text-sm text-muted-foreground">Quizzes Taken</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {safeData.dailyProgress && safeData.dailyProgress.length > 0 ? safeData.dailyProgress[safeData.dailyProgress.length - 1].score : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Daily Progress Trend</h4>
              <div className="space-y-3">
                {safeData.dailyProgress.slice(-7).map((day, index) => (
                  <div key={day.date} className="flex items-center space-x-4">
                    <div className="w-20 text-sm text-muted-foreground">
                      {formatDate(day.date)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{formatTime(day.timeSpent)}</span>
                        <span className="text-sm text-muted-foreground">{day.score}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={Math.min((day.timeSpent / 120) * 100, 100)} className="flex-1 h-2" />
                        <Badge variant="outline" className="text-xs">
                          {day.modulesCompleted} modules
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedChart === 'weekly' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(safeData.weeklyStats.reduce((sum, week) => sum + week.totalTime, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Study Time</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {safeData.weeklyStats && safeData.weeklyStats.length > 0 ? Math.round(safeData.weeklyStats.reduce((sum, week) => sum + week.averageScore, 0) / safeData.weeklyStats.length) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {safeData.weeklyStats.length > 0 ? Math.max(...safeData.weeklyStats.map(w => w.streak)) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Weekly Performance</h4>
              <div className="space-y-3">
                {safeData.weeklyStats.map((week, index) => (
                  <div key={week.week} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Week {week.week}</h5>
                      <Badge variant="outline">
                        {week.streak} day streak
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Study Time</div>
                        <div className="text-lg font-semibold">{formatTime(week.totalTime)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                        <div className="text-lg font-semibold">{week.averageScore}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedChart === 'subjects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeData.subjectBreakdown.map((subject) => (
                <div key={subject.subject} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">{subject.subject}</h5>
                    <Badge variant="outline">
                      {subject.modulesCompleted} modules
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {formatTime(subject.timeSpent)} spent
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedChart === 'milestones' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeData.milestones.map((milestone) => (
                <div key={milestone.id} className={`p-4 border rounded-lg ${milestone.achieved ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${milestone.achieved ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        {getMilestoneIcon(milestone.type)}
                      </div>
                      <h5 className="font-medium">{milestone.title}</h5>
                    </div>
                    {milestone.achieved && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Achieved
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {milestone.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.current}/{milestone.target}</span>
                    </div>
                    <Progress 
                      value={Math.min((milestone.current / milestone.target) * 100, 100)} 
                      className="h-2" 
                    />
                    {milestone.achieved && milestone.achievedAt && (
                      <div className="text-xs text-muted-foreground">
                        Achieved on {formatDate(milestone.achievedAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 