'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  CheckCircle, 
  Circle, 
  Clock, 
  Target, 
  TrendingUp,
  BookOpen,
  Play,
  Award,
  Star,
  ArrowRight,
  Calendar,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LearningPathModule {
  id: string;
  moduleId: string;
  moduleTitle: string;
  courseTitle: string;
  courseId: string;
  order: number;
  status: 'completed' | 'in_progress' | 'not_started' | 'locked';
  progress: number;
  timeSpent: number;
  quizScore?: number;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  skills: string[];
  lastAccessed?: string;
}

interface LearningPathData {
  currentCourse: {
    id: string;
    title: string;
    description: string;
    totalModules: number;
    completedModules: number;
    overallProgress: number;
    estimatedCompletion: string;
    institution: string;
  } | null;
  modules: LearningPathModule[];
  nextRecommendations: {
    courseId: string;
    title: string;
    reason: string;
    matchScore: number;
  }[];
  learningGoals: {
    id: string;
    title: string;
    targetDate: string;
    progress: number;
    status: 'on_track' | 'behind' | 'ahead';
  }[];
}

interface LearningPathProps {
  studentId: string;
}

export default function LearningPath({ studentId }: LearningPathProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LearningPathData | null>(null);
  const [selectedView, setSelectedView] = useState<'path' | 'goals' | 'recommendations'>('path');

  useEffect(() => {
    fetchLearningPathData();
  }, [studentId]);

  const fetchLearningPathData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/learning-path?studentId=${studentId}`);
      if (response.ok) {
        const pathData = await response.json();
        setData(pathData);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load learning path. Please try again or contact support if the problem persists.`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'not_started':
        return <Circle className="w-5 h-5 text-gray-400" />;
      case 'locked':
        return <Clock className="w-5 h-5 text-gray-300" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'text-green-600';
      case 'behind':
        return 'text-red-600';
      case 'ahead':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            My Learning Path
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
            <MapPin className="w-5 h-5" />
            My Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No learning path data available.</p>
            <p className="text-sm">Enroll in a course to see your learning path!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            My Learning Path
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedView === 'path' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('path')}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Path
            </Button>
            <Button
              variant={selectedView === 'goals' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('goals')}
            >
              <Target className="w-4 h-4 mr-1" />
              Goals
            </Button>
            <Button
              variant={selectedView === 'recommendations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('recommendations')}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Next Steps
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedView === 'path' && (
          <div className="space-y-6">
            {/* Current Course Overview */}
            {data.currentCourse ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{data.currentCourse.title}</h3>
                  <Badge variant="outline">{data.currentCourse.institution}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {data.currentCourse.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.currentCourse.completedModules}/{data.currentCourse.totalModules}
                    </div>
                    <div className="text-xs text-muted-foreground">Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.currentCourse.overallProgress}%
                    </div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.currentCourse.estimatedCompletion}
                    </div>
                    <div className="text-xs text-muted-foreground">Est. Completion</div>
                  </div>
                  <div className="text-center">
                    <Button 
                      size="sm" 
                      onClick={() => router.push(`/student/courses/${data.currentCourse.id}`)}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold text-lg mb-2">No Active Course</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You're not currently enrolled in any courses. Browse available courses to start your learning journey!
                </p>
                <Button onClick={() => router.push('/courses')}>
                  Browse Courses
                </Button>
              </div>
            )}

            {/* Learning Path Timeline */}
            {data.currentCourse && data.modules && data.modules.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium">Your Learning Journey</h4>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  
                  {data.modules.map((module, index) => (
                    <div key={module.id} className="relative flex items-start space-x-4 mb-6">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        {getStatusIcon(module.status)}
                      </div>
                      
                      {/* Module content */}
                      <div className="flex-1 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{module.moduleTitle}</h5>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={getDifficultyColor(module.difficulty)}
                            >
                              {module.difficulty}
                            </Badge>
                            {module.quizScore && (
                              <Badge variant="secondary">
                                {module.quizScore}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {module.courseTitle} • Module {module.order}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Time spent: {formatTime(module.timeSpent)}</span>
                            <span>Est. time: {formatTime(module.estimatedTime)}</span>
                          </div>
                        </div>
                        
                        {module.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            className="mt-3"
                            onClick={() => router.push(`/student/courses/${module.courseId}?module=${module.moduleId}`)}
                          >
                            Continue Module
                          </Button>
                        )}
                        
                        {module.status === 'not_started' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="mt-3"
                            onClick={() => router.push(`/student/courses/${module.courseId}?module=${module.moduleId}`)}
                          >
                            Start Module
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : data.currentCourse ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No modules available for this course yet.</p>
                <p className="text-sm">Check back later for learning content!</p>
              </div>
            ) : null}
          </div>
        )}

        {selectedView === 'goals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Learning Goals</h4>
              <Button size="sm" variant="outline">
                <Target className="w-4 h-4 mr-1" />
                Set New Goal
              </Button>
            </div>
            
                          {!data.learningGoals || data.learningGoals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No learning goals set yet.</p>
                <p className="text-sm">Set goals to track your progress!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.learningGoals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{goal.title}</h5>
                      <Badge 
                        variant="outline"
                        className={getGoalStatusColor(goal.status)}
                      >
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Target: {goal.targetDate}</span>
                        <span>{goal.progress >= 100 ? 'Completed!' : 'In Progress'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedView === 'recommendations' && (
          <div className="space-y-4">
            <h4 className="font-medium">Recommended Next Steps</h4>
            
                          {!data.nextRecommendations || data.nextRecommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recommendations available yet.</p>
                <p className="text-sm">Complete more modules to get personalized recommendations!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.nextRecommendations.map((rec, index) => (
                  <div key={rec.courseId} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{rec.title}</h5>
                      <Badge variant="outline">
                        {rec.matchScore}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.reason}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Star className="w-3 h-3" />
                        <span>Based on your progress</span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => router.push(`/courses/${rec.courseId}`)}
                      >
                        View Course
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 