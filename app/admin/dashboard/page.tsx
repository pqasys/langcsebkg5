'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Building2, BookOpen, DollarSign, TrendingUp, AlertCircle, Settings, UserCheck, GraduationCap } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AdminStats {
  statistics: {
    totalUsers: number;
    totalInstitutions: number;
    totalCourses: number;
    totalRevenue: number;
    totalEnrollments: number;
    totalCompletions: number;
    totalCommission: number;
    totalInstitutionRevenue: number;
  };
  recentEnrollments: unknown[];
  recentUsers: unknown[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle authentication and authorization
  useEffect(() => {
    if (status === 'loading') {
      return; // Still loading, wait
    }

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Fetch admin stats
  useEffect(() => {
    if (status !== 'authenticated' || !session || session.user.role !== 'ADMIN') {
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session, status]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please sign in to access the admin dashboard</p>
          <Button 
            onClick={() => router.push('/auth/signin')}
            variant="primary-high"
            size="mobile-lg"
            aria-label="Sign in to access admin dashboard"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Show error if not admin
  if (session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">Access denied. Admin privileges required.</p>
          <Button 
            onClick={() => router.push('/')}
            variant="primary-high"
            size="mobile-lg"
            aria-label="Return to home page"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Welcome back, {session.user.name} ({session.user.email})
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Admin
            </Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300">
              Role: {session.user.role}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-500">Error</span>
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalUsers || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Institutions</CardTitle>
              <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-500">Error</span>
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalInstitutions || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-500">Error</span>
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalCourses || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-500">Error</span>
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalRevenue?.toLocaleString() || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-500">Error</span>
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalEnrollments || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Commission</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-500">Error</span>
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalCommission?.toLocaleString() || 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error Loading Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <Button 
                onClick={() => navigate.reload()} 
                variant="danger-high"
                size="mobile-sm"
                aria-label="Retry loading dashboard statistics"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Manage Institutions
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                View and manage all institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/admin/institutions')}
                variant="primary-high"
                size="mobile-lg"
                className="w-full"
                aria-label="Navigate to institutions management page"
              >
                Go to Institutions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                Manage Users
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                View and manage all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/admin/users')}
                variant="success-high"
                size="mobile-lg"
                className="w-full"
                aria-label="Navigate to users management page"
              >
                Go to Users
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Manage Courses
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                View and manage all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/admin/courses')}
                variant="pricing"
                size="mobile-lg"
                className="w-full"
                aria-label="Navigate to courses management page"
              >
                Go to Courses
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Settings
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Manage system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/admin/settings')}
                variant="secondary"
                size="mobile-lg"
                className="w-full"
                aria-label="Navigate to system settings page"
              >
                Go to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 