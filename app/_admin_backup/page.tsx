'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  DollarSign, 
  Star, 
  Crown, 
  Target, 
  BarChart3,
  Users,
  Zap,
  Settings
} from 'lucide-react';

interface AdvertisingData {
  revenue: {
    total: number;
    commission: number;
    commissionPercentage: number;
  };
  institutions: {
    featured: number;
    premium: number;
    highCommission: number;
    total: number;
  };
  courses: {
    total: number;
    byStatus: unknown[];
    topPerforming: unknown[];
  };
  campaigns: unknown[];
  recommendations: unknown[];
}

export default function AdminAdvertisingPage() {
  const [data, setData] = useState<AdvertisingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    isFeatured: false,
    commissionRate: 0,
    subscriptionPlan: 'BASIC'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/advertising');
      if (!response.ok) throw new Error(`Failed to fetch data - Context: if (!response.ok) throw new Error('Failed to fetch...);
      const advertisingData = await response.json();
      setData(advertisingData);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(Failed to load advertising data. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load advertising data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateInstitution = async () => {
    try {
      const response = await fetch('/api/admin/advertising', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-featured-status',
          data: {
            institutionId: selectedInstitution.id,
            isFeatured: editForm.isFeatured
          }
        })
      });

      if (!response.ok) throw new Error(`Failed to update institution - Context: isFeatured: editForm.isFeatured...);

      toast.success('Institution updated successfully');
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(Failed to updating institution. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update institution');
    }
  };

  const handleCommissionUpdate = async () => {
    try {
      const response = await fetch('/api/admin/advertising', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-commission-rate',
          data: {
            institutionId: selectedInstitution.id,
            commissionRate: editForm.commissionRate
          }
        })
      });

      if (!response.ok) throw new Error(`Failed to update commission rate - Context: commissionRate: editForm.commissionRate...);

      toast.success('Commission rate updated successfully');
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(Failed to updating commission rate. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update commission rate');
    }
  };

  const handlePlanUpdate = async () => {
    try {
      const response = await fetch('/api/admin/advertising', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-subscription-plan',
          data: {
            institutionId: selectedInstitution.id,
            subscriptionPlan: editForm.subscriptionPlan
          }
        })
      });

      if (!response.ok) throw new Error(`Failed to update subscription plan - Context: institutionId: selectedInstitution.id,...);

      toast.success('Subscription plan updated successfully');
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(Failed to updating subscription plan. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update subscription plan');
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load advertising data</p>
        <Button onClick={fetchData} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advertising & Revenue Management</h1>
          <p className="text-gray-600 mt-2">
            Optimize course visibility and maximize revenue through strategic placement
          </p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.revenue.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time course enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.revenue.commission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.revenue.commissionPercentage.toFixed(1)}% of total revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Institutions</CardTitle>
            <Star className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.institutions.featured}</div>
            <p className="text-xs text-muted-foreground">
              of {data.institutions.total} total institutions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Institution Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Institution Prioritization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{data.institutions.featured}</div>
              <div className="text-sm text-orange-700">Featured</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{data.institutions.premium}</div>
              <div className="text-sm text-purple-700">Premium</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{data.institutions.highCommission}</div>
              <div className="text-sm text-green-700">High Commission</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{data.courses.total}</div>
              <div className="text-sm text-blue-700">Total Courses</div>
            </div>
          </div>

          {/* Top Performing Courses */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Performing Courses</h3>
            <div className="grid gap-4">
              {data.courses.topPerforming.slice(0, 5).map((course: unknown) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{course.title}</h4>
                      {course.institution.isFeatured && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {course.institution.subscriptionPlan === 'ENTERPRISE' && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{course.institution.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Priority Score: {course.priorityScore}</span>
                      <span>Commission: {course.institution.commissionRate}%</span>
                      <span>Enrollments: {course._count.bookings}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${course.estimatedRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Est. Revenue
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => {
                        setSelectedInstitution(course.institution);
                        setEditForm({
                          isFeatured: course.institution.isFeatured || false,
                          commissionRate: course.institution.commissionRate || 0,
                          subscriptionPlan: course.institution.subscriptionPlan || 'BASIC'
                        });
                        setEditDialogOpen(true);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Revenue Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {data.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center gap-4">
                    <Badge className={`${
                      rec.impact === 'High' ? 'bg-green-100 text-green-800' :
                      rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Impact: {rec.impact}
                    </Badge>
                    <Badge className={`${
                      rec.effort === 'Low' ? 'bg-green-100 text-green-800' :
                      rec.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Effort: {rec.effort}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Implement
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Institution Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Institution Settings</DialogTitle>
          </DialogHeader>
          {selectedInstitution && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Institution</Label>
                <p className="text-sm text-gray-600">{selectedInstitution.name}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={editForm.isFeatured}
                  onChange={(e) => setEditForm({...editForm, isFeatured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isFeatured">Featured Institution</Label>
              </div>

              <div>
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="50"
                  value={editForm.commissionRate}
                  onChange={(e) => setEditForm({...editForm, commissionRate: Number(e.target.value)})}
                />
              </div>

              <div>
                <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
                <Select
                  value={editForm.subscriptionPlan}
                  onValueChange={(value) => setEditForm({...editForm, subscriptionPlan: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateInstitution} className="flex-1">
                  Update Featured Status
                </Button>
                <Button onClick={handleCommissionUpdate} className="flex-1">
                  Update Commission
                </Button>
                <Button onClick={handlePlanUpdate} className="flex-1">
                  Update Plan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 