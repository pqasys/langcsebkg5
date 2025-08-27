'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  RefreshCw,
} from 'lucide-react';

interface ThresholdEffectivenessMetrics {
  language: string;
  country?: string;
  region?: string;
  totalSessions: number;
  sessionsAboveThreshold: number;
  sessionsBelowThreshold: number;
  cancellationRate: number;
  averageAttendance: number;
  averageInstructorCost: number;
  averageRevenue: number;
  profitMargin: number;
  thresholdConfig: {
    minAttendanceThreshold: number;
    profitMarginThreshold: number;
    instructorHourlyRate: number;
    platformRevenuePerStudent: number;
  };
  timeRange: {
    startDate: Date;
    endDate: Date;
  };
}

interface LanguagePerformanceComparison {
  language: string;
  metrics: ThresholdEffectivenessMetrics;
  rank: number;
  improvement: number;
}

interface ThresholdAnalysisReport {
  summary: {
    totalLanguages: number;
    totalSessions: number;
    overallCancellationRate: number;
    averageProfitMargin: number;
    bestPerformingLanguage: string;
    worstPerformingLanguage: string;
  };
  languageMetrics: ThresholdEffectivenessMetrics[];
  recommendations: string[];
  generatedAt: Date;
}

interface RealTimeMetrics {
  activeSessions: number;
  sessionsAtRisk: number;
  sessionsAboveThreshold: number;
  totalExpectedRevenue: number;
  totalExpectedCost: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard() {
  const [report, setReport] = useState<ThresholdAnalysisReport | null>(null);
  const [topLanguages, setTopLanguages] = useState<LanguagePerformanceComparison[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/analytics/threshold-effectiveness?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      if (!response.ok) throw new Error('Failed to fetch report');
      const data = await response.json();
      setReport(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopLanguages = async () => {
    try {
      const response = await fetch(
        `/api/admin/analytics/top-performing-languages?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&limit=10`
      );
      if (!response.ok) throw new Error('Failed to fetch top languages');
      const data = await response.json();
      setTopLanguages(data.data);
    } catch (err) {
      console.error('Failed to fetch top languages:', err);
    }
  };

  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch('/api/admin/analytics/real-time-metrics');
      if (!response.ok) throw new Error('Failed to fetch real-time metrics');
      const data = await response.json();
      setRealTimeMetrics(data.data);
    } catch (err) {
      console.error('Failed to fetch real-time metrics:', err);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchTopLanguages();
    fetchRealTimeMetrics();
  }, [dateRange]);

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleRefresh = () => {
    fetchReport();
    fetchTopLanguages();
    fetchRealTimeMetrics();
  };

  const exportReport = () => {
    if (!report) return;
    
    const csvContent = [
      ['Language', 'Total Sessions', 'Above Threshold', 'Below Threshold', 'Cancellation Rate (%)', 'Average Attendance', 'Profit Margin (%)'],
      ...report.languageMetrics.map(metric => [
        metric.language,
        metric.totalSessions,
        metric.sessionsAboveThreshold,
        metric.sessionsBelowThreshold,
        metric.cancellationRate.toFixed(2),
        metric.averageAttendance.toFixed(2),
        metric.profitMargin.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threshold-effectiveness-report-${dateRange.startDate}-${dateRange.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 50) return 'text-green-600';
    if (margin >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCancellationRateColor = (rate: number) => {
    if (rate <= 10) return 'text-green-600';
    if (rate <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportReport} disabled={!report}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Real-time Metrics */}
      {realTimeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.activeSessions}</div>
              <p className="text-xs text-muted-foreground">
                Next 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions at Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{realTimeMetrics.sessionsAtRisk}</div>
              <p className="text-xs text-muted-foreground">
                Below threshold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${realTimeMetrics.totalExpectedRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Next 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${realTimeMetrics.totalExpectedCost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Instructor costs
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="languages">Language Performance</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {report && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Languages</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{report.summary.totalLanguages}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{report.summary.totalSessions}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getCancellationRateColor(report.summary.overallCancellationRate)}`}>
                      {report.summary.overallCancellationRate.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getProfitMarginColor(report.summary.averageProfitMargin)}`}>
                      {report.summary.averageProfitMargin.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Best/Worst Performing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Best Performing Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {report.summary.bestPerformingLanguage}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Worst Performing Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {report.summary.worstPerformingLanguage}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          {report && (
            <Card>
              <CardHeader>
                <CardTitle>Language Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Language</TableHead>
                      <TableHead>Total Sessions</TableHead>
                      <TableHead>Above Threshold</TableHead>
                      <TableHead>Below Threshold</TableHead>
                      <TableHead>Cancellation Rate</TableHead>
                      <TableHead>Avg Attendance</TableHead>
                      <TableHead>Profit Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.languageMetrics.map((metric) => (
                      <TableRow key={metric.language}>
                        <TableCell className="font-medium">{metric.language}</TableCell>
                        <TableCell>{metric.totalSessions}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {metric.sessionsAboveThreshold}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {metric.sessionsBelowThreshold}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getCancellationRateColor(metric.cancellationRate)}>
                            {metric.cancellationRate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>{metric.averageAttendance.toFixed(1)}</TableCell>
                        <TableCell>
                          <span className={getProfitMarginColor(metric.profitMargin)}>
                            {metric.profitMargin.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          {report && (
            <>
              {/* Profit Margin Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Profit Margins by Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.languageMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="language" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="profitMargin" fill="#8884d8" name="Profit Margin (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cancellation Rate Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation Rates by Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.languageMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="language" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cancellationRate" fill="#ff8042" name="Cancellation Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attendance vs Threshold Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance vs Threshold</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.languageMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="language" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageAttendance" fill="#00C49F" name="Average Attendance" />
                      <Bar dataKey="thresholdConfig.minAttendanceThreshold" fill="#FFBB28" name="Threshold" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {report && (
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.recommendations.map((recommendation, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Top Performing Languages */}
      {topLanguages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Profit Margin</TableHead>
                  <TableHead>Improvement</TableHead>
                  <TableHead>Total Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLanguages.map((lang) => (
                  <TableRow key={lang.language}>
                    <TableCell>
                      <Badge variant="outline">#{lang.rank}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{lang.language}</TableCell>
                    <TableCell>
                      <span className={getProfitMarginColor(lang.metrics.profitMargin)}>
                        {lang.metrics.profitMargin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {lang.improvement > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={lang.improvement > 0 ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(lang.improvement).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{lang.metrics.totalSessions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
