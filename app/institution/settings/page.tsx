'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FaSpinner } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings2, 
  Lock, 
  History, 
  DollarSign, 
  Percent, 
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Tags,
  Users
} from 'lucide-react';
import { formatCurrencyWithSymbol } from '@/lib/utils';
import { DiscountSettingsForm } from '@/components/DiscountSettingsForm';
import { Label } from '@/components/ui/label';
import { SubscriptionManagementCard } from '@/components/SubscriptionManagementCard';
import { Badge } from '@/components/ui/badge';

interface InstitutionSettings {
  id: string;
  name: string;
  currency: string;
  commissionRate: number;
  effectiveCommissionRate?: number;
  defaultMaxStudents: number;
  discountSettings: {
    enabled: boolean;
    startingRate: number;
    incrementRate: number;
    incrementPeriodWeeks: number;
    maxDiscountCap: number;
  };
}

interface CommissionRateLog {
  id: string;
  previousRate: number;
  newRate: number;
  changedAt: string;
  reason: string | null;
  user: {
    name: string;
    email: string;
  };
}

interface FormData {
  commissionRate: number;
  reason: string;
  currency: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  defaultMaxStudents: number;
  discountSettings: {
    enabled: boolean;
    startingRate: number;
    incrementRate: number;
    incrementPeriodWeeks: number;
    maxDiscountCap: number;
  };
}

export default function InstitutionSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<InstitutionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<CommissionRateLog[]>([]);
  const [formData, setFormData] = useState<FormData>({
    commissionRate: 0,
    reason: '',
    currency: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    defaultMaxStudents: 15,
    discountSettings: {
      enabled: false,
      startingRate: 5,
      incrementRate: 2.5,
      incrementPeriodWeeks: 4,
      maxDiscountCap: 50
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.replace('/auth/signin');
        return;
      }

      if (!session?.user?.role || session.user.role !== 'INSTITUTION') {
        router.replace('/');
        return;
      }

      // Only fetch data if we have a valid session and role
      if (status === 'authenticated' && session.user.role === 'INSTITUTION') {
        await fetchSettings();
        await fetchLogs();
      }
    };

    checkAuth();
  }, [session, status]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/settings?institutionId=${session?.user?.institutionId}`);
      if (!response.ok) throw new Error(`Failed to fetch settings - Context: if (!response.ok) throw new Error('Failed to fetch...`);
      const data = await response.json();

      setSettings(data);
      setFormData({
        currency: data.currency,
        commissionRate: data.commissionRate,
        reason: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        defaultMaxStudents: data.defaultMaxStudents,
        discountSettings: data.discountSettings
      });
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load settings. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/institution/commission-rate');
      if (!response.ok) throw new Error(`Failed to fetch logs - Context: const response = await fetch('/api/institution/com...`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load logs. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch commission rate logs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/institution/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionId: session?.user?.institutionId,
          ...formData
        }),
      });

      if (!response.ok) throw new Error(`Failed to update settings - Context: body: JSON.stringify({...`);

      toast.success('Settings updated successfully');
      fetchSettings();
      fetchLogs();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating settings. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Institution Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto sm:h-10">
          <TabsTrigger value="general" className="text-xs sm:text-sm h-8 sm:h-10">
            <Settings2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">General</span>
            <span className="sm:hidden">Gen</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm h-8 sm:h-10">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Sec</span>
          </TabsTrigger>
          <TabsTrigger value="commission" className="text-xs sm:text-sm h-8 sm:h-10">
            <Percent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Commission</span>
            <span className="sm:hidden">Comm</span>
          </TabsTrigger>
          <TabsTrigger value="discounts" className="text-xs sm:text-sm h-8 sm:h-10">
            <Tags className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Discounts</span>
            <span className="sm:hidden">Disc</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs sm:text-sm h-8 sm:h-10">
            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Subscription</span>
            <span className="sm:hidden">Sub</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-indigo-600" />
                      Currency
                    </div>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="bg-white h-10 sm:h-11">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                        <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users className="h-4 w-4 text-indigo-600" />
                      Default Max Students
                    </div>
                    <Input
                      type="number"
                      value={formData.defaultMaxStudents}
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultMaxStudents: parseInt(e.target.value) }))}
                      min="1"
                      max="100"
                      className="bg-white h-10 sm:h-11"
                    />
                    <p className="text-xs text-gray-500">
                      Default maximum students per course
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full sm:w-auto h-10 sm:h-11"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                    <PasswordInput
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                    <PasswordInput
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                    <PasswordInput
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full sm:w-auto h-10 sm:h-11"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                Commission Rate Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="commissionRate" className="text-sm font-medium">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reason" className="text-sm font-medium">Reason for Change</Label>
                    <Input
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Optional reason for commission rate change"
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full sm:w-auto h-10 sm:h-11"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Update Commission Rate'
                    )}
                  </Button>
                </div>

                {/* Commission Rate History */}
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg font-semibold mb-4">Commission Rate History</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{log.oldRate}% → {log.newRate}%</span>
                            <Badge variant="outline" className="text-xs">
                              {log.changedByUser?.name || 'System'}
                            </Badge>
                          </div>
                          {log.reason && (
                            <p className="text-sm text-gray-600 mt-1">{log.reason}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discounts">
          <DiscountSettingsForm 
            settings={formData.discountSettings}
            onSettingsChange={(settings) => setFormData(prev => ({ ...prev, discountSettings: settings }))}
            onSave={handleSubmit}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionManagementCard />
        </TabsContent>
      </Tabs>
    </div>
  );
} 