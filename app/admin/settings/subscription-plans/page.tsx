'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Save, X, Check, AlertCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxStudents: number;
  maxCourses: number;
  maxTeachers: number;
  maxLiveClasses?: number;
  attendanceQuota?: number;
  enrollmentQuota?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CommissionTier {
  id: string;
  planType: string;
  commissionRate: number;
  features: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePlanData {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxStudents: number;
  maxCourses: number;
  maxTeachers: number;
  maxLiveClasses: number;
  attendanceQuota: number;
  enrollmentQuota: number;
}

// Available features that can be selected
const availableFeatures = [
  { key: 'maxStudents', name: 'Max Students', description: 'Maximum number of students allowed' },
  { key: 'maxCourses', name: 'Max Courses', description: 'Maximum number of courses allowed' },
  { key: 'maxTeachers', name: 'Max Teachers', description: 'Maximum number of teachers allowed' },
  { key: 'maxLiveClasses', name: 'Max Live Classes', description: 'Maximum number of live classes per month' },
  { key: 'attendanceQuota', name: 'Attendance Quota', description: 'Maximum attendance quota per month' },
  { key: 'enrollmentQuota', name: 'Enrollment Quota', description: 'Maximum enrollment quota per month' },
  { key: 'basicAnalytics', name: 'Basic Analytics', description: 'Basic reporting and analytics' },
  { key: 'advancedAnalytics', name: 'Advanced Analytics', description: 'Advanced reporting and insights' },
  { key: 'emailSupport', name: 'Email Support', description: 'Email-based customer support' },
  { key: 'prioritySupport', name: 'Priority Support', description: 'Priority customer support' },
  { key: 'customBranding', name: 'Custom Branding', description: 'Custom branding options' },
  { key: 'apiAccess', name: 'API Access', description: 'API access for integrations' },
  { key: 'whiteLabel', name: 'White Label', description: 'White label platform options' },
  { key: 'marketingTools', name: 'Marketing Tools', description: 'Marketing and promotion tools' },
  { key: 'dedicatedAccountManager', name: 'Dedicated Account Manager', description: 'Personal account manager' },
  { key: 'customIntegrations', name: 'Custom Integrations', description: 'Custom system integrations' },
  { key: 'advancedSecurity', name: 'Advanced Security', description: 'Enhanced security features' },
  { key: 'multiLocationSupport', name: 'Multi-Location Support', description: 'Support for multiple locations' },
  { key: 'customReporting', name: 'Custom Reporting', description: 'Custom report generation' }
];

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [commissionTiers, setCommissionTiers] = useState<CommissionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreatePlanData>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    billingCycle: 'MONTHLY',
    features: [],
    maxStudents: 10,
    maxCourses: 5,
    maxTeachers: 2,
    maxLiveClasses: 4,
    attendanceQuota: 20,
    enrollmentQuota: 5,
  });

  // Load subscription plans and commission tiers
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load subscription plans
      const plansResponse = await fetch('/api/admin/settings/subscription-plans');
      if (!plansResponse.ok) {
        throw new Error('Failed to load subscription plans');
      }

      const plansData = await plansResponse.json();
      setPlans(plansData.plans || []);

      // Load commission tiers
      const tiersResponse = await fetch('/api/admin/settings/commission-tiers');
      if (!tiersResponse.ok) {
        throw new Error('Failed to load commission tiers');
      }

      const tiersData = await tiersResponse.json();
      setCommissionTiers(Array.isArray(tiersData) ? tiersData : []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      toast.error(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Create plan
  const handleCreatePlan = async () => {
    try {
      const response = await fetch('/api/admin/settings/subscription-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription plan');
      }

      toast.success('Subscription plan created successfully');
      setShowCreateForm(false);
      setCreateFormData({
        name: '',
        description: '',
        price: 0,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [],
        maxStudents: 10,
        maxCourses: 5,
        maxTeachers: 2,
        maxLiveClasses: 4,
        attendanceQuota: 20,
        enrollmentQuota: 5,
      });
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create subscription plan');
    }
  };

  // Update plan
  const handleUpdatePlan = async (planId: string, updatedData: Partial<SubscriptionPlan>) => {
    try {
      const response = await fetch(`/api/admin/settings/subscription-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription plan');
      }

      toast.success('Subscription plan updated successfully');
      setEditingPlan(null);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update subscription plan');
    }
  };

  // Delete plan
  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/settings/subscription-plans/${planId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscription plan');
      }

      toast.success('Subscription plan deleted successfully');
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete subscription plan');
    }
  };

  // Toggle plan status
  const handleToggleStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/settings/subscription-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription plan status');
      }

      toast.success(`Subscription plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update subscription plan status');
    }
  };

  // Handle feature toggle in create form
  const handleFeatureToggle = (featureKey: string) => {
    setCreateFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureKey)
        ? prev.features.filter(f => f !== featureKey)
        : [...prev.features, featureKey]
    }));
  };

  // Load features from commission tier
  const loadFeaturesFromTier = (planType: string) => {
    const tier = (commissionTiers || []).find(t => t.planType === planType);
    if (tier && tier.features) {
      const tierFeatures = Object.keys(tier.features).filter(key => tier.features[key] === true);
      setCreateFormData(prev => ({
        ...prev,
        features: tierFeatures
      }));
      toast.success(`Loaded features from ${planType} commission tier`);
    } else {
      toast.error(`No commission tier found for ${planType}`);
    }
  };

  // Handle feature toggle in edit form
  const handleEditFeatureToggle = (planId: string, featureKey: string, currentFeatures: string[]) => {
    const updatedFeatures = currentFeatures.includes(featureKey)
      ? currentFeatures.filter(f => f !== featureKey)
      : [...currentFeatures, featureKey];
    
    handleUpdatePlan(planId, { features: updatedFeatures });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading subscription plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Manage subscription plans for institutions
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create Plan Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Subscription Plan</CardTitle>
            <CardDescription>
              Add a new subscription plan for institutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Basic Plan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={createFormData.price}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={createFormData.currency}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, currency: e.target.value }))}
                  placeholder="USD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <select
                  id="billingCycle"
                  value={createFormData.billingCycle}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, billingCycle: e.target.value as 'MONTHLY' | 'YEARLY' }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Max Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  value={createFormData.maxStudents}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCourses">Max Courses</Label>
                <Input
                  id="maxCourses"
                  type="number"
                  value={createFormData.maxCourses}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, maxCourses: parseInt(e.target.value) || 0 }))}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTeachers">Max Teachers</Label>
                <Input
                  id="maxTeachers"
                  type="number"
                  value={createFormData.maxTeachers}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, maxTeachers: parseInt(e.target.value) || 0 }))}
                  placeholder="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLiveClasses">Max Live Classes per Month</Label>
                <Input
                  id="maxLiveClasses"
                  type="number"
                  value={createFormData.maxLiveClasses}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, maxLiveClasses: parseInt(e.target.value) || 0 }))}
                  placeholder="4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendanceQuota">Attendance Quota per Month</Label>
                <Input
                  id="attendanceQuota"
                  type="number"
                  value={createFormData.attendanceQuota}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, attendanceQuota: parseInt(e.target.value) || 0 }))}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentQuota">Enrollment Quota per Month</Label>
                <Input
                  id="enrollmentQuota"
                  type="number"
                  value={createFormData.enrollmentQuota}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, enrollmentQuota: parseInt(e.target.value) || 0 }))}
                  placeholder="5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createFormData.description}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the plan features and benefits..."
                rows={3}
              />
            </div>
            
            {/* Features Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Features</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => loadFeaturesFromTier('STARTER')}
                    className="text-xs"
                  >
                    Load from STARTER
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => loadFeaturesFromTier('PROFESSIONAL')}
                    className="text-xs"
                  >
                    Load from PROFESSIONAL
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => loadFeaturesFromTier('ENTERPRISE')}
                    className="text-xs"
                  >
                    Load from ENTERPRISE
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableFeatures.map((feature) => (
                  <div key={feature.key} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={`feature-${feature.key}`}
                      checked={createFormData.features.includes(feature.key)}
                      onCheckedChange={() => handleFeatureToggle(feature.key)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`feature-${feature.key}`} className="text-sm font-medium">
                        {feature.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreatePlan} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Create Plan
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      <div className="grid gap-4">
        {(plans || []).length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-muted-foreground">No subscription plans found</p>
                <Button onClick={() => setShowCreateForm(true)} className="mt-2">
                  Create your first plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          (plans || []).map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {plan.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                    >
                      {plan.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPlan(editingPlan === plan.id ? null : plan.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="text-lg font-semibold">
                      {plan.currency} {plan.price.toFixed(2)} / {plan.billingCycle.toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Limits</Label>
                    <p className="text-sm text-muted-foreground">
                      {plan.maxStudents} students • {plan.maxCourses} courses • {plan.maxTeachers} teachers
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {plan.maxLiveClasses || 0} live classes/month • {plan.attendanceQuota || 0} attendance quota • {plan.enrollmentQuota || 0} enrollments
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Features Display */}
                {plan.features.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm font-medium">Features</Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {plan.features.map((featureKey) => {
                        const feature = availableFeatures.find(f => f.key === featureKey);
                        return (
                          <div key={featureKey} className="flex items-center gap-2 text-sm">
                            <Check className="h-3 w-3 text-green-500" />
                            {feature ? feature.name : featureKey}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                {editingPlan === plan.id && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-3">Edit Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edit-name-${plan.id}`}>Plan Name</Label>
                        <Input
                          id={`edit-name-${plan.id}`}
                          defaultValue={plan.name}
                          onChange={(e) => {
                            const updatedPlan = { ...plan, name: e.target.value };
                            handleUpdatePlan(plan.id, updatedPlan);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-price-${plan.id}`}>Price</Label>
                        <Input
                          id={`edit-price-${plan.id}`}
                          type="number"
                          defaultValue={plan.price}
                          onChange={(e) => {
                            const updatedPlan = { ...plan, price: parseFloat(e.target.value) || 0 };
                            handleUpdatePlan(plan.id, updatedPlan);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-max-students-${plan.id}`}>Max Students</Label>
                        <Input
                          id={`edit-max-students-${plan.id}`}
                          type="number"
                          defaultValue={plan.maxStudents}
                          onChange={(e) => {
                            const updatedPlan = { ...plan, maxStudents: parseInt(e.target.value) || 0 };
                            handleUpdatePlan(plan.id, updatedPlan);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-max-courses-${plan.id}`}>Max Courses</Label>
                        <Input
                          id={`edit-max-courses-${plan.id}`}
                          type="number"
                          defaultValue={plan.maxCourses}
                          onChange={(e) => {
                            const updatedPlan = { ...plan, maxCourses: parseInt(e.target.value) || 0 };
                            handleUpdatePlan(plan.id, updatedPlan);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-max-live-classes-${plan.id}`}>Max Live Classes per Month</Label>
                        <Input
                          id={`edit-max-live-classes-${plan.id}`}
                          type="number"
                          defaultValue={plan.maxLiveClasses || 4}
                          onChange={(e) => {
                            const updatedPlan = { ...plan, maxLiveClasses: parseInt(e.target.value) || 0 };
                            handleUpdatePlan(plan.id, updatedPlan);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-attendance-quota-${plan.id}`}>Attendance Quota per Month</Label>
                        <Input
                          id={`edit-attendance-quota-${plan.id}`}
                          type="number"
                          defaultValue={plan.attendanceQuota || 20}
                          onChange={(e) => {
                            const updatedPlan = { ...plan, attendanceQuota: parseInt(e.target.value) || 0 };
                            handleUpdatePlan(plan.id, updatedPlan);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-enrollment-quota-${plan.id}`}>Enrollment Quota per Month</Label>
                        <Input
                          id={`edit-enrollment-quota-${plan.id}`}
                          type="number"
                          defaultValue={plan.enrollmentQuota || 5}
                          onChange={(e) => {
                            const updatedPlan = { ...plan, enrollmentQuota: parseInt(e.target.value) || 0 };
                            handleUpdatePlan(plan.id, updatedPlan);
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Edit Features */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Edit Features</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableFeatures.map((feature) => (
                          <div key={feature.key} className="flex items-center space-x-2 p-2 border rounded">
                            <Checkbox
                              id={`edit-feature-${plan.id}-${feature.key}`}
                              checked={plan.features.includes(feature.key)}
                              onCheckedChange={() => handleEditFeatureToggle(plan.id, feature.key, plan.features)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`edit-feature-${plan.id}-${feature.key}`} className="text-sm">
                                {feature.name}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPlan(null)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 