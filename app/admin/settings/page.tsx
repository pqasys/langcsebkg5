'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaEdit, FaSave, FaTimes, FaCode, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Loader2, AlertCircle, Trash2, Mail, CheckCircle, Users, UserCheck, Bell, BookOpen, Activity, Clock, FileText, CreditCard, DollarSign, TrendingUp, Calculator, Award, Calendar, BarChart3, MessageSquare, Plus, Settings, Database, Zap, Search, Play, Wrench } from 'lucide-react';
import { EnhancedSwitch } from '@/components/ui/enhanced-switch';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Institution {
  id: string;
  name: string;
  currency: string;
  commissionRate: number;
  logoUrl: string | null;
}

interface CommissionRateLog {
  id: string;
  oldRate: number;
  newRate: number;
  reason: string;
  createdAt: string;
}

interface EmailSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  rejectUnauthorized: boolean;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject?: string;
  title: string;
  content: string;
  variables?: unknown;
  isActive: boolean;
  isDefault: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
  updatedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

interface NotificationLog {
  id: string;
  templateId?: string;
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  type: string;
  subject?: string;
  title: string;
  content: string;
  status: string;
  errorMessage?: string;
  sentAt?: string;
  readAt?: string;
  metadata?: unknown;
  createdAt: string;
  createdBy?: string;
  template?: {
    id: string;
    name: string;
    type: string;
    category: string;
  };
  recipient?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  sender?: {
    id: string;
    name: string;
    email: string;
  };
}

