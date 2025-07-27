'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaPlus, FaEye, FaEdit, FaHistory } from 'react-icons/fa';
// import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Zap,
  Crown,
  Star,
  Plus
} from 'lucide-react';

interface InstitutionSubscription {
  id: string;
  institutionId: string;
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE';
  startDate: string;
  endDate: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amount: number;
  currency: string;
  features: unknown;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
  institution: {
    id: string;
    name: string;
    email: string;
    logoUrl: string | null;
  };
  commissionRate: number;
  revenueGenerated: number;
  activeStudents: number;
  totalCourses: number;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  annualRevenue: number;
  averageCommissionRate: number;
  topPerformingInstitutions: Array<{
    name: string;
    revenue: number;
    commissionRate: number;
  }>;
}

export default function AdminSubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<InstitutionSubscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<InstitutionSubscription | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchSubscriptions();
    fetchStats();
  }, [session, status]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/subscriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscriptions');
      console.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/subscriptions/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchSubscriptions();
      // // // // // // console.log('Subscription status updated successfully');
    } catch (error) {
      console.error('Error updating subscription status:', error);
      console.error('Failed to update subscription status');
    }
  };

  const handlePlanChange = async (subscriptionId: string, newPlan: string, billingCycle: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: newPlan, billingCycle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      await fetchSubscriptions();
      console.log('Subscription plan updated successfully');
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      console.error('Failed to update subscription plan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      case 'PAST_DUE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'STARTER': return <Star className="w-4 h-4" />;
      case 'PROFESSIONAL': return <Zap className="w-4 h-4" />;
      case 'ENTERPRISE': return <Crown className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (selectedStatus !== 'all' && sub.status !== selectedStatus) return false;
    if (selectedPlan !== 'all' && sub.planType !== selectedPlan) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
            <Button
              onClick={() => router.push('/admin/subscriptions/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="mr-2" />
              Create Subscription
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalSubscriptions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Commission Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.averageCommissionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                      <SelectItem value="PAST_DUE">Past Due</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="STARTER">Starter</SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Institution Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Revenue Generated</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {subscription.institution.logoUrl ? (
                            <img
                              src={subscription.institution.logoUrl}
                              alt={subscription.institution.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{subscription.institution.name}</p>
                            <p className="text-sm text-gray-500">{subscription.institution.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPlanIcon(subscription.planType)}
                          <span className="font-medium">{subscription.planType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${subscription.amount}</p>
                          <p className="text-sm text-gray-500">{subscription.billingCycle}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{subscription.commissionRate}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${subscription.revenueGenerated.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{subscription.activeStudents}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <FaEye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/subscriptions/${subscription.id}/edit`)}
                          >
                            <FaEdit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subscription Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>
          {selectedSubscription && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Institution</h4>
                    <p className="text-sm text-gray-600">{selectedSubscription.institution.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Plan Type</h4>
                    <p className="text-sm text-gray-600">{selectedSubscription.planType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    <Badge className={getStatusColor(selectedSubscription.status)}>
                      {selectedSubscription.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Commission Rate</h4>
                    <p className="text-sm text-gray-600">{selectedSubscription.commissionRate}%</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Amount</h4>
                    <p className="text-sm text-gray-600">${selectedSubscription.amount}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Billing Cycle</h4>
                    <p className="text-sm text-gray-600">{selectedSubscription.billingCycle}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Start Date</h4>
                    <p className="text-sm text-gray-600">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">End Date</h4>
                    <p className="text-sm text-gray-600">{new Date(selectedSubscription.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Revenue Generated</h4>
                    <p className="text-sm text-gray-600">${selectedSubscription.revenueGenerated.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Active Students</h4>
                    <p className="text-sm text-gray-600">{selectedSubscription.activeStudents}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Total Courses</h4>
                    <p className="text-sm text-gray-600">{selectedSubscription.totalCourses}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Commission Earned</h4>
                    <p className="text-sm text-gray-600">${(selectedSubscription.revenueGenerated * selectedSubscription.commissionRate / 100).toLocaleString()}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 