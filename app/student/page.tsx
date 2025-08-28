'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle,
  CreditCard,
  Crown,
  Zap,
  Home,
  BarChart3,
  Activity,
  Settings
} from 'lucide-react';
import CourseAccessStatus from '@/app/components/student/CourseAccessStatus';
import { QuizProgress } from '@/components/student/QuizProgress';
import LearningPath from '@/app/components/student/LearningPath';
import ProgressVisualization from '@/app/components/student/ProgressVisualization';
import PersonalizedRecommendations from '@/app/components/student/PersonalizedRecommendations';
import HostProgressionCard from '@/components/student/HostProgressionCard';

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

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  currentPlan?: string;
  features: Record<string, any>;
  subscriptionEndDate?: Date;
  canUpgrade: boolean;
  canDowngrade: boolean;
  canCancel: boolean;
  nextBillingDate?: Date;
  billingHistory: BillingHistoryItem[];
}

interface BillingHistoryItem {
  id: string;
  billingDate: Date;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  invoiceNumber?: string;
  description?: string;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Session state management
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0
  });

  // New state for enhanced progress tracking
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentModules, setRecentModules] = useState<ModuleProgress[]>([]);

  // Quiz-related state
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [recentQuizAttempts, setRecentQuizAttempts] = useState<QuizAttempt[]>([]);

  // Subscription state
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionStatus | null>(null);

  // Handle session loading and authentication
  useEffect(() => {
    if (status === 'loading') {
      return; // Still loading, wait
    }

    if (status === 'unauthenticated' || !session) {
      console.log('StudentDashboard: No session, redirecting to signin');
      router.replace('/auth/signin');
      return;
    }

    // Check if user is actually a student
    if (session.user?.role !== 'STUDENT') {
      console.log('StudentDashboard: User is not a student, redirecting');
      router.replace('/dashboard');
      return;
    }

    // Session is valid, fetch dashboard data
    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('StudentDashboard: Fetching dashboard data...');
      
      // Fetch existing dashboard data with retry logic
      const dashboardResponse = await fetch('/api/student/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      console.log('StudentDashboard: Dashboard API response status:', dashboardResponse.status);

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log('StudentDashboard: Dashboard data received:', dashboardData);
        
        setCourses(dashboardData.courses || []);
        setStats(dashboardData.stats || {
          totalCourses: 0,
          activeCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          averageProgress: 0
        });
      } else {
        const errorData = await dashboardResponse.json().catch(() => ({}));
        console.error('StudentDashboard: Dashboard API error:', dashboardResponse.status, errorData);
        
        if (dashboardResponse.status === 401) {
          // Unauthorized - session might be invalid
          setError('Session expired. Please sign in again.');
          router.replace('/auth/signin');
          return;
        } else if (dashboardResponse.status === 404) {
          // Student not found
          setError('Student profile not found. Please contact support.');
        } else {
          // Other server error
          setError('Failed to load dashboard data. Please try again.');
        }
        
        // Set fallback stats if API call fails
        setStats({
          totalCourses: 0,
          activeCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          averageProgress: 0
        });
      }

      // Fetch additional data with individual error handling
      const fetchWithFallback = async (url: string, fallbackData: any, endpointName: string) => {
        try {
          console.log(`StudentDashboard: Fetching ${endpointName}...`);
          const response = await fetch(url, {
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`StudentDashboard: ${endpointName} data received:`, data);
            return data || fallbackData;
          } else {
            console.warn(`StudentDashboard: ${endpointName} failed with status:`, response.status);
            return fallbackData;
          }
        } catch (error) {
          console.warn(`StudentDashboard: ${endpointName} fetch error:`, error);
          return fallbackData;
        }
      };

      // Fetch all additional data in parallel
      const [statsData, achievementsData, modulesData, quizData, subscriptionData] = await Promise.all([
        fetchWithFallback('/api/student/dashboard/stats', getFallbackData('learningStats'), 'stats'),
        fetchWithFallback('/api/student/dashboard/achievements', [], 'achievements'),
        fetchWithFallback('/api/student/dashboard/recent-modules', [], 'recent-modules'),
        fetchWithFallback('/api/student/dashboard/quiz-stats', { stats: getFallbackData('quizStats'), recentAttempts: [] }, 'quiz-stats'),
        fetchWithFallback('/api/student/subscription', { subscriptionStatus: getFallbackData('subscriptionStatus') }, 'subscription')
      ]);

      // Set the data from the fetch results
      setLearningStats(statsData);
      setAchievements(achievementsData);
      setRecentModules(modulesData);
      setQuizStats(quizData.stats);
      setRecentQuizAttempts(quizData.recentAttempts);
      setSubscriptionData(subscriptionData.subscriptionStatus);
      
      console.log('StudentDashboard: All data loaded successfully');
      
    } catch (error) {
      console.error('StudentDashboard: Error occurred:', error);
      
      // Retry logic for transient errors
      if (retryCount < maxRetries) {
        console.log(`StudentDashboard: Retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchDashboardData();
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setError('Failed to load dashboard data. Please refresh the page or contact support if the problem persists.');
      toast.error('Failed to load dashboard data');
      
      // Set fallback data on error
      setStats({
        totalCourses: 0,
        activeCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        averageProgress: 0
      });
      setLearningStats(getFallbackData('learningStats') as LearningStats);
      setAchievements([]);
      setRecentModules([]);
      setQuizStats(getFallbackData('quizStats') as QuizStats);
      setRecentQuizAttempts([]);
      setSubscriptionData(getFallbackData('subscriptionStatus') as SubscriptionStatus);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get fallback data
  const getFallbackData = (type: string): any => {
    const fallbackData = {
      learningStats: {
        totalTimeSpent: 0,
        averageSessionTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalSessions: 0,
        thisWeekSessions: 0,
        averageScore: 0
      },
      quizStats: {
        totalAttempts: 0,
        completedQuizzes: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        bestScore: 0,
        quizzesPassed: 0,
        totalQuizzes: 0
      },
      subscriptionStatus: {
        hasActiveSubscription: false,
        currentPlan: null,
        features: {},
        subscriptionEndDate: null,
        canUpgrade: false,
        canDowngrade: false,
        canCancel: false,
        nextBillingDate: null,
        billingHistory: []
      }
    };
    return fallbackData[type as keyof typeof fallbackData] || {};
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

  const getSubscriptionStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'TRIAL':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'PAST_DUE':
        return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-gray-100 text-gray-800">Suspended</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">No Subscription</Badge>;
    }
  };

  const getPlanIcon = (planType?: string) => {
    switch (planType) {
      case 'PRO':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'PREMIUM':
        return <Star className="h-4 w-4 text-blue-600" />;
      case 'BASIC':
        return <Zap className="h-4 w-4 text-green-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <Activity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dashboard Error</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                setError(null);
                setRetryCount(0);
                fetchDashboardData();
              }}
              variant="primary-high"
              size="mobile-lg"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => router.push('/auth/signin')}
              variant="outline"
              size="mobile-lg"
            >
              Sign In Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthenticated state
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Community CTA Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Join the FluentShip Community</h3>
                  <p className="text-sm text-gray-600">Connect with fellow learners, share achievements, and find study partners</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/features/community-learning')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Explore Community
              </Button>
              <Button 
                size="sm"
                onClick={() => router.push('/features/community-learning')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Share Achievement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status Section - Always Visible */}
      {subscriptionData && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Subscription Status</CardTitle>
              </div>
              {getSubscriptionStatusBadge(subscriptionData.currentPlan)}
            </div>
          </CardHeader>
          <CardContent>
            {subscriptionData.hasActiveSubscription ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  {getPlanIcon(subscriptionData.currentPlan)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {subscriptionData.currentPlan === 'PRO' ? 'Pro Plan' : 
                       subscriptionData.currentPlan === 'PREMIUM' ? 'Premium Plan' : 
                       subscriptionData.currentPlan === 'BASIC' ? 'Basic Plan' : 'Current Plan'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {subscriptionData.features.maxCourses === -1 ? 'Unlimited' : subscriptionData.features.maxCourses} courses
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Next Billing</p>
                    <p className="text-xs text-gray-600">
                      {subscriptionData.nextBillingDate ? formatDate(subscriptionData.nextBillingDate.toString()) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Star className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Features</p>
                    <p className="text-xs text-gray-600">
                      {subscriptionData.features.maxTests === -1 ? 'Unlimited' : subscriptionData.features.maxTests} tests
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <p className="text-xs text-gray-600">
                      {subscriptionData.currentPlan === 'ACTIVE' ? 'Active' : subscriptionData.currentPlan}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="text-lg font-semibold">No Active Subscription</h3>
                    <p className="text-sm text-gray-600">Upgrade to unlock premium learning features</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button 
                    onClick={() => router.push('/subscription/trial?context=conversation')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Free Trial
                  </Button>
                  <Button 
                    onClick={() => router.push('/student/subscription')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/subscription-signup')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </Button>
                </div>
              </div>
            )}
            
            {subscriptionData.hasActiveSubscription && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/student/subscription')}
                  className="flex-1 sm:flex-none"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
                {subscriptionData.canUpgrade && (
                  <Button 
                    size="sm"
                    onClick={() => router.push('/student/subscription?action=upgrade')}
                    className="flex-1 sm:flex-none"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabbed Dashboard Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Learning Path Section */}
          {session?.user?.id && (
            <LearningPath studentId={session.user.id} />
          )}

          {/* Progress Visualization */}
          {session?.user?.id && (
            <ProgressVisualization studentId={session.user.id} />
          )}
          
          {/* Personalized Recommendations */}
          {session?.user?.id && (
            <PersonalizedRecommendations studentId={session.user.id} maxRecommendations={6} />
          )}

          {/* Enhanced Learning Stats */}
          {learningStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{formatTime(learningStats.totalTimeSpent)}</div>
                  <p className="text-xs text-muted-foreground">
                    {learningStats.totalSessions} sessions completed
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{learningStats.currentStreak} days</div>
                  <p className="text-xs text-muted-foreground">
                    Longest: {learningStats.longestStreak} days
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{learningStats.thisWeekSessions} sessions</div>
                  <p className="text-xs text-muted-foreground">
                    Avg: {formatTime(learningStats.averageSessionTime)} per session
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{learningStats.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Across all quizzes
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Original Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats?.totalCourses || 0}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats?.activeCourses || 0}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats?.completedCourses || 0}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats?.inProgressCourses || 0}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats?.averageProgress || 0}%</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">
                  {subscriptionData?.hasActiveSubscription ? (
                    <div className="flex items-center space-x-1">
                      {getPlanIcon(subscriptionData.currentPlan)}
                      <span className="text-sm">
                        {subscriptionData.currentPlan === 'PRO' ? 'Pro' : 
                         subscriptionData.currentPlan === 'PREMIUM' ? 'Premium' : 
                         subscriptionData.currentPlan === 'BASIC' ? 'Basic' : 'Active'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-lg">None</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {subscriptionData?.hasActiveSubscription ? 'Active Plan' : 'No Subscription'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Host Progression Section - Only show if user is a host */}
        {session?.user?.id && (
          <div className="mb-6 sm:mb-8">
            <HostProgressionCard userId={session.user.id} />
          </div>
        )}

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          {/* Quiz Progress Section */}
          {quizStats && (
            <div className="mb-6 sm:mb-8">
              <QuizProgress 
                recentAttempts={recentQuizAttempts}
                stats={quizStats}
              />
            </div>
          )}

          {/* Continue Learning Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Quick Access to Recent Modules */}
              {recentModules.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Recent Modules</h4>
                  {recentModules.slice(0, 3).map((module) => (
                    <div key={module.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                         onClick={() => {
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
                {courses.filter(c => ['ACTIVE', 'IN_PROGRESS', 'ENROLLED'].includes(c.status)).slice(0, 3).map((course) => (
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
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/student/subscription')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
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
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
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
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 
