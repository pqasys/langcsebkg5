'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Building2, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  institutionName: string;
  adminEmail: string;
  adminName: string;
}

interface FormErrors {
  institutionName?: string;
  adminEmail?: string;
  adminName?: string;
}

export default function CreateInstitutionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    institutionName: '',
    adminEmail: '',
    adminName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Admin email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.adminEmail)) {
        newErrors.adminEmail = 'Please enter a valid email address';
      }
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Admin name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/institutions/create-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create institution');
      }

      toast.success('Institution created successfully! Check email for login credentials.');
      
      // Reset form
      setFormData({
        institutionName: '',
        adminEmail: '',
        adminName: '',
      });

      // Redirect to institutions list
      router.push('/admin/institutions');

    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to creating institution:. Please try again or contact support if the problem persists.`);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create institution';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/institutions"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Institutions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Institution</h1>
          <p className="text-gray-600 mt-2">
            Create a new institution user. The system will automatically create the institution with default values.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Quick Institution Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Institution Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Institution Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    placeholder="Enter institution name"
                    className={errors.institutionName ? 'border-red-500' : ''}
                  />
                  {errors.institutionName && <p className="text-sm text-red-500">{errors.institutionName}</p>}
                </div>
              </div>

              {/* Admin User Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Admin User Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name *</Label>
                  <Input
                    id="adminName"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    placeholder="Enter admin full name"
                    className={errors.adminName ? 'border-red-500' : ''}
                  />
                  {errors.adminName && <p className="text-sm text-red-500">{errors.adminName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    placeholder="admin@institution.com"
                    className={errors.adminEmail ? 'border-red-500' : ''}
                  />
                  {errors.adminEmail && <p className="text-sm text-red-500">{errors.adminEmail}</p>}
                </div>
              </div>

              {/* Information Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Automatic Setup</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      The system will automatically create the institution with default values and send login credentials to the admin email. 
                      The admin will be required to change their password on first login.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Institution...
                    </>
                  ) : (
                    'Create Institution'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/institutions')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 