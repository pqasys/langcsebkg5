'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Users, 
  Share2, 
  Copy, 
  Star, 
  TrendingUp, 
  Building, 
  FileText,
  Download,
  Upload,
  Activity,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface CollaborationStats {
  totalShared: number;
  totalReceived: number;
  totalCopied: number;
  totalCopiedByOthers: number;
  averageRating: number;
  totalRatings: number;
  topInstitutions: Array<{
    id: string;
    name: string;
    sharedCount: number;
    receivedCount: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'shared' | 'copied' | 'rated';
    question: {
      id: string;
      question_text: string;
    };
    user: {
      id: string;
      name: string;
    };
    institution: {
      id: string;
      name: string;
    };
    timestamp: string;
    rating?: number;
  }>;
  monthlyStats: Array<{
    month: string;
    shared: number;
    received: number;
    copied: number;
  }>;
}

export default function CollaborationPage() {
  const [stats, setStats] = useState<CollaborationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollaborationStats();
  }, []);

  const fetchCollaborationStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/collaboration/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error('Failed to fetch collaboration statistics');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load collaboration stats. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch collaboration statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No collaboration data available</h3>
        <p className="text-muted-foreground">
          Start sharing questions to see collaboration statistics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Collaboration Dashboard</h1>
        <p className="text-muted-foreground">
          Track your institution's question sharing and collaboration metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Questions Shared</p>
                <p className="text-2xl font-bold">{stats.totalShared || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Questions Received</p>
                <p className="text-2xl font-bold">{stats.totalReceived || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Copy className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Times Copied</p>
                <p className="text-2xl font-bold">{stats.totalCopiedByOthers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="partners">Collaboration Partners</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Monthly Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(stats.monthlyStats || []).slice(-6).map((monthData, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{monthData.month}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">{monthData.shared}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">{monthData.received}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">{monthData.copied}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Rating Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Ratings</span>
                    <Badge variant="secondary">{stats.totalRatings || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Quality Score</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${((stats.averageRating || 0) / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(((stats.averageRating || 0) / 5) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats.recentActivity || []).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'shared' && <Share2 className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'copied' && <Copy className="h-5 w-5 text-green-500" />}
                      {activity.type === 'rated' && <Star className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{activity.user.name}</span>
                        <span className="text-sm text-muted-foreground">from</span>
                        <span className="font-medium">{activity.institution.name}</span>
                        {activity.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{activity.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {activity.question.question_text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Top Collaboration Partners</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats.topInstitutions || []).map((institution, index) => (
                  <div key={institution.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{institution.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {institution.sharedCount} shared, {institution.receivedCount} received
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{institution.sharedCount + institution.receivedCount} total</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Engagement Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Questions Shared This Month</span>
                    <Badge variant="secondary">
                      {(stats.monthlyStats || [])[(stats.monthlyStats || []).length - 1]?.shared || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Questions Received This Month</span>
                    <Badge variant="secondary">
                      {(stats.monthlyStats || [])[(stats.monthlyStats || []).length - 1]?.received || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Times Copied This Month</span>
                    <Badge variant="secondary">
                      {(stats.monthlyStats || [])[(stats.monthlyStats || []).length - 1]?.copied || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Collaboration Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(stats.totalShared || 0) >= 10 && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Question Sharer (10+ questions shared)</span>
                    </div>
                  )}
                  {(stats.totalCopiedByOthers || 0) >= 5 && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Popular Creator (5+ times copied)</span>
                    </div>
                  )}
                  {(stats.averageRating || 0) >= 4.5 && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Quality Contributor (4.5+ average rating)</span>
                    </div>
                  )}
                  {(stats.topInstitutions?.length || 0) >= 3 && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Network Builder (3+ partner institutions)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 