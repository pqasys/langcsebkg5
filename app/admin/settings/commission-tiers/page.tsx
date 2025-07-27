'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  DollarSign, 
  Percent, 
  Users, 
  BookOpen,
  Crown,
  Zap,
  Building2,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  HeadphonesIcon,
  Palette,
  Globe,
  Shield,
  Code,
  TrendingUp
} from 'lucide-react';

interface CommissionTier {
  id: string;
  planType: string;
  commissionRate: number;
  features: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionPlan {
  id: string;
  planType: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Feature {
  key: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const availableFeatures: Feature[] = [
  { key: 'maxStudents', name: 'Max Students', description: 'Maximum number of students allowed', icon: <Users className="w-4 h-4" /> },
  { key: 'maxCourses', name: 'Max Courses', description: 'Maximum number of courses allowed', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'basicAnalytics', name: 'Basic Analytics', description: 'Basic reporting and analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { key: 'advancedAnalytics', name: 'Advanced Analytics', description: 'Advanced reporting and insights', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'emailSupport', name: 'Email Support', description: 'Email-based customer support', icon: <HeadphonesIcon className="w-4 h-4" /> },
  { key: 'prioritySupport', name: 'Priority Support', description: 'Priority customer support', icon: <Shield className="w-4 h-4" /> },
  { key: 'customBranding', name: 'Custom Branding', description: 'Custom branding options', icon: <Palette className="w-4 h-4" /> },
  { key: 'apiAccess', name: 'API Access', description: 'API access for integrations', icon: <Code className="w-4 h-4" /> },
  { key: 'whiteLabel', name: 'White Label', description: 'White label platform options', icon: <Globe className="w-4 h-4" /> },
  { key: 'marketingTools', name: 'Marketing Tools', description: 'Marketing and promotion tools', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'dedicatedAccountManager', name: 'Dedicated Account Manager', description: 'Personal account manager', icon: <Users className="w-4 h-4" /> },
  { key: 'customIntegrations', name: 'Custom Integrations', description: 'Custom system integrations', icon: <Code className="w-4 h-4" /> },
  { key: 'advancedSecurity', name: 'Advanced Security', description: 'Enhanced security features', icon: <Shield className="w-4 h-4" /> },
  { key: 'multiLocationSupport', name: 'Multi-Location Support', description: 'Support for multiple locations', icon: <Globe className="w-4 h-4" /> },
  { key: 'customReporting', name: 'Custom Reporting', description: 'Custom report generation', icon: <BarChart3 className="w-4 h-4" /> }
];

const planTypes = [
  { value: 'STARTER', label: 'Starter', icon: <Building2 className="w-4 h-4" /> },
  { value: 'PROFESSIONAL', label: 'Professional', icon: <Zap className="w-4 h-4" /> },
  { value: 'ENTERPRISE', label: 'Enterprise', icon: <Crown className="w-4 h-4" /> }
];

export default function CommissionTiersSettingsPage() {
  const { data: session, status } = useSession();
  const [commissionTiers, setCommissionTiers] = useState<CommissionTier[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showTierDialog, setShowTierDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'tiers' | 'plans'>('tiers');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    planType: '',
    commissionRate: 0,
    features: {},
    isActive: true
  });

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'ADMIN') {
      navigate.to('/auth/signin');
      return;
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch commission tiers
      const tiersResponse = await fetch('/api/admin/settings/commission-tiers');
      if (tiersResponse.ok) {
        const tiersData = await tiersResponse.json();
        setCommissionTiers(tiersData);
      }

      // Fetch subscription plans
      const plansResponse = await fetch('/api/admin/settings/subscription-plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setSubscriptionPlans(plansData);
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load data:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchData();
    }
  }, [session]);

  const handleSaveTier = async (tierData: Partial<CommissionTier>) => {
    try {
      const response = await fetch('/api/admin/settings/commission-tiers', {
        method: editingTier ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTier ? { ...tierData, id: editingTier.id } : tierData),
      });

      if (response.ok) {
        toast.success(editingTier ? 'Commission tier updated successfully' : 'Commission tier created successfully');
        setShowTierDialog(false);
        setEditingTier(null);
        fetchData();
      } else {
        throw new Error('Failed to save commission tier');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to saving commission tier:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to save commission tier');
    }
  };

  const handleSavePlan = async (planData: Partial<SubscriptionPlan>) => {
    try {
      const response = await fetch('/api/admin/settings/subscription-plans', {
        method: editingPlan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPlan ? { ...planData, id: editingPlan.id } : planData),
      });

      if (response.ok) {
        toast.success(editingPlan ? 'Subscription plan updated successfully' : 'Subscription plan created successfully');
        setShowPlanDialog(false);
        setEditingPlan(null);
        fetchData();
      } else {
        throw new Error('Failed to save subscription plan');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to saving subscription plan:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to save subscription plan');
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!confirm('Are you sure you want to delete this commission tier?')) return;

    try {
      const response = await fetch(`/api/admin/settings/commission-tiers/${tierId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Commission tier deleted successfully');
        fetchData();
      } else {
        throw new Error('Failed to delete commission tier');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to deleting commission tier:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete commission tier');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return;

    try {
      const response = await fetch(`/api/admin/settings/subscription-plans/${planId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Subscription plan deleted successfully');
        fetchData();
      } else {
        throw new Error('Failed to delete subscription plan');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to deleting subscription plan:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete subscription plan');
    }
  };

  const getPlanIcon = (planType: string) => {
    const plan = planTypes.find(p => p.value === planType);
    return plan?.icon || <Building2 className="w-4 h-4" />;
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/settings/commission-tiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newTier = await response.json();
        setCommissionTiers([...commissionTiers, newTier]);
        setIsCreating(false);
        setFormData({ planType: '', commissionRate: 0, features: {}, isActive: true });
        toast.success('Commission tier created successfully');
      } else {
        toast.error('Failed to create commission tier');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to creating commission tier. Please try again or contact support if the problem persists.`);
    }
  };

  const handleUpdate = async () => {
    if (!editingTier) return;

    try {
      const response = await fetch('/api/admin/settings/commission-tiers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingTier.id })
      });

      if (response.ok) {
        const updatedTier = await response.json();
        setCommissionTiers(commissionTiers.map(tier => tier.id === updatedTier.id ? updatedTier : tier));
        setEditingTier(null);
        setFormData({ planType: '', commissionRate: 0, features: {}, isActive: true });
        toast.success('Commission tier updated successfully');
      } else {
        toast.error('Failed to update commission tier');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating commission tier. Please try again or contact support if the problem persists.`);
    }
  };

  const handleEdit = (tier: CommissionTier) => {
    setEditingTier(tier);
    setFormData({
      planType: tier.planType,
      commissionRate: tier.commissionRate,
      features: tier.features,
      isActive: tier.isActive
    });
  };

  const handleCancel = () => {
    setEditingTier(null);
    setIsCreating(false);
    setFormData({ planType: '', commissionRate: 0, features: {}, isActive: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Commission & Pricing Settings</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage commission tiers and subscription plan pricing
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('tiers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'tiers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Commission Tiers
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'plans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subscription Plans
            </button>
          </nav>
        </div>

        {/* Commission Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Commission Tiers</h2>
              <Dialog open={showTierDialog} onOpenChange={setShowTierDialog}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingTier(null);
                      setIsCreating(true);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Commission Tier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {isCreating ? 'Create New Tier' : 'Edit Tier'}
                    </DialogTitle>
                  </DialogHeader>
                  <CommissionTierForm
                    tier={editingTier}
                    onSave={handleSaveTier}
                    onCancel={handleCancel}
                    formData={formData}
                    setFormData={setFormData}
                    handleCreate={handleCreate}
                    handleUpdate={handleUpdate}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {commissionTiers.map((tier) => (
                <Card key={tier.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center gap-2">
                        {getPlanIcon(tier.planType)}
                        <CardTitle className="text-base sm:text-lg">{tier.planType}</CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <Badge variant={tier.isActive ? 'default' : 'secondary'} className="text-xs">
                          {tier.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{tier.commissionRate}% Commission</Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleEdit(tier);
                              setShowTierDialog(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTier(tier.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">Features</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {availableFeatures.map((feature) => (
                            <div key={feature.key} className="flex items-center gap-2">
                              {tier.features[feature.key] ? (
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                              )}
                              <span className="text-xs sm:text-sm text-gray-600 truncate">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Subscription Plans</h2>
              <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setEditingPlan(null)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subscription Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPlan ? 'Edit Subscription Plan' : 'Add Subscription Plan'}
                    </DialogTitle>
                  </DialogHeader>
                  <SubscriptionPlanForm
                    plan={editingPlan}
                    onSave={handleSavePlan}
                    onCancel={() => {
                      setShowPlanDialog(false);
                      setEditingPlan(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center gap-2">
                        {getPlanIcon(plan.planType)}
                        <CardTitle className="text-base sm:text-lg">{plan.name}</CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <Badge variant={plan.isActive ? 'default' : 'secondary'} className="text-xs">
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPlan(plan);
                              setShowPlanDialog(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Monthly Price</span>
                        <span className="text-base sm:text-lg font-semibold text-blue-600">
                          ${plan.monthlyPrice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Annual Price</span>
                        <span className="text-base sm:text-lg font-semibold text-blue-600">
                          ${plan.annualPrice}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">Features</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {availableFeatures.map((feature) => (
                            <div key={feature.key} className="flex items-center gap-2">
                              {plan.features[feature.key] ? (
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                              )}
                              <span className="text-xs sm:text-sm text-gray-600 truncate">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Commission Tier Form Component
function CommissionTierForm({ 
  tier, 
  onSave, 
  onCancel, 
  formData, 
  setFormData, 
  handleCreate, 
  handleUpdate 
}: { 
  tier: CommissionTier | null; 
  onSave: (data: Partial<CommissionTier>) => void; 
  onCancel: () => void; 
  formData: unknown; 
  setFormData: React.Dispatch<React.SetStateAction<any>>; 
  handleCreate: () => void; 
  handleUpdate: () => void; 
}) {
  const handleFeatureToggle = (featureKey: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: !prev.features[featureKey]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tier) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="planType">Plan Type</Label>
          <Select
            value={formData.planType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {planTypes.map((plan) => (
                <SelectItem key={plan.value} value={plan.value}>
                  <div className="flex items-center gap-2">
                    {plan.icon}
                    {plan.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="commissionRate">Commission Rate (%)</Label>
          <Input
            id="commissionRate"
            type="number"
            value={formData.commissionRate}
            onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Badge 
            variant={formData.isActive ? "default" : "secondary"}
            className={`text-xs font-medium px-2 py-1 ${formData.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            {formData.isActive ? 'ON' : 'OFF'}
          </Badge>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="isActive" className="text-sm font-medium">Active</Label>
          <span className="text-xs text-gray-600 dark:text-gray-400">Enable or disable this commission tier</span>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Features</Label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Select the features available for this tier</p>
        <div className="mt-2 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {availableFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-1">
                <Switch
                  id={feature.key}
                  checked={!!formData.features[feature.key]}
                  onCheckedChange={() => handleFeatureToggle(feature.key)}
                />
                <Badge 
                  variant={!!formData.features[feature.key] ? "default" : "secondary"}
                  className={`text-xs font-medium px-1.5 py-0.5 ${!!formData.features[feature.key] ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  {!!formData.features[feature.key] ? 'ON' : 'OFF'}
                </Badge>
              </div>
              <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                <div className="text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <Label htmlFor={feature.key} className="text-xs font-medium cursor-pointer truncate">
                    {feature.name}
                  </Label>
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{feature.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          {tier ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

// Subscription Plan Form Component
function SubscriptionPlanForm({ 
  plan, 
  onSave, 
  onCancel 
}: { 
  plan: SubscriptionPlan | null; 
  onSave: (data: Partial<SubscriptionPlan>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    planType: plan?.planType || 'STARTER',
    name: plan?.name || '',
    monthlyPrice: plan?.monthlyPrice || 0,
    annualPrice: plan?.annualPrice || 0,
    isActive: plan?.isActive ?? true,
    features: plan?.features || {}
  });

  const handleFeatureToggle = (featureKey: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: !prev.features[featureKey]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="planType">Plan Type</Label>
          <Select
            value={formData.planType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {planTypes.map((plan) => (
                <SelectItem key={plan.value} value={plan.value}>
                  <div className="flex items-center gap-2">
                    {plan.icon}
                    {plan.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
          <Input
            id="monthlyPrice"
            type="number"
            value={formData.monthlyPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, monthlyPrice: parseFloat(e.target.value) }))}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="annualPrice">Annual Price ($)</Label>
          <Input
            id="annualPrice"
            type="number"
            value={formData.annualPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, annualPrice: parseFloat(e.target.value) }))}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Badge 
            variant={formData.isActive ? "default" : "secondary"}
            className={`text-xs font-medium px-2 py-1 ${formData.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            {formData.isActive ? 'ON' : 'OFF'}
          </Badge>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="isActive" className="text-sm font-medium">Active</Label>
          <span className="text-xs text-gray-600 dark:text-gray-400">Enable or disable this subscription plan</span>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Features</Label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Select the features available for this plan</p>
        <div className="mt-2 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {availableFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-1">
                <Switch
                  id={feature.key}
                  checked={!!formData.features[feature.key]}
                  onCheckedChange={() => handleFeatureToggle(feature.key)}
                />
                <Badge 
                  variant={!!formData.features[feature.key] ? "default" : "secondary"}
                  className={`text-xs font-medium px-1.5 py-0.5 ${!!formData.features[feature.key] ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  {!!formData.features[feature.key] ? 'ON' : 'OFF'}
                </Badge>
              </div>
              <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                <div className="text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <Label htmlFor={feature.key} className="text-xs font-medium cursor-pointer truncate">
                    {feature.name}
                  </Label>
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{feature.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
} 