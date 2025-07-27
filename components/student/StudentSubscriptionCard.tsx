'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, CreditCardIcon, FileTextIcon, HistoryIcon, AlertTriangleIcon, CheckCircleIcon, StarIcon } from 'lucide-react';
import { toast } from 'sonner';

interface StudentSubscriptionStatus {
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

interface SubscriptionLogItem {
  id: string;
  action: string;
  oldPlan?: string;
  newPlan?: string;
  oldAmount?: number;
  newAmount?: number;
  oldBillingCycle?: string;
  newBillingCycle?: string;
  reason?: string;
  createdAt: Date;
}

const planFeatures = {
  BASIC: {
    name: 'Basic',
    price: '$12.99/month',
    annualPrice: '$124.99/year',
    features: [
      'Up to 5 courses',
      '10 practice tests',
      'Progress tracking',
      'Email support'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: '$24.99/month',
    annualPrice: '$239.99/year',
    features: [
      'Up to 20 courses',
      '50 practice tests',
      'Progress tracking',
      'Priority support',
      'Offline access',
      'Certificate download'
    ]
  },
  PRO: {
    name: 'Pro',
    price: '$49.99/month',
    annualPrice: '$479.99/year',
    features: [
      'Unlimited courses',
      'Unlimited practice tests',
      'Progress tracking',
      'Dedicated support',
      'Offline access',
      'Certificate download',
      'Personalized learning',
      'One-on-one tutoring'
    ]
  }
};

export default function StudentSubscriptionCard() {
  const [subscriptionData, setSubscriptionData] = useState<StudentSubscriptionStatus | null>(null);
  const [logs, setLogs] = useState<SubscriptionLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const [subscriptionRes, logsRes] = await Promise.all([
        fetch('/api/student/subscription'),
        fetch('/api/student/subscription/logs?limit=10')
      ]);

      if (subscriptionRes.ok) {
        const data = await subscriptionRes.json();
        setSubscriptionData(data.subscriptionStatus);
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionAction = async (action: string, planType?: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/student/subscription', {
        method: action === 'DELETE' ? 'DELETE' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'DELETE' ? undefined : JSON.stringify({
          action,
          planType,
          billingCycle,
          reason: reason || undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        
        // Close dialogs
        setUpgradeDialogOpen(false);
        setDowngradeDialogOpen(false);
        setCancelDialogOpen(false);
        setReactivateDialogOpen(false);
        
        // Reset form
        setSelectedPlan('');
        setBillingCycle('MONTHLY');
        setReason('');
        
        // Refresh data
        await fetchSubscriptionData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage your student subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              No subscription data available. Please contact support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                Manage your learning subscription plan and billing
              </CardDescription>
            </div>
            {getStatusBadge(subscriptionData.currentPlan)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptionData.hasActiveSubscription ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Current Plan</p>
                  <p className="text-lg font-semibold">
                    {planFeatures[subscriptionData.currentPlan as keyof typeof planFeatures]?.name || subscriptionData.currentPlan}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Features</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {subscriptionData.features.maxCourses === -1 ? 'Unlimited' : subscriptionData.features.maxCourses} courses
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Next Billing</p>
                  <p className="text-lg font-semibold">
                    {subscriptionData.nextBillingDate ? formatDate(subscriptionData.nextBillingDate) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {subscriptionData.canUpgrade && (
                  <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Upgrade Plan</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade Subscription</DialogTitle>
                        <DialogDescription>
                          Choose a higher tier plan to unlock more features and learning opportunities.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Select Plan</label>
                          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {subscriptionData.currentPlan !== 'PREMIUM' && (
                                <SelectItem value="PREMIUM">Premium</SelectItem>
                              )}
                              {subscriptionData.currentPlan !== 'PRO' && (
                                <SelectItem value="PRO">Pro</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Billing Cycle</label>
                          <Select value={billingCycle} onValueChange={(value: 'MONTHLY' | 'ANNUAL') => setBillingCycle(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                              <SelectItem value="ANNUAL">Annual (20% discount)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleSubscriptionAction('UPGRADE', selectedPlan)}
                          disabled={!selectedPlan || actionLoading}
                        >
                          {actionLoading ? 'Upgrading...' : 'Upgrade'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {subscriptionData.canDowngrade && (
                  <Dialog open={downgradeDialogOpen} onOpenChange={setDowngradeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Downgrade Plan</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Downgrade Subscription</DialogTitle>
                        <DialogDescription>
                          Choose a lower tier plan. Note that this will reduce your available features.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Select Plan</label>
                          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {subscriptionData.currentPlan !== 'BASIC' && (
                                <SelectItem value="BASIC">Basic</SelectItem>
                              )}
                              {subscriptionData.currentPlan !== 'PREMIUM' && (
                                <SelectItem value="PREMIUM">Premium</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Reason (Optional)</label>
                          <Textarea 
                            placeholder="Why are you downgrading?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDowngradeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleSubscriptionAction('DOWNGRADE', selectedPlan)}
                          disabled={!selectedPlan || actionLoading}
                          variant="destructive"
                        >
                          {actionLoading ? 'Downgrading...' : 'Downgrade'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {subscriptionData.canCancel && (
                  <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Cancel Subscription</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Subscription</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel your subscription? You'll lose access to premium features.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Reason (Optional)</label>
                          <Textarea 
                            placeholder="Why are you cancelling?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                          Keep Subscription
                        </Button>
                        <Button 
                          onClick={() => handleSubscriptionAction('DELETE')}
                          disabled={actionLoading}
                          variant="destructive"
                        >
                          {actionLoading ? 'Cancelling...' : 'Cancel Subscription'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <StarIcon className="h-12 w-12 text-yellow-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No Active Subscription</h3>
                <p className="text-gray-600">Upgrade to unlock premium learning features and unlimited access.</p>
              </div>
              <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Subscribe Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose a Subscription Plan</DialogTitle>
                    <DialogDescription>
                      Select a plan to unlock premium learning features and unlimited access.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Plan</label>
                      <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">Basic</SelectItem>
                          <SelectItem value="PREMIUM">Premium</SelectItem>
                          <SelectItem value="PRO">Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Billing Cycle</label>
                      <Select value={billingCycle} onValueChange={(value: 'MONTHLY' | 'ANNUAL') => setBillingCycle(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="ANNUAL">Annual (20% discount)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleSubscriptionAction('UPGRADE', selectedPlan)}
                      disabled={!selectedPlan || actionLoading}
                    >
                      {actionLoading ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History and Logs */}
      <Tabs defaultValue="billing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Billing History
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Recent billing transactions and payments</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptionData.billingHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionData.billingHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatDate(item.billingDate)}</TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'PAID' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.paymentMethod || 'N/A'}</TableCell>
                        <TableCell>{item.invoiceNumber || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No billing history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent subscription changes and actions</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {log.action === 'UPGRADE' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                        {log.action === 'DOWNGRADE' && <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />}
                        {log.action === 'CANCEL' && <AlertTriangleIcon className="h-5 w-5 text-red-500" />}
                        {log.action === 'REACTIVATE' && <CheckCircleIcon className="h-5 w-5 text-blue-500" />}
                        {log.action === 'CREATE' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {log.action.charAt(0) + log.action.slice(1).toLowerCase()}
                            {log.oldPlan && log.newPlan && (
                              <span className="text-gray-500">
                                : {log.oldPlan} → {log.newPlan}
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(log.createdAt)}</p>
                        </div>
                        {log.reason && (
                          <p className="text-sm text-gray-600 mt-1">{log.reason}</p>
                        )}
                        {(log.oldAmount || log.newAmount) && (
                          <p className="text-sm text-gray-600 mt-1">
                            {log.oldAmount && formatCurrency(log.oldAmount)}
                            {log.oldAmount && log.newAmount && ' → '}
                            {log.newAmount && formatCurrency(log.newAmount)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No activity logs available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 