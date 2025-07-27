'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Shield, BookOpen, FileText, Target, Users, CreditCard, BarChart, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { EnhancedSwitch } from '@/components/ui/enhanced-switch';

interface InstitutionPermissions {
  id: string;
  institutionId: string;
  canCreateCourses: boolean;
  canEditCourses: boolean;
  canDeleteCourses: boolean;
  canPublishCourses: boolean;
  canCreateContent: boolean;
  canEditContent: boolean;
  canDeleteContent: boolean;
  canUploadMedia: boolean;
  canCreateQuizzes: boolean;
  canEditQuizzes: boolean;
  canDeleteQuizzes: boolean;
  canViewQuizResults: boolean;
  canViewStudents: boolean;
  canManageStudents: boolean;
  canViewEnrollments: boolean;
  canViewPayments: boolean;
  canViewPayouts: boolean;
  canManagePricing: boolean;
  canViewAnalytics: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canEditProfile: boolean;
  canManageUsers: boolean;
  canViewSettings: boolean;
}

interface Institution {
  id: string;
  name: string;
  email: string;
}

export default function InstitutionPermissionsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [permissions, setPermissions] = useState<InstitutionPermissions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch institution details
      const institutionResponse = await fetch(`/api/admin/institutions/${params.id}`);
      if (!institutionResponse.ok) {
        throw new Error('Failed to fetch institution');
      }
      const institutionData = await institutionResponse.json();
      setInstitution(institutionData);

      // Fetch permissions
      const permissionsResponse = await fetch(`/api/admin/institutions/${params.id}/permissions`);
      if (!permissionsResponse.ok) {
        throw new Error('Failed to fetch permissions');
      }
      const permissionsData = await permissionsResponse.json();
      setPermissions(permissionsData);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load data:. Please try again or contact support if the problem persists.`);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission: keyof InstitutionPermissions, value: boolean) => {
    if (!permissions) return;
    setPermissions(prev => prev ? { ...prev, [permission]: value } : null);
  };

  const handleSave = async () => {
    if (!permissions) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/institutions/${params.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissions),
      });

      if (!response.ok) {
        throw new Error('Failed to update permissions');
      }

      toast.success('Permissions updated successfully');
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating permissions:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = (category: string, value: boolean) => {
    if (!permissions) return;

    const categoryPermissions: Record<string, Array<keyof InstitutionPermissions>> = {
      courses: ['canCreateCourses', 'canEditCourses', 'canDeleteCourses', 'canPublishCourses'],
      content: ['canCreateContent', 'canEditContent', 'canDeleteContent', 'canUploadMedia'],
      quizzes: ['canCreateQuizzes', 'canEditQuizzes', 'canDeleteQuizzes', 'canViewQuizResults'],
      students: ['canViewStudents', 'canManageStudents', 'canViewEnrollments'],
      financial: ['canViewPayments', 'canViewPayouts', 'canManagePricing'],
      analytics: ['canViewAnalytics', 'canViewReports', 'canExportData'],
      settings: ['canEditProfile', 'canManageUsers', 'canViewSettings']
    };

    const permissionsToUpdate = categoryPermissions[category] || [];
    const updatedPermissions = { ...permissions };
    
    permissionsToUpdate.forEach(permission => {
      updatedPermissions[permission] = value;
    });

    setPermissions(updatedPermissions);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4 font-medium">{error}</p>
        <Button onClick={fetchData} className="bg-red-600 hover:bg-red-700">Retry</Button>
      </div>
    );
  }

  if (!institution || !permissions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Institution not found</p>
        <Button onClick={() => router.back()} className="bg-gray-600 hover:bg-gray-700">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {institution.name} - Permissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Control what institution admins can access and manage
          </p>
        </div>
      </div>

      <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Access Control
            </CardTitle>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-blue-600 hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400"
            >
              {saving ? (
                <FaSpinner className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {/* Course Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Course Management</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('courses', true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('courses', false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <EnhancedSwitch
                id="canCreateCourses"
                checked={permissions.canCreateCourses}
                onCheckedChange={(checked) => handlePermissionChange('canCreateCourses', checked)}
                label="Create Courses"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canEditCourses"
                checked={permissions.canEditCourses}
                onCheckedChange={(checked) => handlePermissionChange('canEditCourses', checked)}
                label="Edit Courses"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canDeleteCourses"
                checked={permissions.canDeleteCourses}
                onCheckedChange={(checked) => handlePermissionChange('canDeleteCourses', checked)}
                label="Delete Courses"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canPublishCourses"
                checked={permissions.canPublishCourses}
                onCheckedChange={(checked) => handlePermissionChange('canPublishCourses', checked)}
                label="Publish Courses"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
            </div>
          </div>

          <Separator className="bg-gray-300 dark:bg-gray-600" />

          {/* Content Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Content Management</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('content', true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('content', false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <EnhancedSwitch
                id="canCreateContent"
                checked={permissions.canCreateContent}
                onCheckedChange={(checked) => handlePermissionChange('canCreateContent', checked)}
                label="Create Content"
                activeColor="blue"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canEditContent"
                checked={permissions.canEditContent}
                onCheckedChange={(checked) => handlePermissionChange('canEditContent', checked)}
                label="Edit Content"
                activeColor="blue"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canDeleteContent"
                checked={permissions.canDeleteContent}
                onCheckedChange={(checked) => handlePermissionChange('canDeleteContent', checked)}
                label="Delete Content"
                activeColor="blue"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canUploadMedia"
                checked={permissions.canUploadMedia}
                onCheckedChange={(checked) => handlePermissionChange('canUploadMedia', checked)}
                label="Upload Media"
                activeColor="blue"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
            </div>
          </div>

          <Separator className="bg-gray-300 dark:bg-gray-600" />

          {/* Quiz Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Quiz Management</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('quizzes', true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('quizzes', false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <EnhancedSwitch
                id="canCreateQuizzes"
                checked={permissions.canCreateQuizzes}
                onCheckedChange={(checked) => handlePermissionChange('canCreateQuizzes', checked)}
                label="Create Quizzes"
                activeColor="purple"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canEditQuizzes"
                checked={permissions.canEditQuizzes}
                onCheckedChange={(checked) => handlePermissionChange('canEditQuizzes', checked)}
                label="Edit Quizzes"
                activeColor="purple"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canDeleteQuizzes"
                checked={permissions.canDeleteQuizzes}
                onCheckedChange={(checked) => handlePermissionChange('canDeleteQuizzes', checked)}
                label="Delete Quizzes"
                activeColor="purple"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canViewQuizResults"
                checked={permissions.canViewQuizResults}
                onCheckedChange={(checked) => handlePermissionChange('canViewQuizResults', checked)}
                label="View Quiz Results"
                activeColor="purple"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
            </div>
          </div>

          <Separator className="bg-gray-300 dark:bg-gray-600" />

          {/* Student Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Student Management</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('students', true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('students', false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <EnhancedSwitch
                id="canViewStudents"
                checked={permissions.canViewStudents}
                onCheckedChange={(checked) => handlePermissionChange('canViewStudents', checked)}
                label="View Students"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canManageStudents"
                checked={permissions.canManageStudents}
                onCheckedChange={(checked) => handlePermissionChange('canManageStudents', checked)}
                label="Manage Students"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canViewEnrollments"
                checked={permissions.canViewEnrollments}
                onCheckedChange={(checked) => handlePermissionChange('canViewEnrollments', checked)}
                label="View Enrollments"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
            </div>
          </div>

          <Separator className="bg-gray-300 dark:bg-gray-600" />

          {/* Financial Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Financial Management</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('financial', true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('financial', false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <EnhancedSwitch
                id="canViewPayments"
                checked={permissions.canViewPayments}
                onCheckedChange={(checked) => handlePermissionChange('canViewPayments', checked)}
                label="View Payments"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canViewPayouts"
                checked={permissions.canViewPayouts}
                onCheckedChange={(checked) => handlePermissionChange('canViewPayouts', checked)}
                label="View Payouts"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canManagePricing"
                checked={permissions.canManagePricing}
                onCheckedChange={(checked) => handlePermissionChange('canManagePricing', checked)}
                label="Manage Pricing"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
            </div>
          </div>

          <Separator className="bg-gray-300 dark:bg-gray-600" />

          {/* Analytics and Reporting */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <BarChart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Analytics & Reporting</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('analytics', true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('analytics', false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <EnhancedSwitch
                id="canViewAnalytics"
                checked={permissions.canViewAnalytics}
                onCheckedChange={(checked) => handlePermissionChange('canViewAnalytics', checked)}
                label="View Analytics"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canViewReports"
                checked={permissions.canViewReports}
                onCheckedChange={(checked) => handlePermissionChange('canViewReports', checked)}
                label="View Reports"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canExportData"
                checked={permissions.canExportData}
                onCheckedChange={(checked) => handlePermissionChange('canExportData', checked)}
                label="Export Data"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
            </div>
          </div>

          <Separator className="bg-gray-300 dark:bg-gray-600" />

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Settings</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('settings', true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('settings', false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <EnhancedSwitch
                id="canEditProfile"
                checked={permissions.canEditProfile}
                onCheckedChange={(checked) => handlePermissionChange('canEditProfile', checked)}
                label="Edit Profile"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canManageUsers"
                checked={permissions.canManageUsers}
                onCheckedChange={(checked) => handlePermissionChange('canManageUsers', checked)}
                label="Manage Users"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
              <EnhancedSwitch
                id="canViewSettings"
                checked={permissions.canViewSettings}
                onCheckedChange={(checked) => handlePermissionChange('canViewSettings', checked)}
                label="View Settings"
                activeColor="green"
                inactiveColor="gray"
                activeText="ALLOWED"
                inactiveText="DENIED"
                variant="compact"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 