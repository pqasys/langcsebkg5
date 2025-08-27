'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
} from 'recharts';
import {
  Plus,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Target,
  Users,
  DollarSign,
} from 'lucide-react';

interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  language: string;
  country?: string;
  region?: string;
  variantA: {
    minAttendanceThreshold: number;
    profitMarginThreshold: number;
    instructorHourlyRate: number;
    platformRevenuePerStudent: number;
  };
  variantB: {
    minAttendanceThreshold: number;
    profitMarginThreshold: number;
    instructorHourlyRate: number;
    platformRevenuePerStudent: number;
  };
  trafficSplit: number;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ABTestResult {
  testId: string;
  variant: 'A' | 'B';
  totalSessions: number;
  sessionsAboveThreshold: number;
  sessionsBelowThreshold: number;
  cancellationRate: number;
  averageAttendance: number;
  averageRevenue: number;
  averageCost: number;
  profitMargin: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
}

interface ABTestComparison {
  testId: string;
  testName: string;
  language: string;
  variantAResults: ABTestResult;
  variantBResults: ABTestResult;
  winner: 'A' | 'B' | 'TIE' | 'INSUFFICIENT_DATA';
  confidence: number;
  improvement: {
    cancellationRate: number;
    profitMargin: number;
    revenue: number;
  };
  recommendations: string[];
}

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'];

