'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Eye, 
  Phone, 
  Mail, 
  ExternalLink, 
  Users, 
  Calendar,
  BarChart3,
  Target,
  DollarSign,
  Star,
  Globe,
  Award,
  BookOpen,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LeadTracking } from '@/components/LeadTracking';

interface AnalyticsData {
  totalViews: number;
  totalContacts: number;
  totalWebsiteClicks: number;
  totalCourseClicks: number;
  conversionRate: number;
  dailyStats: {
    date: string;
    views: number;
    contacts: number;
  }[];
  topReferrers: {
    source: string;
    count: number;
  }[];
  recentEvents: {
    id: string;
    eventType: string;
    timestamp: string;
    userAgent?: string;
    referrer?: string;
  }[];
}

interface InstitutionStats {
  courseCount: number;
  studentCount: number;
  totalRevenue: number;
  pendingPaymentsCount: number;
  subscriptionPlan: string;
  isFeatured: boolean;
  commissionRate: number;
  priorityScore: number;
}

export function InstitutionAnalyticsClient() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [institutionStats, setInstitutionStats] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'INSTITUTION') {
      navigate.to('/auth/signin');
      return;
    }
  }, [session, status]);

  const fetchAnalytics = async () => {
    if (!session?.user?.institutionId) return;

    try {
      setLoading(true);
      
      // Fetch lead analytics
      const analyticsResponse = await fetch(`/api/analytics/leads?institutionId=${session.user.institutionId}&timeRange=${timeRange}`);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Fetch institution stats
      const statsResponse = await fetch(`/api/institution/analytics/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setInstitutionStats(statsData);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to load analytics. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'INSTITUTION') {
      fetchAnalytics();
    }
  }, [session, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return { icon: ArrowUpRight, color: 'text-green-600', text: 'New' };
    const growth = ((current - previous) / previous) * 100;
    if (growth > 0) {
      return { icon: ArrowUpRight, color: 'text-green-600', text: `+${growth.toFixed(1)}%` };
    } else if (growth < 0) {
      return { icon: ArrowDownRight, color: 'text-red-600', text: `${growth.toFixed(1)}%` };
    } else {
      return { icon: ArrowUpRight, color: 'text-gray-600', text: '0%' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Track your institution's performance and lead generation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90d')}
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics?.totalViews || 0}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics?.totalContacts || 0}
                  </p>
                </div>
                <Phone className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {analytics ? (analytics.conversionRate * 100).toFixed(1) : '0'}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Website Clicks</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {analytics?.totalWebsiteClicks || 0}
                  </p>
                </div>
                <ExternalLink className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Institution Stats */}
        {institutionStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {institutionStats.courseCount}
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {institutionStats.studentCount}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(institutionStats.totalRevenue)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {institutionStats.pendingPaymentsCount}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subscription</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={institutionStats.subscriptionPlan === 'ENTERPRISE' ? 'default' : 'secondary'}>
                        {institutionStats.subscriptionPlan}
                      </Badge>
                      {institutionStats.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
            <TabsTrigger value="events">Recent Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Lead Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {session?.user?.institutionId && (
                  <LeadTracking 
                    institutionId={session.user.institutionId}
                    showAnalytics={true}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topReferrers.map((referrer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <span className="font-medium">{referrer.source}</span>
                      </div>
                      <Badge variant="secondary">{referrer.count} visits</Badge>
                    </div>
                  ))}
                  {(!analytics?.topReferrers || analytics.topReferrers.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-2" />
                      <p>No traffic data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Lead Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.recentEvents?.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          event.eventType === 'view' ? 'bg-blue-500' :
                          event.eventType === 'contact' ? 'bg-green-500' :
                          event.eventType === 'website_click' ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`} />
                        <div>
                          <p className="font-medium capitalize">{event.eventType.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {event.referrer && (
                        <span className="text-sm text-gray-500 truncate max-w-32">
                          from {new URL(event.referrer).hostname}
                        </span>
                      )}
                    </div>
                  ))}
                  {(!analytics?.recentEvents || analytics.recentEvents.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2" />
                      <p>No recent events</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 