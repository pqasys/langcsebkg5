'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2, Mail, Globe, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { citiesByCountryAndState } from '@/lib/data/cities';
import { statesByCountry } from '@/lib/data/states';
import { toast } from 'sonner';
import Link from 'next/link';

// List of countries from states data
const COUNTRIES = Object.keys(statesByCountry).sort();

interface FormData {
  name: string;
  email: string;
  institutionEmail: string;
  website: string;
  description: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postcode: string;
  telephone: string;
  contactName: string;
  contactJobTitle: string;
  contactPhone: string;
  contactEmail: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function InstitutionRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    institutionEmail: '',
    website: '',
    description: '',
    country: 'United States',
    state: '',
    city: '',
    address: '',
    postcode: '',
    telephone: '',
    contactName: '',
    contactJobTitle: '',
    contactPhone: '',
    contactEmail: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset dependent fields when country/state changes
    if (name === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    } else if (name === 'state') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Institution name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State/Province is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.telephone.trim()) newErrors.telephone = 'Telephone is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactJobTitle.trim()) newErrors.contactJobTitle = 'Contact job title is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.institutionEmail && !emailRegex.test(formData.institutionEmail)) {
      newErrors.institutionEmail = 'Please enter a valid email address';
    }
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Website validation
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://';
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

    setIsLoading(true);

    try {
      const response = await fetch('/api/institution-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to register institution');
      }

      setIsSuccess(true);
      toast.success('Institution registered successfully! Check your email for login credentials. Your account is pending admin approval.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        institutionEmail: '',
        website: '',
        description: '',
        country: '',
        state: '',
        city: '',
        address: '',
        postcode: '',
        telephone: '',
        contactName: '',
        contactJobTitle: '',
        contactPhone: '',
        contactEmail: '',
      });

    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to registering institution. Please try again or contact support if the problem persists.`);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register institution';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>
              Your institution has been registered successfully. Check your email for login credentials. Your account is pending admin approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Important:</strong> You will receive an email with your temporary login credentials. 
                You must change your password on your first login for security reasons.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push('/auth/signin')} className="w-full">
                Go to Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsSuccess(false)}
                className="w-full"
              >
                Register Another Institution
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <Building2 className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Your Institution
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our platform to offer language learning courses to students worldwide. 
            Complete the form below to get started.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Institution Information</CardTitle>
            <CardDescription>
              Please provide accurate information about your institution. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Institution Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your institution name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="admin@institution.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institutionEmail">Institution Email (Public)</Label>
                    <Input
                      id="institutionEmail"
                      name="institutionEmail"
                      type="email"
                      value={formData.institutionEmail}
                      onChange={handleInputChange}
                      placeholder="contact@institution.com"
                      className={errors.institutionEmail ? 'border-red-500' : ''}
                    />
                    {errors.institutionEmail && <p className="text-sm text-red-500">{errors.institutionEmail}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.institution.com"
                      className={errors.website ? 'border-red-500' : ''}
                    />
                    {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone">Telephone *</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      className={errors.telephone ? 'border-red-500' : ''}
                    />
                    {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your institution, courses, and what makes you unique..."
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                      <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => handleSelectChange('state', value)}
                      disabled={!formData.country}
                    >
                      <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.country && statesByCountry[formData.country]?.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => handleSelectChange('city', value)}
                      disabled={!formData.state}
                    >
                      <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.country && formData.state && 
                          citiesByCountryAndState[formData.country]?.[formData.state]?.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postal Code</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      placeholder="Postal/ZIP code"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Person Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className={errors.contactName ? 'border-red-500' : ''}
                    />
                    {errors.contactName && <p className="text-sm text-red-500">{errors.contactName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactJobTitle">Job Title *</Label>
                    <Input
                      id="contactJobTitle"
                      name="contactJobTitle"
                      value={formData.contactJobTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., Director, Manager"
                      className={errors.contactJobTitle ? 'border-red-500' : ''}
                    />
                    {errors.contactJobTitle && <p className="text-sm text-red-500">{errors.contactJobTitle}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      className={errors.contactPhone ? 'border-red-500' : ''}
                    />
                    {errors.contactPhone && <p className="text-sm text-red-500">{errors.contactPhone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="contact@institution.com"
                      className={errors.contactEmail ? 'border-red-500' : ''}
                    />
                    {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail}</p>}
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> After registration, you will receive an email with temporary login credentials. 
                  You must change your password on your first login for security reasons.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering Institution...
                    </>
                  ) : (
                    'Register Institution'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/auth/signin')}
                  className="flex-1"
                >
                  Already Registered? Sign In
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 