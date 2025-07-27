'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Check, X, Plus, Trash2, AlertTriangle, Info, Shield, CreditCard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EnhancedSwitch } from '@/components/ui/enhanced-switch';

interface PaymentApprovalSettings {
  allowInstitutionPaymentApproval: boolean;
  showInstitutionApprovalButtons: boolean;
  defaultPaymentStatus: string;
  institutionApprovableMethods: string[];
  adminOnlyMethods: string[];
  institutionPaymentApprovalExemptions: string[];
  fileUploadMaxSizeMB: number;
}

interface Institution {
  id: string;
  name: string;
  email: string;
}

interface ImpactAssessment {
  totalPendingPayments: number;
  affectedPendingPayments: number;
  unaffectedPendingPayments: number;
}

const PAYMENT_METHODS = [
  'MANUAL',
  'BANK_TRANSFER', 
  'CASH',
  'CREDIT_CARD',
  'PAYPAL',
  'STRIPE',
  'WIRE_TRANSFER',
  'CHECK',
  'MONEY_ORDER'
];

const PAYMENT_STATUSES = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REFUNDED',
  'CANCELLED'
];

export default function PaymentApprovalSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PaymentApprovalSettings>({
    allowInstitutionPaymentApproval: true,
    showInstitutionApprovalButtons: true,
    defaultPaymentStatus: 'PENDING',
    institutionApprovableMethods: ['MANUAL', 'BANK_TRANSFER', 'CASH'],
    adminOnlyMethods: ['CREDIT_CARD', 'PAYPAL', 'STRIPE'],
    institutionPaymentApprovalExemptions: [],
    fileUploadMaxSizeMB: 10
  });
  const [originalSettings, setOriginalSettings] = useState<PaymentApprovalSettings | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [impact, setImpact] = useState<ImpactAssessment | null>(null);
  const [newMethod, setNewMethod] = useState('');
  const [newAdminMethod, setNewAdminMethod] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchSettings();
  }, [session, status]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings/payment-approval');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data.settings);
      setOriginalSettings(data.settings);
      setInstitutions(data.institutions);
      setImpact(data.impact);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load settings:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings/payment-approval', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const result = await response.json();
        setOriginalSettings(settings);
        toast.success(result.message);
        
        // Show impact warning if there are affected payments
        if (result.impact) {
          toast.warning(result.impact.message, {
            duration: 8000,
            action: {
              label: 'View Payments',
              onClick: () => router.push('/admin/payments')
            }
          });
        }
        
        // Refresh impact data
        fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save settings');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to saving settings:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addInstitutionApprovableMethod = () => {
    if (newMethod && !settings.institutionApprovableMethods.includes(newMethod)) {
      setSettings(prev => ({
        ...prev,
        institutionApprovableMethods: [...prev.institutionApprovableMethods, newMethod]
      }));
      setNewMethod('');
    }
  };

  const removeInstitutionApprovableMethod = (method: string) => {
    setSettings(prev => ({
      ...prev,
      institutionApprovableMethods: prev.institutionApprovableMethods.filter(m => m !== method)
    }));
  };

  const addAdminOnlyMethod = () => {
    if (newAdminMethod && !settings.adminOnlyMethods.includes(newAdminMethod)) {
      setSettings(prev => ({
        ...prev,
        adminOnlyMethods: [...prev.adminOnlyMethods, newAdminMethod]
      }));
      setNewAdminMethod('');
    }
  };

  const removeAdminOnlyMethod = (method: string) => {
    setSettings(prev => ({
      ...prev,
      adminOnlyMethods: prev.adminOnlyMethods.filter(m => m !== method)
    }));
  };

  const toggleInstitutionExemption = (institutionId: string) => {
    setSettings(prev => ({
      ...prev,
      institutionPaymentApprovalExemptions: prev.institutionPaymentApprovalExemptions.includes(institutionId)
        ? prev.institutionPaymentApprovalExemptions.filter(id => id !== institutionId)
        : [...prev.institutionPaymentApprovalExemptions, institutionId]
    }));
  };

  // Check if settings have changed
  const hasChanges = originalSettings && JSON.stringify(settings) !== JSON.stringify(originalSettings);

  // Check if this change will affect pending payments
  const willAffectPendingPayments = () => {
    if (!originalSettings || !impact) return false;
    
    // Check if institution approval is being disabled
    if (originalSettings.allowInstitutionPaymentApproval && !settings.allowInstitutionPaymentApproval) {
      return impact.affectedPendingPayments > 0;
    }
    
    // Check if exemptions are being added
    if (settings.institutionPaymentApprovalExemptions.length > originalSettings.institutionPaymentApprovalExemptions.length) {
      return impact.affectedPendingPayments > 0;
    }
    
    // Check if methods are being restricted
    if (settings.institutionApprovableMethods.length < originalSettings.institutionApprovableMethods.length) {
      return impact.affectedPendingPayments > 0;
    }
    
    return false;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Payment Approval Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure payment approval permissions for institutions
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/payments')}
          >
            View Pending Payments
          </Button>
          <Button
            onClick={saveSettings}
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>

      {/* Impact Assessment */}
      {impact && (
        <Card className="border-2 border-blue-200 dark:border-blue-700">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Info className="h-5 w-5" />
              Current Impact Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {impact.totalPendingPayments}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Pending Payments
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {impact.affectedPendingPayments}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Institution Approvable
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {impact.unaffectedPendingPayments}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  Admin Only
                </div>
              </div>
            </div>
            
            {willAffectPendingPayments() && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Warning: This change will affect pending payments
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                  {impact.affectedPendingPayments} pending payment(s) will now require admin approval. 
                  These payments remain fully approvable by administrators and will not be lost.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        {/* Global Settings */}
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Shield className="h-5 w-5 text-blue-600" />
              Global Payment Approval Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Allow Institution Payment Approval Toggle */}
            <EnhancedSwitch
              id="allowInstitutionPaymentApproval"
              checked={settings.allowInstitutionPaymentApproval}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowInstitutionPaymentApproval: checked }))}
              label="Allow Institution Payment Approval"
              description={settings.allowInstitutionPaymentApproval 
                ? "Institutions can approve their own payments. This reduces admin workload but requires trust in institutions."
                : "All payments require admin approval. This ensures better control but increases admin workload."
              }
              activeColor="green"
              inactiveColor="red"
              activeText="ENABLED"
              inactiveText="DISABLED"
              className="mb-6"
            />

            {/* Show Institution Approval Buttons Toggle */}
            <EnhancedSwitch
              id="showInstitutionApprovalButtons"
              checked={settings.showInstitutionApprovalButtons}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showInstitutionApprovalButtons: checked }))}
              label="Show Institution Approval Buttons"
              description={settings.showInstitutionApprovalButtons 
                ? "Payment approval buttons are visible in institution dashboard. Institutions can see and use approval controls."
                : "Payment approval buttons are hidden from institutions. Only admins can see approval controls."
              }
              activeColor="blue"
              inactiveColor="gray"
              activeText="VISIBLE"
              inactiveText="HIDDEN"
              className="mb-6"
            />

            {/* Default Payment Status */}
            <div className="space-y-2">
              <Label htmlFor="defaultPaymentStatus" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Default Payment Status
              </Label>
              <Select
                value={settings.defaultPaymentStatus}
                onValueChange={(value) => setSettings(prev => ({ ...prev, defaultPaymentStatus: value }))}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select default status" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status assigned to new payments when created
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Institution Approvable Methods */}
          <Card className="border-2 border-green-200 dark:border-green-700">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Check className="h-5 w-5" />
                Institution Approvable Methods
              </CardTitle>
              <p className="text-sm text-green-700 dark:text-green-300">
                Payment methods that institutions can approve
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Select value={newMethod} onValueChange={setNewMethod}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.filter(method => 
                      !settings.institutionApprovableMethods.includes(method)
                    ).map(method => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  onClick={addInstitutionApprovableMethod} 
                  disabled={!newMethod}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {settings.institutionApprovableMethods.map(method => (
                  <Badge key={method} variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
                    {method}
                    <button
                      onClick={() => removeInstitutionApprovableMethod(method)}
                      className="ml-1 hover:text-red-600 transition-colors"
                      aria-label={`Remove ${method}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Only Methods */}
          <Card className="border-2 border-red-200 dark:border-red-700">
            <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700">
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <Shield className="h-5 w-5" />
                Admin Only Methods
              </CardTitle>
              <p className="text-sm text-red-700 dark:text-red-300">
                Payment methods that require admin approval
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Select value={newAdminMethod} onValueChange={setNewAdminMethod}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.filter(method => 
                      !settings.adminOnlyMethods.includes(method)
                    ).map(method => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  onClick={addAdminOnlyMethod} 
                  disabled={!newAdminMethod}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {settings.adminOnlyMethods.map(method => (
                  <Badge key={method} variant="destructive" className="flex items-center gap-1">
                    {method}
                    <button
                      onClick={() => removeAdminOnlyMethod(method)}
                      className="ml-1 hover:text-white transition-colors"
                      aria-label={`Remove ${method}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Institution Exemptions */}
        <Card className="border-2 border-orange-200 dark:border-orange-700">
          <CardHeader className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-700">
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              Institution Exemptions
            </CardTitle>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Institutions exempted from payment approval (will always require admin approval)
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {institutions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Info className="h-8 w-8 mx-auto mb-2" />
                  <p>No institutions found</p>
                </div>
              ) : (
                institutions.map(institution => (
                  <div key={institution.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{institution.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{institution.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {settings.institutionPaymentApprovalExemptions.includes(institution.id) ? (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                          <X className="h-3 w-3 mr-1" />
                          Exempted
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                          <Check className="h-3 w-3 mr-1" />
                          Allowed
                        </Badge>
                      )}
                      <Switch
                        checked={settings.institutionPaymentApprovalExemptions.includes(institution.id)}
                        onCheckedChange={() => toggleInstitutionExemption(institution.id)}
                        className="data-[state=checked]:bg-orange-600"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-2 border-blue-200 dark:border-blue-700">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Info className="h-5 w-5" />
              Settings Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>Institution Approval:</strong> 
                  <Badge variant={settings.allowInstitutionPaymentApproval ? "default" : "secondary"} className="ml-2">
                    {settings.allowInstitutionPaymentApproval ? "Enabled" : "Disabled"}
                  </Badge>
                </p>
                <p><strong>Approval Buttons:</strong> 
                  <Badge variant={settings.showInstitutionApprovalButtons ? "default" : "secondary"} className="ml-2">
                    {settings.showInstitutionApprovalButtons ? "Visible" : "Hidden"}
                  </Badge>
                </p>
                <p><strong>Default Status:</strong> 
                  <Badge variant="outline" className="ml-2">{settings.defaultPaymentStatus}</Badge>
                </p>
              </div>
              <div className="space-y-2">
                <p><strong>Institution Methods:</strong> 
                  <Badge variant="outline" className="ml-2">{settings.institutionApprovableMethods.length} methods</Badge>
                </p>
                <p><strong>Admin Only Methods:</strong> 
                  <Badge variant="outline" className="ml-2">{settings.adminOnlyMethods.length} methods</Badge>
                </p>
                <p><strong>Exempted Institutions:</strong> 
                  <Badge variant="outline" className="ml-2">{settings.institutionPaymentApprovalExemptions.length} institutions</Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 