interface NotificationStats {
  overview: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
    successRate: number;
  };
  templates: {
    total: number;
    active: number;
  };
  systemNotifications: {
    total: number;
    active: number;
  };
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
  topRecipients: Array<{
    email: string;
    count: number;
  }>;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<Record<string, CommissionRateLog[]>>({});
  const [editingInstitution, setEditingInstitution] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currency: '',
    commissionRate: 0,
    reason: ''
  });
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeedingTags, setIsSeedingTags] = useState(false);
  const [seedResults, setSeedResults] = useState<{
    categories?: { created: number; skipped: number; errors: number; total: number };
    tags?: { created: number; skipped: number; errors: number; total: number };
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupResults, setCleanupResults] = useState<any>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    host: '',
    port: 587,
    secure: true,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
    rejectUnauthorized: false,
  });
  const [savingEmail, setSavingEmail] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [originalEmailSettings, setOriginalEmailSettings] = useState<EmailSettings | null>(null);
  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fileUploadMaxSizeMB, setFileUploadMaxSizeMB] = useState<number>(10);
  const [fixResult, setFixResult] = useState<string | null>(null);
  const [fixing, setFixing] = useState(false);

  // Error scanning state
  const [errorScripts, setErrorScripts] = useState<any[]>([]);
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [scriptResults, setScriptResults] = useState<Record<string, any>>({});
  const [loadingScripts, setLoadingScripts] = useState(false);

  // Notification state
  const [notificationTemplates, setNotificationTemplates] = useState<any[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<any[]>([]);
  const [notificationStats, setNotificationStats] = useState<any>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [viewingTemplate, setViewingTemplate] = useState<any>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'email',
    subject: '',
    title: '',
    content: '',
    category: 'system',
    isActive: true,
    isDefault: false
  });
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsFilters, setLogsFilters] = useState({
    status: 'all',
    type: 'all',
    recipientEmail: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchInstitutions();
    fetchEmailSettings();
    fetch('/api/admin/settings/general')
      .then(res => res.json())
      .then(data => {
        if (data.fileUploadMaxSizeMB) setFileUploadMaxSizeMB(data.fileUploadMaxSizeMB);
      });
  }, [session, status]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/institutions/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }
      const data = await response.json();
      setInstitutions(data);
      
      // Fetch logs for each institution
      const logsData: Record<string, CommissionRateLog[]> = {};
      for (const institution of data) {
        const logsResponse = await fetch(`/api/admin/institutions/${institution.id}/commission-rate`);
        if (logsResponse.ok) {
          logsData[institution.id] = await logsResponse.json();
        }
      }
      setLogs(logsData);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load institutions:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailSettings = async () => {
    try {
      setLoadingEmail(true);
      const response = await fetch('/api/admin/settings/email');
      if (!response.ok) {
        throw new Error('Failed to fetch email settings');
      }
      const data = await response.json();
      setEmailSettings(data);
      setOriginalEmailSettings(data);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load email settings:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load email settings');
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution.id);
    setFormData({
      currency: institution.currency,
      commissionRate: institution.commissionRate,
      reason: ''
    });
  };

  const handleCancel = () => {
    setEditingInstitution(null);
    setFormData({
      currency: '',
      commissionRate: 0,
      reason: ''
    });
  };

  const handleSave = async (institutionId: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/institutions/${institutionId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update institution settings');
      }

      await fetchInstitutions();
      setEditingInstitution(null);
      toast.success('Institution settings updated successfully');
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating institution settings:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update institution settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedCategories = async () => {
    if (!confirm('Are you sure you want to seed the default categories? This will only add categories that don\'t already exist.')) {
      return;
    }

    try {
      setIsSeeding(true);
      const response = await fetch('/api/admin/settings/seed-categories', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to seed categories');
      }

      const data = await response.json();
      setSeedResults(prev => ({
        ...prev,
        categories: {
          created: data.results.created,
          skipped: data.results.skipped,
          errors: data.results.errors,
          total: data.results.details.length
        }
      }));
      toast.success(`Categories seeded successfully! Created: ${data.results.created}, Skipped: ${data.results.skipped}, Errors: ${data.results.errors}`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to seeding categories:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to seed categories');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedTags = async () => {
    if (!confirm('Are you sure you want to seed the default tags? This will only add tags that don\'t already exist.')) {
      return;
    }

    try {
      setIsSeedingTags(true);
      const response = await fetch('/api/admin/settings/seed-tags', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to seed tags');
      }

      const data = await response.json();
      setSeedResults(prev => ({
        ...prev,
        tags: {
          created: data.results.created,
          skipped: data.results.skipped,
          errors: data.results.errors,
          total: data.results.details.length
        }
      }));
      toast.success(`Tags seeded successfully! Created: ${data.results.created}, Skipped: ${data.results.skipped}, Errors: ${data.results.errors}`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to seeding tags:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to seed tags');
    } finally {
      setIsSeedingTags(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to delete all enrollment and dependent records? This action cannot be undone.')) {
      return;
    }

    setIsCleaning(true);
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to perform cleanup');
      }

      const result = await response.json();
      setCleanupResults(result.deletedRecords);
      toast.success('Cleanup completed successfully');
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to during cleanup:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to perform cleanup');
    } finally {
      setIsCleaning(false);
    }
  };

  const handleOrphanedRecordsCleanup = async () => {
    if (!confirm('Are you sure you want to clean up orphaned records? This action cannot be undone.')) {
      return;
    }

    setIsCleaning(true);
    try {
      const response = await fetch('/api/admin/scripts/cleanup-orphaned-records', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform orphaned records cleanup');
      }

      const result = await response.json();
      setCleanupResults(result.details);
      toast.success(`Orphaned records cleanup completed! ${result.totalRecordsCleaned} records cleaned.`);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to perform orphaned records cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleSampleDataCleanup = async () => {
    if (!confirm('Are you sure you want to remove all sample data? This action cannot be undone.')) {
      return;
    }

    setIsCleaning(true);
    try {
      const response = await fetch('/api/admin/cleanup-sample-data', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cleanup sample data');
      }

      const result = await response.json();
      setCleanupResults(result.results);
      toast.success('Sample data cleanup completed successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to cleanup sample data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);

    try {
      // Check if any settings have changed
      const hasChanges = Object.keys(emailSettings).some(
        (key) => key !== 'password' && emailSettings[key as keyof EmailSettings] !== originalEmailSettings?.[key as keyof EmailSettings]
      );
      
      // Check if password is being changed
      const isPasswordChanged = emailSettings.password !== originalEmailSettings?.password;
      
      if (isPasswordChanged) {
        // Validate password change
        if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {
          toast.error('Please fill in all password fields');
          setSavingEmail(false);
          return;
        }

        if (passwordChange.newPassword !== passwordChange.confirmPassword) {
          toast.error('New passwords do not match');
          setSavingEmail(false);
          return;
        }

        // Send all settings with password change
        const response = await fetch('/api/admin/settings/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...emailSettings,
            currentPassword: passwordChange.currentPassword,
            newPassword: passwordChange.newPassword,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save email settings');
        }
      } else if (hasChanges) {
        // If only other settings changed (not password), don't send password-related fields
        const { password, ...settingsWithoutPassword } = emailSettings;
        const response = await fetch('/api/admin/settings/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsWithoutPassword),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save email settings');
        }
      } else {
        // No changes detected
        toast.info('No changes to save');
        setSavingEmail(false);
        return;
      }

      toast.success('Email settings saved successfully');
      setShowPasswordFields(false);
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      await fetchEmailSettings(); // Refresh settings
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to saving email settings:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to save email settings');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/admin/settings/email/test', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send test email');
      }

      toast.success('Test email sent successfully');
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to sending test email:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to send test email');
    }
  };

  const handleFixMissingStudents = async () => {
    try {
      setFixing(true);
      const response = await fetch('/api/admin/fix-missing-students', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fix missing students');
      }

      const data = await response.json();
      setFixResult(`Fixed ${data.fixed} missing student records`);
      toast.success(`Fixed ${data.fixed} missing student records`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to fixing missing students:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to fix missing students');
    } finally {
      setFixing(false);
    }
  };

  // Notification functions
  const fetchNotificationTemplates = async () => {
    try {
      setLoadingNotifications(true);
      // // // // // // // // // // // // console.log('Fetching notification templates...');
      const response = await fetch('/api/admin/settings/notifications/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch notification templates');
      }
      const data = await response.json();
      console.log('Notification templates loaded:', data);
      setNotificationTemplates(data);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load notification templates:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch notification templates');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchNotificationLogs = async () => {
    try {
      setLoadingNotifications(true);
      const params = new URLSearchParams({
        page: logsPage.toString(),
        limit: '20',
        ...logsFilters
      });
      
      const response = await fetch(`/api/admin/settings/notifications/logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notification logs');
      }
      const data = await response.json();
      setNotificationLogs(data.logs);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load notification logs:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch notification logs');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchNotificationStats = async () => {
    try {
      const response = await fetch('/api/admin/settings/notifications/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch notification stats');
      }
      const data = await response.json();
      setNotificationStats(data);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load notification stats:. Please try again or contact support if the problem persists.`);
    }
  };

  const handleSeedNotificationTemplates = async () => {
    try {
      const response = await fetch('/api/admin/settings/notifications/seed-templates', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to seed notification templates');
      }

      toast.success('Default notification templates created successfully');
      await fetchNotificationTemplates();
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to seeding notification templates:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to seed notification templates');
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/admin/settings/notifications/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create template');
      }

      toast.success('Template created successfully');
      setShowTemplateForm(false);
      setTemplateForm({
        name: '',
        type: 'email',
        subject: '',
        title: '',
        content: '',
        category: 'system',
        isActive: true,
        isDefault: false
      });
      await fetchNotificationTemplates();
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to creating template:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to create template');
    }
  };

  const handleUpdateTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/settings/notifications/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update template');
      }

      toast.success('Template updated successfully');
      setEditingTemplate(null);
      setTemplateForm({
        name: '',
        type: 'email',
        subject: '',
        title: '',
        content: '',
        category: 'system',
        isActive: true,
        isDefault: false
      });
      await fetchNotificationTemplates();
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating template:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to update template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/settings/notifications/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete template');
      }

      toast.success('Template deleted successfully');
      await fetchNotificationTemplates();
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to deleting template:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to delete template');
    }
  };

  const handleEditTemplate = (template: unknown) => {
    console.log('handleEditTemplate called with template:', template);
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      type: template.type,
      subject: template.subject || '',
      title: template.title,
      content: template.content,
      category: template.category,
      isActive: template.isActive,
      isDefault: template.isDefault
    });
  };

  const handleViewTemplate = (template: unknown) => {
    setViewingTemplate(template);
  };

  const handleCancelTemplateEdit = () => {
    setEditingTemplate(null);
    setShowTemplateForm(false);
    setTemplateForm({
      name: '',
      type: 'email',
      subject: '',
      title: '',
      content: '',
      category: 'system',
      isActive: true,
      isDefault: false
    });
  };

  // Error scanning functions
  const fetchErrorScripts = async () => {
    try {
      setLoadingScripts(true);
      const response = await fetch('/api/admin/settings/error-scanning');
      const data = await response.json();
      
      if (data.success) {
        setErrorScripts(data.scripts);
      } else {
        toast.error('Failed to fetch error scanning scripts');
      }
    } catch (error) {
      console.error('Error fetching scripts:', error);
      toast.error('Failed to fetch error scanning scripts');
    } finally {
      setLoadingScripts(false);
    }
  };

  const runErrorScript = async (scriptType: string) => {
    try {
      setRunningScript(scriptType);
      setScriptResults(prev => ({ ...prev, [scriptType]: null }));
      
      const response = await fetch('/api/admin/settings/error-scanning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'run',
          scriptType
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setScriptResults(prev => ({ 
          ...prev, 
          [scriptType]: {
            success: true,
            message: data.message,
            output: data.output
          }
        }));
        toast.success(`${data.scriptName} completed successfully`);
      } else {
        setScriptResults(prev => ({ 
          ...prev, 
          [scriptType]: {
            success: false,
            error: data.error,
            details: data.details
          }
        }));
        toast.error(`Failed to run ${data.scriptName}: ${data.error}`);
      }
    } catch (error) {
      console.error('Error running script:', error);
      setScriptResults(prev => ({ 
        ...prev, 
        [scriptType]: {
          success: false,
          error: 'Network error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      toast.error('Failed to run script');
    } finally {
      setRunningScript(null);
    }
  };

  // Load notifications data when component mounts
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchNotificationTemplates();
      fetchNotificationStats();
      fetchErrorScripts();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button
          onClick={() => router.push('/admin/settings/common-scripts')}
          className="flex items-center gap-2"
        >
          <FaCode className="h-4 w-4" />
          Common Scripts
        </Button>
      </div>

      <Tabs defaultValue="institutions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="institutions">Institution Settings</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="cleanup">Data Cleanup</TabsTrigger>
          <TabsTrigger value="error-scanning">Error Scanning</TabsTrigger>
        </TabsList>

        <TabsContent value="institutions">
          <div className="space-y-8">
            {institutions.map((institution) => (
              <Card key={institution.id} className="shadow-lg">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {institution.logoUrl ? (
                        <img
                          src={institution.logoUrl}
                          alt={`${institution.name} logo`}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center border">
                          <span className="text-xl font-semibold text-gray-500">
                            {institution.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {institution.name}
                      </CardTitle>
                    </div>
                    {editingInstitution === institution.id ? (
                      <div className="space-x-2">
                        <Button
                          onClick={() => handleSave(institution.id)}
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {saving ? (
                            <FaSpinner className="animate-spin h-4 w-4" />
                          ) : (
                            <FaSave className="h-4 w-4" />
                          )}
                          <span className="ml-2">Save</span>
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <FaTimes className="h-4 w-4" />
                          <span className="ml-2">Cancel</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleEdit(institution)}
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        <FaEdit className="h-4 w-4" />
                        <span className="ml-2">Edit</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingInstitution === institution.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Currency</label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => setFormData({ ...formData, currency: value })}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
                        <Input
                          type="number"
                          value={formData.commissionRate}
                          onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                          className="mt-1"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reason for Change</label>
                        <Textarea
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="mt-1"
                          placeholder="Explain the reason for changing the settings..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Currency</h3>
                        <p className="mt-1 text-lg font-semibold">{institution.currency}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Commission Rate</h3>
                        <p className="mt-1 text-lg font-semibold">{institution.commissionRate}%</p>
                      </div>
                    </div>
                  )}

                  {logs[institution.id]?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Commission Rate History</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Old Rate</TableHead>
                            <TableHead>New Rate</TableHead>
                            <TableHead>Reason</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {logs[institution.id].map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>{new Date(log.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>{log.oldRate}%</TableCell>
                              <TableCell>{log.newRate}%</TableCell>
                              <TableCell>{log.reason}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Seed the database with common language course categories. This will only add categories that don't already exist.
                  </p>
                  <Button
                    onClick={handleSeedCategories}
                    disabled={isSeeding}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSeeding ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Seeding Categories...
                      </>
                    ) : (
                      'Seed Default Categories'
                    )}
                  </Button>
                  {seedResults.categories && (
                    <Alert className="mt-4">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Seeding Results</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-1">
                          <p>Total Categories: {seedResults.categories.total}</p>
                          <p className="text-green-600">Created: {seedResults.categories.created}</p>
                          <p className="text-yellow-600">Skipped: {seedResults.categories.skipped}</p>
                          {seedResults.categories.errors > 0 && (
                            <p className="text-red-600">Errors: {seedResults.categories.errors}</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tag Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Seed the database with common language course tags. This will only add tags that don't already exist.
                  </p>
                  <Button
                    onClick={handleSeedTags}
                    disabled={isSeedingTags}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSeedingTags ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Seeding Tags...
                      </>
                    ) : (
                      'Seed Default Tags'
                    )}
                  </Button>
                  {seedResults.tags && (
                    <Alert className="mt-4">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Seeding Results</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-1">
                          <p>Total Tags: {seedResults.tags.total}</p>
                          <p className="text-green-600">Created: {seedResults.tags.created}</p>
                          <p className="text-yellow-600">Skipped: {seedResults.tags.skipped}</p>
                          {seedResults.tags.errors > 0 && (
                            <p className="text-red-600">Errors: {seedResults.tags.errors}</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  Email Settings
                </CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEmail ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="host">SMTP Host</Label>
                        <Input
                          id="host"
                          value={emailSettings.host}
                          onChange={(e) => setEmailSettings({ ...emailSettings, host: e.target.value })}
                          placeholder="smtp.example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="port">SMTP Port</Label>
                        <Input
                          id="port"
                          type="number"
                          value={emailSettings.port}
                          onChange={(e) => setEmailSettings({ ...emailSettings, port: parseInt(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">SMTP Username</Label>
                        <Input
                          id="username"
                          value={emailSettings.username}
                          onChange={(e) => setEmailSettings({ ...emailSettings, username: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">SMTP Password</Label>
                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={emailSettings.password}
                              onChange={(e) => {
                                setEmailSettings({ ...emailSettings, password: e.target.value });
                                if (e.target.value !== originalEmailSettings?.password) {
                                  setShowPasswordFields(true);
                                } else {
                                  setShowPasswordFields(false);
                                }
                              }}
                              placeholder={originalEmailSettings?.password ? '••••••••' : 'Enter password'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                            </button>
                          </div>
                          {showPasswordFields && (
                            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative">
                                  <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordChange.currentPassword}
                                    onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })}
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {showCurrentPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                  <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordChange.newPassword}
                                    onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {showNewPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                  <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordChange.confirmPassword}
                                    onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fromEmail">From Email</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fromName">From Name</Label>
                        <Input
                          id="fromName"
                          value={emailSettings.fromName}
                          onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700/50 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <Label htmlFor="secure" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                Use SSL/TLS
                              </Label>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              Enable secure connection for email transmission. This encrypts all email data in transit.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded-full font-medium ${
                                emailSettings.secure 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {emailSettings.secure ? 'SECURE' : 'INSECURE'}
                              </span>
                              <span className="text-xs">
                                {emailSettings.secure ? 'Recommended for production' : 'Use only for testing'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <EnhancedSwitch
                              id="secure"
                              checked={emailSettings.secure}
                              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, secure: checked })}
                              label="Secure Connection (SSL/TLS)"
                              description={emailSettings.secure 
                                ? "Email server connection is encrypted using SSL/TLS. This provides secure communication."
                                : "Email server connection is not encrypted. This may expose sensitive data."
                              }
                              activeColor="green"
                              inactiveColor="red"
                              activeText="SECURE"
                              inactiveText="INSECURE"
                              className="mb-6"
                            />
                            <div className="hidden sm:block">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700/50 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              <Label htmlFor="rejectUnauthorized" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                Strict TLS Verification
                              </Label>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              Verify SSL/TLS certificates for enhanced security. Disable only if you encounter certificate issues.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded-full font-medium ${
                                emailSettings.rejectUnauthorized 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {emailSettings.rejectUnauthorized ? 'STRICT' : 'LENIENT'}
                              </span>
                              <span className="text-xs">
                                {emailSettings.rejectUnauthorized ? 'Maximum security' : 'May allow insecure connections'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <EnhancedSwitch
                              id="rejectUnauthorized"
                              checked={emailSettings.rejectUnauthorized}
                              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, rejectUnauthorized: checked })}
                              label="Strict TLS Verification"
                              description={emailSettings.rejectUnauthorized 
                                ? "SSL/TLS certificates are strictly verified for maximum security."
                                : "SSL/TLS certificate verification is lenient. May allow insecure connections."
                              }
                              activeColor="amber"
                              inactiveColor="yellow"
                              activeText="STRICT"
                              inactiveText="LENIENT"
                              className="mb-6"
                            />
                            <div className="hidden sm:block">
                              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTestEmail}
                        disabled={savingEmail}
                      >
                        Test Email
                      </Button>
                      <Button
                        type="submit"
                        disabled={savingEmail}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {savingEmail ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          'Save Settings'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    General Settings
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="fileUploadMaxSizeMB">File Upload Size Limit (MB)</Label>
                  <Input
                    id="fileUploadMaxSizeMB"
                    type="number"
                    min={1}
                    max={100}
                    value={fileUploadMaxSizeMB}
                    onChange={e => setFileUploadMaxSizeMB(Number(e.target.value))}
                  />
                  <Button
                    type="button"
                    onClick={async () => {
                      await fetch('/api/admin/settings/general', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fileUploadMaxSizeMB }),
                      });
                      toast.success('File upload size limit updated');
                    }}
                  >
                    Save File Size Limit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  Maintenance
                </CardTitle>
                <CardDescription>
                  System maintenance and repair tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Fix missing student records and other system inconsistencies.
                  </p>
                  <Button
                    onClick={handleFixMissingStudents}
                    disabled={fixing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {fixing ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Fixing...
                      </>
                    ) : (
                      'Fix Missing Student Records'
                    )}
                  </Button>
                  {fixResult && (
                    <Alert className="mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Fix Completed</AlertTitle>
                      <AlertDescription>{fixResult}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-6">
            {/* Notification Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Notification Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notificationStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Total Sent</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{notificationStats.overview?.total || 0}</p>
                      <p className="text-xs text-blue-700">notifications sent</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Success Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">{notificationStats.overview?.successRate || 0}%</p>
                      <p className="text-xs text-green-700">successful deliveries</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Templates</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">{notificationStats.templates?.active || 0}</p>
                      <p className="text-xs text-purple-700">active templates</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Email Notifications</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-900">{notificationStats.byType?.email || 0}</p>
                      <p className="text-xs text-orange-700">emails sent</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Templates */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    Notification Templates
                  </CardTitle>
                  <div className="space-x-2">
                    <Button
                      onClick={handleSeedNotificationTemplates}
                      variant="outline"
                      size="sm"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Seed Defaults
                    </Button>
                    <Button
                      onClick={() => setShowTemplateForm(true)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Template
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notificationTemplates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No notification templates found.</p>
                        <p className="text-sm">Create your first template or seed default templates.</p>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            Found {notificationTemplates.length} template(s). 
                            {notificationTemplates.filter(t => t.isDefault).length} default template(s).
                          </p>
                        </div>
                        <div className="grid gap-4">
                          {notificationTemplates.map((template) => (
                            <div key={template.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold text-lg">{template.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      template.type === 'email' ? 'bg-blue-100 text-blue-800' :
                                      template.type === 'sms' ? 'bg-green-100 text-green-800' :
                                      template.type === 'push' ? 'bg-purple-100 text-purple-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {template.type.toUpperCase()}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                      {template.category}
                                    </span>
                                    {template.isDefault && (
                                      <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                        DEFAULT
                                      </span>
                                    )}
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {template.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() => {
                                        handleViewTemplate(template);
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      title="View Template Details"
                                    >
                                      <FaEye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        handleEditTemplate(template);
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      title="Edit Template"
                                    >
                                      <FaEdit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    {!template.isDefault && (
                                      <Button
                                        onClick={() => handleDeleteTemplate(template.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Delete Template"
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete
                                      </Button>
                                    )}
                                    {template.isDefault && (
                                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                                        Default Template
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {template.subject && (
                                  <p className="text-sm"><strong>Subject:</strong> {template.subject}</p>
                                )}
                                <p className="text-sm"><strong>Title:</strong> {template.title}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  <strong>Content:</strong> {template.content.replace(/<[^>]*>/g, '')}
                                </p>
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                Created by {template.createdByUser?.name || 'Unknown'} on {new Date(template.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Form Modal */}
            <Dialog open={!!(showTemplateForm || editingTemplate)} onOpenChange={(open) => !open && handleCancelTemplateEdit()}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTemplate ? 'Update the notification template settings and content.' : 'Create a new notification template for emails, SMS, push notifications, or system messages.'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                        placeholder="e.g., welcome_email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="template-type">Type</Label>
                      <Select
                        value={templateForm.type}
                        onValueChange={(value) => setTemplateForm({ ...templateForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="template-category">Category</Label>
                      <Select
                        value={templateForm.category}
                        onValueChange={(value) => setTemplateForm({ ...templateForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="commission">Commission</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      {/* Active Toggle */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700/50 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <Label htmlFor="template-active" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                Template Active
                              </Label>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              Enable this template for use in notifications. Inactive templates cannot be used.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded-full font-medium ${
                                templateForm.isActive 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {templateForm.isActive ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                              <span className="text-xs">
                                {templateForm.isActive ? 'Template can be used' : 'Template is disabled'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Switch
                              id="template-active"
                              checked={templateForm.isActive}
                              onCheckedChange={(checked) => setTemplateForm({ ...templateForm, isActive: checked })}
                              className="scale-110"
                            />
                            <div className="hidden sm:block">
                              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Default Toggle */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700/50 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <Label htmlFor="template-default" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                Default Template
                              </Label>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              Mark as default template for this category. Default templates are used as fallbacks.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded-full font-medium ${
                                templateForm.isDefault 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {templateForm.isDefault ? 'DEFAULT' : 'CUSTOM'}
                              </span>
                              <span className="text-xs">
                                {templateForm.isDefault ? 'Used as fallback' : 'Custom template'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Switch
                              id="template-default"
                              checked={templateForm.isDefault}
                              onCheckedChange={(checked) => setTemplateForm({ ...templateForm, isDefault: checked })}
                              className="scale-110"
                            />
                            <div className="hidden sm:block">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {templateForm.type === 'email' && (
                    <div>
                      <Label htmlFor="template-subject">Subject (Email only)</Label>
                      <Input
                        id="template-subject"
                        value={templateForm.subject}
                        onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                        placeholder="Email subject line"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="template-title">Title</Label>
                    <Input
                      id="template-title"
                      value={templateForm.title}
                      onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                      placeholder="Notification title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="template-content">Content</Label>
                    <Textarea
                      id="template-content"
                      value={templateForm.content}
                      onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                      placeholder="Notification content (HTML supported for email)"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use {'{{variable}}'} syntax for dynamic content. Available variables: name, email, amount, date, etc.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={handleCancelTemplateEdit}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => editingTemplate ? handleUpdateTemplate(editingTemplate.id) : handleCreateTemplate()}
                    >
                      {editingTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Template View Modal */}
            <Dialog open={!!viewingTemplate} onOpenChange={(open) => !open && setViewingTemplate(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-green-800">
                    <FaEye className="h-5 w-5 text-green-600" />
                    View Template: {viewingTemplate?.name}
                  </DialogTitle>
                  <DialogDescription>
                    View the complete details of this notification template.
                  </DialogDescription>
                </DialogHeader>
                
                {viewingTemplate && (
                  <div className="space-y-6">
                    {/* Template Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Template Name</Label>
                        <p className="mt-1 text-lg font-semibold">{viewingTemplate.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Type</Label>
                        <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          viewingTemplate.type === 'email' ? 'bg-blue-100 text-blue-800' :
                          viewingTemplate.type === 'sms' ? 'bg-green-100 text-green-800' :
                          viewingTemplate.type === 'push' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {viewingTemplate.type.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Category</Label>
                        <span className="mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {viewingTemplate.category}
                        </span>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Status</Label>
                        <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          viewingTemplate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {viewingTemplate.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </div>

                    {/* Subject (for email templates) */}
                    {viewingTemplate.subject && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Subject</Label>
                        <p className="mt-1 text-lg">{viewingTemplate.subject}</p>
                      </div>
                    )}

                    {/* Title */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Title</Label>
                      <p className="mt-1 text-lg">{viewingTemplate.title}</p>
                    </div>

                    {/* Content */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Content</Label>
                      <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                        <pre className="whitespace-pre-wrap text-sm font-mono">{viewingTemplate.content}</pre>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Created By</Label>
                        <p className="mt-1 text-sm">{viewingTemplate.createdByUser?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Created Date</Label>
                        <p className="mt-1 text-sm">{new Date(viewingTemplate.createdAt).toLocaleDateString()}</p>
                      </div>
                      {viewingTemplate.updatedByUser && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Last Updated By</Label>
                          <p className="mt-1 text-sm">{viewingTemplate.updatedByUser.name}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                        <p className="mt-1 text-sm">{new Date(viewingTemplate.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button
                        onClick={() => {
                          setViewingTemplate(null);
                          handleEditTemplate(viewingTemplate);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <FaEdit className="h-4 w-4 mr-2" />
                        Edit Template
                      </Button>
                      <Button
                        onClick={() => setViewingTemplate(null)}
                        variant="outline"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Notification Logs */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-600" />
                    Notification Logs
                  </CardTitle>
                  <Button
                    onClick={fetchNotificationLogs}
                    variant="outline"
                    size="sm"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="filter-status">Status</Label>
                      <Select
                        value={logsFilters.status}
                        onValueChange={(value) => setLogsFilters({ ...logsFilters, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="filter-type">Type</Label>
                      <Select
                        value={logsFilters.type}
                        onValueChange={(value) => setLogsFilters({ ...logsFilters, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All types</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="filter-email">Recipient Email</Label>
                      <Input
                        id="filter-email"
                        value={logsFilters.recipientEmail}
                        onChange={(e) => setLogsFilters({ ...logsFilters, recipientEmail: e.target.value })}
                        placeholder="Filter by email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="filter-start-date">Start Date</Label>
                      <Input
                        id="filter-start-date"
                        type="date"
                        value={logsFilters.startDate}
                        onChange={(e) => setLogsFilters({ ...logsFilters, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="filter-end-date">End Date</Label>
                      <Input
                        id="filter-end-date"
                        type="date"
                        value={logsFilters.endDate}
                        onChange={(e) => setLogsFilters({ ...logsFilters, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button
                      onClick={() => {
                        setLogsFilters({
                          status: 'all',
                          type: 'all',
                          recipientEmail: '',
                          startDate: '',
                          endDate: ''
                        });
                        setLogsPage(1);
                        fetchNotificationLogs();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>

                {/* Logs Table */}
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notificationLogs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No notification logs found.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {notificationLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                                  <div className="text-gray-500">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="font-medium">{log.recipientName}</div>
                                  <div className="text-gray-500">{log.recipientEmail}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  log.type === 'email' ? 'bg-blue-100 text-blue-800' :
                                  log.type === 'sms' ? 'bg-green-100 text-green-800' :
                                  log.type === 'push' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {log.type.toUpperCase()}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  log.status === 'sent' ? 'bg-green-100 text-green-800' :
                                  log.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {log.status.toUpperCase()}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {log.template ? (
                                    <span className="text-gray-900">{log.template.name}</span>
                                  ) : (
                                    <span className="text-gray-500">Custom</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Show log details in a modal or expand row
                                    console.log('Log details:', log);
                                  }}
                                >
                                  <FaEye className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cleanup">
          <div className="space-y-6">
            {/* Database Cleanup Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Database Cleanup
                </CardTitle>
                <CardDescription>
                  Clean up orphaned records and maintain database integrity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Safe Operation</AlertTitle>
                  <AlertDescription>
                    This operation removes orphaned records that have no valid foreign key relationships.
                    It's safe to run and will improve database performance.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="outline"
                  onClick={handleOrphanedRecordsCleanup}
                  disabled={isCleaning}
                  className="w-full"
                >
                  {isCleaning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cleaning up...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Clean Up Orphaned Records
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Sample Data Cleanup Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-orange-600" />
                  Sample Data Cleanup
                </CardTitle>
                <CardDescription>
                  Remove sample/demo data from the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This action will permanently delete all sample data including courses, tags, and departments.
                    This action cannot be undone.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="destructive"
                  onClick={handleSampleDataCleanup}
                  disabled={isCleaning}
                  className="w-full"
                >
                  {isCleaning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cleaning up...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Sample Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Enrollment Records Cleanup Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  Enrollment Records Cleanup
                </CardTitle>
                <CardDescription>
                  Remove all enrollment and dependent records from the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Dangerous Operation</AlertTitle>
                  <AlertDescription>
                    This action will permanently delete all enrollment records and their dependent data.
                    This includes student progress, payments, and commission logs. This action cannot be undone.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="destructive"
                  onClick={handleCleanup}
                  disabled={isCleaning}
                  className="w-full"
                >
                  {isCleaning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cleaning up...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete All Enrollment Records
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Cleanup Results */}
            {cleanupResults && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    Cleanup Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Cleanup completed successfully!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      The cleanup operation has been completed successfully.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="error-scanning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Error Scanning & Fixing Tools
              </CardTitle>
              <CardDescription>
                Automated tools to scan and fix common errors in the codebase. Use these tools to maintain code quality and resolve issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingScripts ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="animate-spin h-6 w-6 text-indigo-600" />
                  <span className="ml-2">Loading scripts...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Scanning Tools */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      Scanning Tools
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {errorScripts
                        .filter(script => script.category === 'scanning')
                        .map((script) => (
                          <Card key={script.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-800">{script.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                                </div>
                                <Button
                                  onClick={() => runErrorScript(script.id)}
                                  disabled={runningScript === script.id}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {runningScript === script.id ? (
                                    <FaSpinner className="animate-spin h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                  <span className="ml-2">
                                    {runningScript === script.id ? 'Running...' : 'Run Scan'}
                                  </span>
                                </Button>
                              </div>
                              
                              {scriptResults[script.id] && (
                                <div className={`mt-3 p-3 rounded-lg text-sm ${
                                  scriptResults[script.id].success 
                                    ? 'bg-green-50 border border-green-200 text-green-800' 
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                  <div className="font-medium mb-1">
                                    {scriptResults[script.id].success ? 'Success' : 'Error'}
                                  </div>
                                  <div className="text-xs">
                                    {scriptResults[script.id].message || scriptResults[script.id].error}
                                  </div>
                                  {scriptResults[script.id].output && (
                                    <details className="mt-2">
                                      <summary className="cursor-pointer text-xs font-medium">View Output</summary>
                                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                        {scriptResults[script.id].output}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Fixing Tools */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-green-600" />
                      Fixing Tools
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {errorScripts
                        .filter(script => script.category === 'fixing')
                        .map((script) => (
                          <Card key={script.id} className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-800">{script.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                                </div>
                                <Button
                                  onClick={() => runErrorScript(script.id)}
                                  disabled={runningScript === script.id}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {runningScript === script.id ? (
                                    <FaSpinner className="animate-spin h-4 w-4" />
                                  ) : (
                                    <Wrench className="h-4 w-4" />
                                  )}
                                  <span className="ml-2">
                                    {runningScript === script.id ? 'Running...' : 'Run Fix'}
                                  </span>
                                </Button>
                              </div>
                              
                              {scriptResults[script.id] && (
                                <div className={`mt-3 p-3 rounded-lg text-sm ${
                                  scriptResults[script.id].success 
                                    ? 'bg-green-50 border border-green-200 text-green-800' 
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                  <div className="font-medium mb-1">
                                    {scriptResults[script.id].success ? 'Success' : 'Error'}
                                  </div>
                                  <div className="text-xs">
                                    {scriptResults[script.id].message || scriptResults[script.id].error}
                                  </div>
                                  {scriptResults[script.id].output && (
                                    <details className="mt-2">
                                      <summary className="cursor-pointer text-xs font-medium">View Output</summary>
                                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                        {scriptResults[script.id].output}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>How to Use</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-2">
                        <p><strong>1. Scan First:</strong> Always run the Error Scanner first to identify issues.</p>
                        <p><strong>2. Review Results:</strong> Check the scan output to understand what needs fixing.</p>
                        <p><strong>3. Apply Fixes:</strong> Run the appropriate fixing tools based on the scan results.</p>
                        <p><strong>4. Verify:</strong> Run the scan again to confirm issues are resolved.</p>
                        <p className="text-sm text-gray-600 mt-3">
                          <strong>Note:</strong> These tools modify your codebase. Always review changes and test thoroughly.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 