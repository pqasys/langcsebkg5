'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { toast } from 'sonner';
import { 
  Building2, 
  Crown, 
  Zap, 
  Star, 
  Percent,
  ArrowRight
} from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

interface SubscriptionOverview {
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | null;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE' | null;
  effectiveCommissionRate: number;
  institutionDefaultRate: number;
  endDate: string | null;
}

export function SubscriptionOverviewCard() {
  const [subscription, setSubscription] = useState<SubscriptionOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscriptionStatus);
      } else {
        // toast.error('Failed to fetch subscription data');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      // toast.error(`Failed to load subscription data. Please try again or contact support if the problem persists.`));
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planType: string | null) => {
    switch (planType) {
      case 'STARTER':
        return <Star className="w-4 h-4" />;
      case 'PROFESSIONAL':
        return <Zap className="w-4 h-4" />;
      case 'ENTERPRISE':
        return <Crown className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getPlanColor = (planType: string | null) => {
    switch (planType) {
      case 'STARTER':
        return 'text-blue-600';
      case 'PROFESSIONAL':
        return 'text-purple-600';
      case 'ENTERPRISE':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800 text-xs">Cancelled</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Expired</Badge>;
      case 'PAST_DUE':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Past Due</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="flex items-center justify-center p-4">
          {/* <FaSpinner className="animate-spin h-4 w-4 text-indigo-600" /> */}
        </CardContent>
      </Card>
    );
  }

  if (!subscription || !subscription.planType) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">No active subscription</p>
              <p className="text-xs text-gray-500">Contact support to set up your plan</p>
            </div>
            <Link href="/institution/settings?tab=subscription">
              <Button size="sm" variant="outline">
                <ArrowRight className="w-3 h-3 mr-1" />
                Setup
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-indigo-600" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Plan Info */}
            <div className="flex items-center gap-2">
              <span className={`${getPlanColor(subscription.planType)}`}>
                {getPlanIcon(subscription.planType)}
              </span>
              <div>
                <p className="text-sm font-medium">{subscription.planType} Plan</p>
                {getStatusBadge(subscription.status)}
              </div>
            </div>

            {/* Commission Rate */}
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{subscription.effectiveCommissionRate}%</p>
                <p className="text-xs text-gray-500">Commission rate</p>
              </div>
            </div>

            {/* Expiry Date */}
            {subscription.endDate && (
              <div>
                <p className="text-sm font-medium">
                  {new Date(subscription.endDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">Expires</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link href="/institution/settings?tab=subscription">
            <Button size="sm" variant="outline">
              <ArrowRight className="w-3 h-3 mr-1" />
              Manage
            </Button>
          </Link>
        </div>

        {/* Commission Rate Note */}
        {subscription.effectiveCommissionRate !== subscription.institutionDefaultRate && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <p>
              Your effective commission rate ({subscription.effectiveCommissionRate}%) is set by your subscription plan 
              and overrides your default rate ({subscription.institutionDefaultRate}%).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 