export default function ABTestingDashboard() {
  const [abTests, setAbTests] = useState<ABTestConfig[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTestConfig | null>(null);
  const [testResults, setTestResults] = useState<ABTestComparison | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);

  // Form state for creating new A/B test
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'English',
    country: '',
    region: '',
    variantA: {
      minAttendanceThreshold: 5,
      profitMarginThreshold: 20,
      instructorHourlyRate: 50,
      platformRevenuePerStudent: 15
    },
    variantB: {
      minAttendanceThreshold: 7,
      profitMarginThreshold: 25,
      instructorHourlyRate: 50,
      platformRevenuePerStudent: 15
    },
    trafficSplit: 50,
    startDate: '',
    endDate: '',
    status: 'DRAFT' as const
  });

  const fetchABTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/ab-testing?language=${selectedLanguage}`);
      if (!response.ok) throw new Error('Failed to fetch A/B tests');
      const data = await response.json();
      setAbTests(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch A/B tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResults = async (testId: string) => {
    try {
      const response = await fetch(`/api/admin/ab-testing/${testId}/results`);
      if (!response.ok) throw new Error('Failed to fetch test results');
      const data = await response.json();
      setTestResults(data.data);
    } catch (err) {
      console.error('Failed to fetch test results:', err);
    }
  };

  const createABTest = async () => {
    try {
      const response = await fetch('/api/admin/ab-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create A/B test');
      
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        language: 'English',
        country: '',
        region: '',
        variantA: {
          minAttendanceThreshold: 5,
          profitMarginThreshold: 20,
          instructorHourlyRate: 50,
          platformRevenuePerStudent: 15
        },
        variantB: {
          minAttendanceThreshold: 7,
          profitMarginThreshold: 25,
          instructorHourlyRate: 50,
          platformRevenuePerStudent: 15
        },
        trafficSplit: 50,
        startDate: '',
        endDate: '',
        status: 'DRAFT'
      });
      
      fetchABTests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create A/B test');
    }
  };

  const updateTestStatus = async (testId: string, status: ABTestConfig['status']) => {
    try {
      const response = await fetch(`/api/admin/ab-testing/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update test status');
      
      fetchABTests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update test status');
    }
  };

  const handleViewResults = async (test: ABTestConfig) => {
    setSelectedTest(test);
    await fetchTestResults(test.id);
    setShowResultsDialog(true);
  };

  useEffect(() => {
    fetchABTests();
  }, [selectedLanguage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWinnerColor = (winner: string) => {
    switch (winner) {
      case 'A': return 'text-blue-600';
      case 'B': return 'text-green-600';
      case 'TIE': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">A/B Testing Dashboard</h1>
        <div className="flex gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create A/B Test
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* A/B Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>A/B Tests for {selectedLanguage}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Traffic Split</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Variant A</TableHead>
                  <TableHead>Variant B</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {abTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-gray-500">{test.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${100 - test.trafficSplit}%` }}
                          />
                        </div>
                        <span className="text-sm">{100 - test.trafficSplit}% / {test.trafficSplit}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(test.startDate).toLocaleDateString()}</div>
                        <div>to {new Date(test.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Threshold: {test.variantA.minAttendanceThreshold}</div>
                        <div>Rate: ${test.variantA.instructorHourlyRate}/hr</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Threshold: {test.variantB.minAttendanceThreshold}</div>
                        <div>Rate: ${test.variantB.instructorHourlyRate}/hr</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewResults(test)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {test.status === 'DRAFT' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTestStatus(test.id, 'ACTIVE')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {test.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTestStatus(test.id, 'PAUSED')}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {test.status === 'PAUSED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTestStatus(test.id, 'ACTIVE')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create A/B Test Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New A/B Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Test Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Spanish Threshold Optimization"
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose of this A/B test..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country (Optional)</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="e.g., United States"
                />
              </div>
              <div>
                <Label htmlFor="region">Region (Optional)</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g., California"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="trafficSplit">Traffic Split to Variant B (%)</Label>
              <Input
                id="trafficSplit"
                type="number"
                min="0"
                max="100"
                value={formData.trafficSplit}
                onChange={(e) => setFormData(prev => ({ ...prev, trafficSplit: parseInt(e.target.value) }))}
              />
            </div>

            {/* Variant A Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Variant A Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="variantA-threshold">Min Attendance Threshold</Label>
                    <Input
                      id="variantA-threshold"
                      type="number"
                      value={formData.variantA.minAttendanceThreshold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        variantA: { ...prev.variantA, minAttendanceThreshold: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variantA-rate">Instructor Hourly Rate ($)</Label>
                    <Input
                      id="variantA-rate"
                      type="number"
                      value={formData.variantA.instructorHourlyRate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        variantA: { ...prev.variantA, instructorHourlyRate: parseFloat(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variant B Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Variant B Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="variantB-threshold">Min Attendance Threshold</Label>
                    <Input
                      id="variantB-threshold"
                      type="number"
                      value={formData.variantB.minAttendanceThreshold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        variantB: { ...prev.variantB, minAttendanceThreshold: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variantB-rate">Instructor Hourly Rate ($)</Label>
                    <Input
                      id="variantB-rate"
                      type="number"
                      value={formData.variantB.instructorHourlyRate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        variantB: { ...prev.variantB, instructorHourlyRate: parseFloat(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createABTest}>
                Create A/B Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              A/B Test Results: {selectedTest?.name}
            </DialogTitle>
          </DialogHeader>
          {testResults && (
            <div className="space-y-6">
              {/* Winner and Confidence */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Winner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getWinnerColor(testResults.winner)}`}>
                      {testResults.winner === 'INSUFFICIENT_DATA' ? 'Insufficient Data' : `Variant ${testResults.winner}`}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Confidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testResults.confidence.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Language</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testResults.language}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Results Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Variant A</TableHead>
                        <TableHead>Variant B</TableHead>
                        <TableHead>Difference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Sessions</TableCell>
                        <TableCell>{testResults.variantAResults.totalSessions}</TableCell>
                        <TableCell>{testResults.variantBResults.totalSessions}</TableCell>
                        <TableCell>
                          {testResults.variantBResults.totalSessions - testResults.variantAResults.totalSessions}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Cancellation Rate</TableCell>
                        <TableCell>{testResults.variantAResults.cancellationRate.toFixed(1)}%</TableCell>
                        <TableCell>{testResults.variantBResults.cancellationRate.toFixed(1)}%</TableCell>
                        <TableCell className={testResults.improvement.cancellationRate > 0 ? 'text-green-600' : 'text-red-600'}>
                          {testResults.improvement.cancellationRate > 0 ? '+' : ''}{testResults.improvement.cancellationRate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Profit Margin</TableCell>
                        <TableCell>{testResults.variantAResults.profitMargin.toFixed(1)}%</TableCell>
                        <TableCell>{testResults.variantBResults.profitMargin.toFixed(1)}%</TableCell>
                        <TableCell className={testResults.improvement.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}>
                          {testResults.improvement.profitMargin > 0 ? '+' : ''}{testResults.improvement.profitMargin.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Average Revenue</TableCell>
                        <TableCell>${testResults.variantAResults.averageRevenue.toFixed(2)}</TableCell>
                        <TableCell>${testResults.variantBResults.averageRevenue.toFixed(2)}</TableCell>
                        <TableCell className={testResults.improvement.revenue > 0 ? 'text-green-600' : 'text-red-600'}>
                          {testResults.improvement.revenue > 0 ? '+' : ''}${testResults.improvement.revenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testResults.recommendations.map((recommendation, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{recommendation}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
