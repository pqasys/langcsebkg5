'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  Lightbulb, 
  History, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface TemplateAnalytics {
  totalUsage: number;
  averageSuccessRate: number;
  usageStats: any[];
  versions: any[];
  suggestions: any[];
  recentUsage: any[];
  trends: {
    dailyUsage: Record<string, number>;
    totalUsage: number;
    averageDailyUsage: number;
  };
}

export default function TemplateAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const [analytics, setAnalytics] = useState<TemplateAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [templateId, selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/question-templates/${templateId}/analytics?days=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        toast.error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    try {
      const response = await fetch(`/api/institution/question-templates/${templateId}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_suggestions' }),
      });

      if (response.ok) {
        toast.success('Suggestions generated successfully');
        fetchAnalytics(); // Refresh data
      } else {
        toast.error('Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuggestionTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <AlertCircle className="h-4 w-4" />;
      case 'optimization': return <Zap className="h-4 w-4" />;
      case 'popularity': return <TrendingUp className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-8 text-center text-red-500">Analytics not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Template Analytics</h1>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateSuggestions} variant="outline">
            <Lightbulb className="h-4 w-4 mr-2" />
            Generate Suggestions
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.trends.averageDailyUsage.toFixed(1)} per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.averageSuccessRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Versions</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.versions.length}</div>
            <p className="text-xs text-muted-foreground">
              Template iterations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.suggestions.length}</div>
            <p className="text-xs text-muted-foreground">
              Pending improvements
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Usage by Context */}
            <Card>
              <CardHeader>
                <CardTitle>Usage by Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.usageStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm capitalize">
                        {stat.usage_context.replace('_', ' ')}
                      </span>
                      <Badge variant="secondary">{stat._count.id}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.recentUsage.slice(0, 5).map((usage, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{usage.usedByUser.name}</span>
                      <span className="text-muted-foreground">
                        {new Date(usage.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center space-x-1">
                {Object.entries(analytics.trends.dailyUsage).map(([date, count]) => (
                  <div
                    key={date}
                    className="bg-primary rounded-t"
                    style={{
                      height: `${(count / Math.max(...Object.values(analytics.trends.dailyUsage))) * 200}px`,
                      width: '20px',
                    }}
                    title={`${date}: ${count} uses`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Daily usage over the last {selectedPeriod} days
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Version History</CardTitle>
              <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    Create Version
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Version</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    Version management feature coming soon...
                  </p>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.versions.map((version) => (
                  <div key={version.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">v{version.version_number} - {version.name}</h4>
                        <p className="text-sm text-muted-foreground">{version.description}</p>
                        {version.change_log && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Changes: {version.change_log}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">v{version.version_number}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(version.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSuggestionTypeIcon(suggestion.suggestion_type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority}
                            </Badge>
                            <Badge variant="outline">
                              {(suggestion.confidence_score * 100).toFixed(0)}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            {suggestion.based_on_usage && <span>Based on usage</span>}
                            {suggestion.based_on_performance && <span>Based on performance</span>}
                            {suggestion.based_on_feedback && <span>Based on feedback</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={suggestion.status === 'PENDING' ? 'secondary' : 'default'}>
                          {suggestion.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(suggestion.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 