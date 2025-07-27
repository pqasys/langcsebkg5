'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
// import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2,
  Calendar,
  Download,
  BarChart3
} from 'lucide-react';

interface RevenueMetrics {
  totalRevenue: number;
  subscriptionRevenue: number;
  commissionRevenue: number;
  studentRevenue: number;
  growthRate: number;
  topRevenueSources: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
}

interface RevenueBreakdown {
  byInstitution: Array<{
    institutionId: string;
    institutionName: string;
    subscriptionRevenue: number;
    commissionRevenue: number;
    totalRevenue: number;
    studentCount: number;
    courseCount: number;
  }>;
  byPlan: Array<{
    planType: string;
    subscriptionCount: number;
    subscriptionRevenue: number;
    commissionRate: number;
    totalCommission: number;
  }>;
  byTimeframe: Array<{
    period: string;
    revenue: number;
    growth: number;
  }>;
}

export default function AdminRevenuePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [breakdown, setBreakdown] = useState<RevenueBreakdown | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReportType, setSelectedReportType] = useState('metrics');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchRevenueData();
  }, [session, status, selectedPeriod]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      
      if (selectedPeriod === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (selectedPeriod === 'quarter') {
        startDate.setMonth(startDate.getMonth() - 3);
      } else if (selectedPeriod === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const [metricsResponse, breakdownResponse] = await Promise.all([
        fetch(`/api/admin/revenue?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&type=metrics`),
        fetch(`/api/admin/revenue?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&type=breakdown`)
      ]);

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }

      if (breakdownResponse.ok) {
        const breakdownData = await breakdownResponse.json();
        setBreakdown(breakdownData);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      console.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (selectedPeriod === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (selectedPeriod === 'quarter') {
        startDate.setMonth(startDate.getMonth() - 3);
      } else if (selectedPeriod === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const response = await fetch('/api/admin/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          format: 'csv'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        // // // console.log('Report downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      console.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={downloadReport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Revenue Metrics Cards */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        {metrics.growthRate >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${metrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(metrics.growthRate)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Subscription Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${metrics.subscriptionRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Commission Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${metrics.commissionRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Student Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${metrics.studentRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Revenue Breakdown */}
          {breakdown && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Revenue Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Revenue Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics?.topRevenueSources.slice(0, 5).map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{source.name}</p>
                            <p className="text-sm text-gray-500">{source.percentage.toFixed(1)}% of total</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">${source.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Subscription Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {breakdown.byPlan.map((plan, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{plan.planType}</p>
                          <p className="text-sm text-gray-500">{plan.subscriptionCount} subscriptions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${plan.subscriptionRevenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{plan.commissionRate}% commission</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Monthly Revenue Chart */}
          {breakdown && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {breakdown.byTimeframe.map((period, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{period.period}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900">${period.revenue.toLocaleString()}</span>
                        <div className="flex items-center">
                          {period.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm ${period.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(period.growth)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 