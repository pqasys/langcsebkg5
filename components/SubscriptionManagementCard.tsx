'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Percent,
  Calendar,
  Settings,
  TrendingUp,
  Zap,
  Crown,
  Headphones,
  Users,
  BookOpen,
  BarChart3,
  Headphones as HeadphonesIcon,
  Palette,
  Shield,
  Code,
  Globe,
  CheckCircle as CheckCircleIcon,
  X,
  Info
} from 'lucide-react';

interface SubscriptionData {
  id: string | null;
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | null;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE' | null;
  startDate: string | null;
  endDate: string | null;
  billingCycle: 'MONTHLY' | 'ANNUAL' | null;
  amount: number;
  currency: string;
  features: Record<string, any>;
  effectiveCommissionRate: number;
  institutionDefaultRate: number;
  hasActiveSubscription: boolean;
  isFallback: boolean;
}

interface PlanDetails {
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  name: string;
  icon: React.ReactNode;
  color: string;
  monthlyPrice: number;
  annualPrice: number;
  commissionRate: number;
  features: {
    name: string;
    included: boolean;
    icon: React.ReactNode;
  }[];
}

const planDetails: Record<string, PlanDetails> = {
  STARTER: {
    planType: 'STARTER',
    name: 'Starter',
    icon: <Building2 className="w-5 h-5" />,
    color: 'text-blue-600',
    monthlyPrice: 99,
    annualPrice: 990,
    commissionRate: 25,
    features: [
      { name: 'Up to 100 students', included: true, icon: <Users className="w-4 h-4" /> },
      { name: 'Up to 10 courses', included: true, icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Basic analytics', included: true, icon: <BarChart3 className="w-4 h-4" /> },
      { name: 'Email support', included: true, icon: <HeadphonesIcon className="w-4 h-4" /> },
      { name: 'Custom branding', included: false, icon: <Palette className="w-4 h-4" /> },
      { name: 'White label', included: false, icon: <Globe className="w-4 h-4" /> },
      { name: 'Priority support', included: false, icon: <Shield className="w-4 h-4" /> },
    ]
  },
  PROFESSIONAL: {
    planType: 'PROFESSIONAL',
    name: 'Professional',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-purple-600',
    monthlyPrice: 299,
    annualPrice: 2990,
    commissionRate: 15,
    features: [
      { name: 'Up to 500 students', included: true, icon: <Users className="w-4 h-4" /> },
      { name: 'Up to 50 courses', included: true, icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Basic analytics', included: true, icon: <BarChart3 className="w-4 h-4" /> },
      { name: 'Email support', included: true, icon: <HeadphonesIcon className="w-4 h-4" /> },
      { name: 'Custom branding', included: true, icon: <Palette className="w-4 h-4" /> },
      { name: 'Priority support', included: true, icon: <Shield className="w-4 h-4" /> },
      { name: 'Advanced analytics', included: true, icon: <TrendingUp className="w-4 h-4" /> },
      { name: 'Marketing tools', included: true, icon: <Settings className="w-4 h-4" /> },
      { name: 'API access', included: false, icon: <Code className="w-4 h-4" /> },
      { name: 'White label', included: false, icon: <Globe className="w-4 h-4" /> },
    ]
  },
  ENTERPRISE: {
    planType: 'ENTERPRISE',
    name: 'Enterprise',
    icon: <Crown className="w-5 h-5" />,
    color: 'text-yellow-600',
    monthlyPrice: 999,
    annualPrice: 9990,
    commissionRate: 10,
    features: [
      { name: 'Unlimited students', included: true, icon: <Users className="w-4 h-4" /> },
      { name: 'Unlimited courses', included: true, icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Basic analytics', included: true, icon: <BarChart3 className="w-4 h-4" /> },
      { name: 'Email support', included: true, icon: <HeadphonesIcon className="w-4 h-4" /> },
      { name: 'Custom branding', included: true, icon: <Palette className="w-4 h-4" /> },
      { name: 'API access', included: true, icon: <Code className="w-4 h-4" /> },
      { name: 'White label', included: true, icon: <Globe className="w-4 h-4" /> },
      { name: 'Priority support', included: true, icon: <Shield className="w-4 h-4" /> },
      { name: 'Advanced analytics', included: true, icon: <TrendingUp className="w-4 h-4" /> },
      { name: 'Marketing tools', included: true, icon: <Settings className="w-4 h-4" /> },
      { name: 'Dedicated account manager', included: true, icon: <Users className="w-4 h-4" /> },
      { name: 'Custom integrations', included: true, icon: <Code className="w-4 h-4" /> },
      { name: 'Advanced security', included: true, icon: <Shield className="w-4 h-4" /> },
      { name: 'Multi-location support', included: true, icon: <Globe className="w-4 h-4" /> },
      { name: 'Custom reporting', included: true, icon: <BarChart3 className="w-4 h-4" /> },
    ]
  }
};

export function SubscriptionManagementCard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [cancelling, setCancelling] = useState(false);


  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscriptionStatus ?? null);
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

  const handleUpgrade = async (newPlan: 'PROFESSIONAL' | 'ENTERPRISE') => {
    try {
      setUpgrading(true);
      const response = await fetch('/api/institution/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: newPlan })
      });

      if (!response.ok) {
        throw new Error(`Failed to upgrade subscription - Context: throw new Error('Failed to upgrade subscription');...`);
      }

      await fetchSubscriptionData();
      setShowUpgradeDialog(false);
      // toast.success(`Successfully upgraded to ${planDetails[newPlan].name} plan`);
    } catch (error) {
    console.error('Error occurred:', error);
      // toast.error('Failed to upgrade subscription');
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const response = await fetch('/api/institution/subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription - Context: headers: { 'Content-Type': 'application/json' }...`);
      }

      await fetchSubscriptionData();
      setShowCancelDialog(false);
      // toast.success('Subscription cancelled successfully. You will now use your institution\'s default commission rate.');
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
      case 'TRIAL':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
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
    return planDetails[planType]?.icon || <Building2 className="w-5 h-5" />;
  };

  const getPlanColor = (planType: string) => {
    return planDetails[planType]?.color || 'text-gray-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
        </CardContent>
      </Card>
    );
  }

  const hasActiveSubscription = subscription.hasActiveSubscription ?? false;
  const planType = subscription.planType ?? 'STARTER';
  const amount = subscription.amount ?? 0;
  const billingCycle = subscription.billingCycle ?? 'MONTHLY';
  const status = subscription.status ?? 'ACTIVE';
  const endDate = subscription.endDate ?? new Date().toISOString();
  const institutionDefaultRate = subscription.institutionDefaultRate ?? 0;
  const effectiveCommissionRate = subscription.effectiveCommissionRate ?? 0;

  const currentPlan = hasActiveSubscription ? planDetails[planType] : null;
  const canUpgrade = subscription.canUpgrade ?? false;
  const canDowngrade = subscription.canDowngrade ?? false;

  return (
    <div className="space-y-6">
      {/* Current Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            {hasActiveSubscription ? 'Current Subscription' : 'Subscription Management'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasActiveSubscription ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Plan Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`${getPlanColor(planType)}`}>
                      {getPlanIcon(planType)}
                    </span>
                    <span className="font-semibold">{currentPlan?.name} Plan</span>
                  </div>
                  {getStatusBadge(status)}
                </div>

                {/* Billing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">
                      ${amount}/{billingCycle.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {billingCycle === 'ANNUAL' ? 'Annual billing' : 'Monthly billing'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {billingCycle === 'ANNUAL' ? `$${(amount / 12).toFixed(0)}/month equivalent` : `$${amount}/month`}
                  </p>
                </div>

                {/* Commission Rate */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{effectiveCommissionRate}%</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Effective commission rate
                  </p>
                </div>

                {/* Expiry */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">
                      {new Date(endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Expires on
                  </p>
                </div>
              </div>

              {/* Trial Information */}
              {status === 'TRIAL' && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Trial Period Active</h4>
                      <p className="text-sm text-yellow-700">
                        You're currently in a <strong>14-day free trial</strong> period. Your subscription will automatically activate on{' '}
                        <strong>{new Date(endDate).toLocaleDateString()}</strong>. You can cancel anytime before the trial ends.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback Plan Information */}
              {subscription.isFallback && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Fallback Plan Active</h4>
                      <p className="text-sm text-blue-700">
                        You're currently on a <strong>free fallback plan</strong> with default commission rate ({effectiveCommissionRate}%). 
                        This plan was automatically created when your trial expired. You can upgrade to a paid plan anytime to access more features.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Commission Rate Explanation */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Commission Rate Information</h4>
                    <p className="text-sm text-blue-700">
                      Your effective commission rate of <strong>{effectiveCommissionRate}%</strong> is determined by your subscription plan. 
                      This rate overrides your institution's default rate of <strong>{institutionDefaultRate}%</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancel Subscription Button */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-1">Cancel Subscription</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Cancelling your subscription will revert to your institution's default commission rate of <strong>{institutionDefaultRate}%</strong>. 
                      You'll lose access to subscription features but can resubscribe anytime.
                    </p>
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Subscription</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel your subscription? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-50 rounded-lg">
                            <h4 className="font-semibold text-red-900 mb-2">What happens when you cancel:</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              <li>• Your subscription will be cancelled immediately</li>
                              <li>• You'll revert to your institution's default commission rate ({institutionDefaultRate}%)</li>
                              <li>• You'll lose access to subscription-specific features</li>
                              <li>• You can resubscribe anytime from the subscription page</li>
                            </ul>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="destructive" 
                              onClick={handleCancel}
                              disabled={cancelling}
                              className="flex-1"
                            >
                              {cancelling ? <FaSpinner className="animate-spin mr-2" /> : null}
                              Yes, Cancel Subscription
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
                </div>
              </div>
            </>
          ) : (
            // No Active Subscription State
            <div className="text-center py-8">
              <div className="mb-4">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-600 mb-6">
                You're currently using your institution's default commission rate of <strong>{effectiveCommissionRate}%</strong>.
                Subscribe to a plan to get better rates and additional features.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/subscription-signup?type=institution')}
                  className="w-full"
                >
                  View Available Plans
                </Button>
                <p className="text-sm text-gray-500">
                  All plans include a 14-day free trial
                </p>
              </div>

              {/* Commission Rate Explanation for No Subscription */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Commission Rate Information</h4>
                    <p className="text-sm text-blue-700">
                      Your commission rate of <strong>{effectiveCommissionRate}%</strong> is your institution's default rate. 
                      Subscribe to a plan to get better commission rates and additional features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Features - Only show if has active subscription */}
      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              Plan Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPlan?.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  {feature.included ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Options - Only show if has active subscription */}
      {hasActiveSubscription && canUpgrade && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Upgrade Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planType === 'STARTER' && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold">Professional Plan</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upgrade to get more features and lower commission rates
                  </p>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Commission Rate:</span>
                      <span className="font-semibold">15% (vs current 25%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Price:</span>
                      <span className="font-semibold">$299</span>
                    </div>
                  </div>
                  <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        Upgrade to Professional
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade to Professional Plan</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Are you sure you want to upgrade to the Professional plan?</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>New Commission Rate:</span>
                            <span className="font-semibold">15%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Price:</span>
                            <span className="font-semibold">$299</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleUpgrade('PROFESSIONAL')}
                            disabled={upgrading}
                            className="flex-1"
                          >
                            {upgrading ? <FaSpinner className="animate-spin mr-2" /> : null}
                            Confirm Upgrade
                          </Button>
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
                </div>
              )}

              {planType === 'PROFESSIONAL' && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold">Enterprise Plan</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upgrade to the highest tier with unlimited features
                  </p>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Commission Rate:</span>
                      <span className="font-semibold">10% (vs current 15%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Price:</span>
                      <span className="font-semibold">$999</span>
                    </div>
                  </div>
                  <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        Upgrade to Enterprise
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade to Enterprise Plan</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Are you sure you want to upgrade to the Enterprise plan?</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>New Commission Rate:</span>
                            <span className="font-semibold">10%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Price:</span>
                            <span className="font-semibold">$999</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleUpgrade('ENTERPRISE')}
                            disabled={upgrading}
                            className="flex-1"
                          >
                            {upgrading ? <FaSpinner className="animate-spin mr-2" /> : null}
                            Confirm Upgrade
                          </Button>
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
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
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
    </div>
  );
} 