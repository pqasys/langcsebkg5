'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FaSpinner, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
// import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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

export default function EditSubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const subscriptionId = params.id as string;
  
  const [subscription, setSubscription] = useState<InstitutionSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    planType: '',
    status: '',
    billingCycle: '',
    amount: 0,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchSubscription();
  }, [session, status, subscriptionId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      const data = await response.json();
      setSubscription(data);
      setFormData({
        planType: data.planType,
        status: data.status,
        billingCycle: data.billingCycle,
        amount: data.amount,
        startDate: data.startDate.split('T')[0],
        endDate: data.endDate.split('T')[0]
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      console.error('Failed to load subscription details');
      router.push('/admin/subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // // // // // // console.log('Submitting formData:', formData);
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      console.log('Subscription updated successfully');
      router.push('/admin/subscriptions');
    } catch (error) {
      console.error('Error updating subscription:', error);
      console.error('Failed to update subscription');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (field === 'amount')
        ? value === '' ? 0 : Number(value)
        : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 font-medium">Subscription not found</p>
          <Button
            onClick={() => router.push('/admin/subscriptions')}
            className="mt-2"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subscriptions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            onClick={() => router.push('/admin/subscriptions')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subscriptions
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Subscription</h1>
              <p className="text-gray-600 mt-2">
                {subscription.institution.name} - {subscription.planType} Plan
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="planType">Plan Type</Label>
                  <Select
                    value={formData.planType}
                    onValueChange={(value) => handleInputChange('planType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STARTER">Starter</SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                      <SelectItem value="PAST_DUE">Past Due</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select
                    value={formData.billingCycle}
                    onValueChange={(value) => handleInputChange('billingCycle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="ANNUAL">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Effective Commission Rate</Label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md border">
                    <span className="text-lg font-semibold text-gray-700">
                      {formData.planType === 'STARTER' ? '25' : 
                       formData.planType === 'PROFESSIONAL' ? '15' : 
                       formData.planType === 'ENTERPRISE' ? '10' : '0'}%
                    </span>
                    <span className="text-sm text-gray-500">
                      ({formData.planType || 'No plan'} plan)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Commission rate is automatically set based on subscription plan and overrides institution's default rate
                  </p>
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/subscriptions')}
                  disabled={saving}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <FaSave className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 