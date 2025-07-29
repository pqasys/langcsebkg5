'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Zap, 
  Crown, 
  Languages, 
  BookOpen, 
  Award, 
  MessageCircle, 
  Globe, 
  Users, 
  Sparkles, 
  Headphones, 
  User, 
  Settings, 
  Video,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getAllStudentTiers, getStudentTier } from '@/lib/subscription-pricing';
import { FaSpinner } from 'react-icons/fa';

interface StudentSubscription {
  id: string;
  planType: 'BASIC' | 'PREMIUM' | 'PRO';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE';
  startDate: string;
  endDate: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amount: number;
  currency: string;
  features: Record<string, any>;
  autoRenew: boolean;
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

interface SubscriptionResponse {
  subscriptionStatus: {
    hasActiveSubscription: boolean;
    currentPlan?: string;
    features: Record<string, any>;
    subscriptionEndDate?: Date;
    canUpgrade: boolean;
    canDowngrade: boolean;
    canCancel: boolean;
    nextBillingDate?: Date;
    billingHistory: BillingHistoryItem[];
    isFallback: boolean;
  };
  logs: SubscriptionLogItem[];
}

interface PlanDetails {
  planType: 'BASIC' | 'PREMIUM' | 'PRO';
  name: string;
  icon: React.ReactNode;
  color: string;
  monthlyPrice: number;
  annualPrice: number;
  features: {
    name: string;
    included: boolean;
    icon: React.ReactNode;
    description: string;
  }[];
  popular?: boolean;
}

// Generate planDetails from single source of truth
const generatePlanDetails = () => {
  const studentTiers = getAllStudentTiers();
  const planDetails: Record<string, PlanDetails> = {};
  
  studentTiers.forEach(tier => {
    const icon = tier.planType === 'BASIC' ? <Star className="w-5 h-5" /> :
                 tier.planType === 'PREMIUM' ? <Zap className="w-5 h-5" /> :
                 <Crown className="w-5 h-5" />;
    
    const color = tier.planType === 'BASIC' ? 'text-blue-600' :
                  tier.planType === 'PREMIUM' ? 'text-purple-600' :
                  'text-yellow-600';
    
    // Convert features to the expected format
    const features = tier.features.map(feature => ({
      name: feature,
      included: true,
      icon: <CheckCircle className="w-4 h-4" />,
      description: feature
    }));
    
    planDetails[tier.planType] = {
      planType: tier.planType,
      name: tier.name.replace(' Plan', ''),
      icon,
      color,
      monthlyPrice: tier.price,
      annualPrice: tier.annualPrice,
      popular: tier.popular || false,
      features
    };
  });
  
  return planDetails;
};

const planDetails = generatePlanDetails();

export function StudentSubscriptionCard() {
  const { data: session } = useSession();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [downgrading, setDowngrading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PREMIUM' | 'PRO' | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      } else {
        // toast.error('Failed to fetch subscription data');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      // toast.error('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlan: 'BASIC' | 'PREMIUM' | 'PRO') => {
    try {
      setUpgrading(true);
      const response = await fetch('/api/student/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'UPGRADE',
          planType: newPlan,
          billingCycle: 'MONTHLY'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to upgrade subscription`);
      }

      await fetchSubscriptionData();
      setShowUpgradeDialog(false);
      setSelectedPlan(null);
      // toast.success(`Successfully upgraded to ${planDetails[newPlan].name} plan`);
    } catch (error) {
      console.error('Error occurred:', error);
      // toast.error('Failed to upgrade subscription');
    } finally {
      setUpgrading(false);
    }
  };

  const handleDowngrade = async (newPlan: 'BASIC' | 'PREMIUM') => {
    try {
      setDowngrading(true);
      const response = await fetch('/api/student/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'DOWNGRADE',
          planType: newPlan,
          billingCycle: 'MONTHLY'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to downgrade subscription`);
      }

      await fetchSubscriptionData();
      setShowDowngradeDialog(false);
      setSelectedPlan(null);
      // toast.success(`Successfully downgraded to ${planDetails[newPlan].name} plan`);
    } catch (error) {
      console.error('Error occurred:', error);
      // toast.error('Failed to downgrade subscription');
    } finally {
      setDowngrading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const response = await fetch('/api/student/subscription?reason=Subscription cancelled by user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription`);
      }

      await fetchSubscriptionData();
      setShowCancelDialog(false);
      // toast.success('Subscription cancelled successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      // toast.error('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      case 'PAST_DUE':
        return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPlanIcon = (planType: string) => {
    return planDetails[planType]?.icon || <User className="w-5 h-5" />;
  };

  const getPlanColor = (planType: string) => {
    return planDetails[planType]?.color || 'text-gray-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          {/* <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" /> */}
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionData?.subscriptionStatus?.hasActiveSubscription) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Choose Your Learning Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Select a plan that fits your learning goals and budget. All plans include a 7-day free trial.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(planDetails).map((plan) => (
                <Card key={plan.planType} className={`relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <span className={`${getPlanColor(plan.planType)}`}>
                        {getPlanIcon(plan.planType)}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">${plan.monthlyPrice}</div>
                      <div className="text-sm text-gray-500">per month</div>
                      <div className="text-sm text-green-600">${plan.annualPrice}/year (save 20%)</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full mt-0.5" />
                          )}
                          <div>
                            <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                              {feature.name}
                            </span>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Dialog open={showUpgradeDialog && selectedPlan === plan.planType} onOpenChange={(open) => {
                      setShowUpgradeDialog(open);
                      if (!open) setSelectedPlan(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                          onClick={() => setSelectedPlan(plan.planType)}
                        >
                          Start Free Trial
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Start {plan.name} Plan Trial</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Start your 7-day free trial of the {plan.name} plan. Cancel anytime during the trial period.</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Plan:</span>
                              <span className="font-semibold">{plan.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly Price:</span>
                              <span className="font-semibold">${plan.monthlyPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annual Price:</span>
                              <span className="font-semibold">${plan.annualPrice} (save 20%)</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleUpgrade(plan.planType)}
                              disabled={upgrading}
                              className="flex-1"
                            >
                              {upgrading ? <FaSpinner className="animate-spin mr-2" /> : null}
                              Start Trial
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setShowUpgradeDialog(false);
                                setSelectedPlan(null);
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlan = planDetails[subscriptionData.subscriptionStatus.currentPlan as keyof typeof planDetails];
  const canUpgrade = subscriptionData.subscriptionStatus.canUpgrade;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`${getPlanColor(subscriptionData.subscriptionStatus.currentPlan || 'BASIC')}`}>
                  {getPlanIcon(subscriptionData.subscriptionStatus.currentPlan || 'BASIC')}
                </span>
                <span className="font-semibold">{currentPlan?.name || 'Basic'} Plan</span>
              </div>
              {getStatusBadge('ACTIVE')}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">
                  ${currentPlan?.monthlyPrice || 12.99}/month
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Monthly billing
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">
                  Auto-renewal
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Will renew automatically
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">
                  {subscriptionData.subscriptionStatus.subscriptionEndDate ? 
                    new Date(subscriptionData.subscriptionStatus.subscriptionEndDate).toLocaleDateString() : 
                    'N/A'
                  }
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Renews on
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {subscriptionData.subscriptionStatus.canUpgrade && (
              <Button 
                onClick={() => setShowUpgradeDialog(true)}
                disabled={upgrading}
                className="bg-green-600 hover:bg-green-700"
              >
                {upgrading ? 'Upgrading...' : 'Upgrade Plan'}
              </Button>
            )}
            
            {subscriptionData.subscriptionStatus.canDowngrade && (
              <Button 
                variant="outline"
                onClick={() => setShowDowngradeDialog(true)}
                disabled={downgrading}
              >
                {downgrading ? 'Downgrading...' : 'Downgrade Plan'}
              </Button>
            )}
            
            {subscriptionData.subscriptionStatus.canCancel && (
              <Button 
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Headphones className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Have questions about your subscription or need to make changes? Our support team is here to help.
            </p>
            <Button>
              <ArrowRight className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Choose a plan to upgrade to. Your changes will take effect immediately.
            </p>
            
            <div className="space-y-3">
              {Object.values(planDetails)
                .filter(plan => plan.planType !== subscriptionData.subscriptionStatus.currentPlan && ['PREMIUM', 'PRO'].includes(plan.planType))
                .map((plan) => (
                  <div key={plan.planType} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPlan(plan.planType)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`${getPlanColor(plan.planType)}`}>
                          {getPlanIcon(plan.planType)}
                        </span>
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-sm text-gray-500">${plan.monthlyPrice}/month</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (plan.planType === 'PREMIUM' || plan.planType === 'PRO') {
                            handleUpgrade(plan.planType);
                          }
                        }}
                        disabled={upgrading}
                      >
                        {upgrading ? 'Upgrading...' : 'Select'}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Downgrade Dialog */}
      <Dialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Downgrade Your Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Choose a plan to downgrade to. Your changes will take effect at the end of your current billing cycle.
            </p>
            
            <div className="space-y-3">
              {Object.values(planDetails)
                .filter(plan => plan.planType !== subscriptionData.subscriptionStatus.currentPlan && ['BASIC', 'PREMIUM'].includes(plan.planType))
                .map((plan) => (
                  <div key={plan.planType} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPlan(plan.planType)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`${getPlanColor(plan.planType)}`}>
                          {getPlanIcon(plan.planType)}
                        </span>
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-sm text-gray-500">${plan.monthlyPrice}/month</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (plan.planType === 'BASIC' || plan.planType === 'PREMIUM') {
                            handleDowngrade(plan.planType as 'BASIC' | 'PREMIUM');
                          }
                        }}
                        disabled={downgrading}
                      >
                        {downgrading ? 'Downgrading...' : 'Select'}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDowngradeDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">Are you sure?</h4>
                <p className="text-sm text-red-700">
                  This action cannot be undone. Your subscription will be cancelled immediately.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">What happens when you cancel:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your subscription will end immediately</li>
                  <li>• You'll lose access to premium features</li>
                  <li>• No further charges will be made</li>
                  <li>• You can reactivate anytime from your settings</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Subscription'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
                className="flex-1"
              >
                Keep Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 