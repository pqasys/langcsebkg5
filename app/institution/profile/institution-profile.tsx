'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { citiesByCountryAndState } from '@/lib/data/cities';
import { statesByCountry, NO_STATE } from '@/lib/data/states';
import { Upload, X, ImageIcon, BarChart3, Eye, Phone, Mail, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { LeadTracking } from '@/components/LeadTracking';

// List of countries from states data
const COUNTRIES = Object.keys(statesByCountry).sort();

export function InstitutionProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedState, setSelectedState] = useState('Alabama');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    email: '',
    website: '',
    institutionEmail: '',
    telephone: '',
    contactName: '',
    contactJobTitle: '',
    contactPhone: '',
    contactEmail: '',
    logoUrl: '',
    mainImageUrl: '',
  });

  // Add real-time validation feedback
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'INSTITUTION') {
      router.push('/');
    }
  }, [status, session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchInstitution();
    }
  }, [status]);

  const fetchInstitution = async () => {
    try {
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('=== Fetching Institution Debug ===');
      console.log('1. Starting institution fetch');
      const response = await fetch('/api/institution/profile');
      console.log('2. Fetch response status:', response.status);
      
      if (!response.ok) {
        toast.error('3. Fetch failed:');
        throw new Error(`Failed to fetch institution - Context: throw new Error('Failed to fetch institution');...`);
      }
      
      const data = await response.json();
      console.log('4. Fetched institution data:', JSON.stringify(data, null, 2));
      
      const institutionData = data.institution;
      setInstitution(institutionData);
      
      console.log('=== Institution Data Debug ===');
      console.log('1. Raw institution data:', institutionData);
      console.log('2. Facilities field:', institutionData.facilities);
      console.log('3. Facilities type:', typeof institutionData.facilities);
      
      // Parse facilities if it's a JSON string
      let parsedFacilities = [];
      if (institutionData.facilities) {
        try {
          if (typeof institutionData.facilities === 'string') {
            parsedFacilities = JSON.parse(institutionData.facilities);
            console.log('4. Parsed facilities from string:', parsedFacilities);
          } else if (Array.isArray(institutionData.facilities)) {
            parsedFacilities = institutionData.facilities;
            console.log('4. Facilities is already an array:', parsedFacilities);
          }
        } catch (error) {
          console.error('5. Error parsing facilities:', error);
          parsedFacilities = [];
        }
      }
      
      console.log('6. Final parsed facilities:', parsedFacilities);
      console.log('7. Facilities count:', parsedFacilities.length);
      
      setFormData({
        name: institutionData.name || '',
        description: institutionData.description || '',
        address: institutionData.address || '',
        city: institutionData.city || '',
        state: institutionData.state || '',
        country: institutionData.country || '',
        postcode: institutionData.postcode || '',
        email: institutionData.email || '',
        website: institutionData.website || '',
        institutionEmail: institutionData.institutionEmail || '',
        telephone: institutionData.telephone || '',
        contactName: institutionData.contactName || '',
        contactJobTitle: institutionData.contactJobTitle || '',
        contactPhone: institutionData.contactPhone || '',
        contactEmail: institutionData.contactEmail || '',
        logoUrl: institutionData.logoUrl || '',
        mainImageUrl: institutionData.mainImageUrl || '',
      });
      setSelectedCountry(institutionData.country || '');
      setSelectedState(institutionData.state || '');
      setLogoPreview(institutionData.logoUrl || null);
      setMainImagePreview(institutionData.mainImageUrl || null);
      
      // Set the parsed facilities
      setInstitution(prev => ({
        ...prev,
        facilities: parsedFacilities
      }));
      
      console.log('5. Institution data set successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('6. Error fetching institution:');
      toast.error('7. Error details:');
      toast.error('Failed to fetch institution details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!session?.user?.institutionId) return;
    
    try {
      const response = await fetch(`/api/analytics/leads?institutionId=${session.user.institutionId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load analytics. Please try again or contact support if the problem persists.`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Input changed:', { name, value });
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      console.log('Clearing validation error for:', name);
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedState('Alabama');
    setFormData(prev => ({
      ...prev,
      country: value,
      state: 'Alabama',
      city: ''
    }));
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setFormData(prev => ({
      ...prev,
      state: value,
      city: ''
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/institution/profile/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload logo - Context: body: formData,...`);
      }

      toast.success('Logo uploaded successfully');
      fetchInstitution();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to uploading logo. Please try again or contact support if the problem persists.`);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!formData.logoUrl) return;
    
    if (!confirm('Are you sure you want to delete the logo?')) return;

    try {
      const response = await fetch('/api/institution/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: formData.logoUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete logo - Context: body: JSON.stringify({ imageUrl: formData.logoUrl ...`);
      }

      toast.success('Logo deleted successfully');
      fetchInstitution();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting logo. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete logo');
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'mainImage');
      formData.append('preview', 'false');
      formData.append('institutionId', institution?.id || '');

      const response = await fetch('/api/institution/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload main image - Context: const response = await fetch('/api/institution/upl...`);
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        mainImageUrl: data.url
      }));
      setMainImagePreview(data.url);
      toast.success('Main image uploaded successfully');
      fetchInstitution();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to uploading main image. Please try again or contact support if the problem persists.`);
      toast.error('Failed to upload main image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMainImage = async () => {
    if (!formData.mainImageUrl) return;
    
    if (!confirm('Are you sure you want to delete the main image?')) return;

    try {
      const response = await fetch('/api/institution/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: formData.mainImageUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete main image - Context: const response = await fetch('/api/institution/upl...`);
      }

      setFormData(prev => ({ ...prev, mainImageUrl: '' }));
      setMainImagePreview(null);
      toast.success('Main image deleted successfully');
      fetchInstitution();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting main image. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete main image');
    }
  };

  const validateForm = () => {
    console.log('Starting form validation');
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name?.trim()) {
      errors.name = 'Institution name is required';
    }
    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.state) {
      errors.state = 'State/Province is required';
    }
    if (!formData.city?.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.postcode?.trim()) {
      errors.postcode = 'Postal code is required';
    }
    if (!formData.institutionEmail?.trim()) {
      errors.institutionEmail = 'Institution email is required';
    }
    if (!formData.telephone?.trim()) {
      errors.telephone = 'Telephone number is required';
    }
    if (!formData.contactName?.trim()) {
      errors.contactName = 'Contact name is required';
    }
    if (!formData.contactEmail?.trim()) {
      errors.contactEmail = 'Contact email is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.institutionEmail && !emailRegex.test(formData.institutionEmail)) {
      errors.institutionEmail = 'Invalid institution email format';
    }
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      errors.contactEmail = 'Invalid contact email format';
    }

    // Website validation (if provided)
    if (formData.website && !formData.website.startsWith('http://') && !formData.website.startsWith('https://')) {
      errors.website = 'Website URL must start with http:// or https://';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      errors.telephone = 'Invalid telephone number format';
    }
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      errors.contactPhone = 'Invalid contact phone format';
    }

    console.log('Validation errors found:', errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/institution/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile - Context: e.preventDefault();...`);
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating profile. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = async (files: FileList | null) => {
    if (!files?.length) return;

    console.log('=== Facility Upload Debug ===');
    console.log('1. Starting facility upload');
    console.log('2. Number of files:', files.length);
    
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        console.log(`3. Adding file ${index + 1}:`, file.name, file.type, file.size);
        formData.append('facilities', file);
      });

      console.log('4. Sending request to /api/institution/profile/facilities');
      const response = await fetch('/api/institution/profile/facilities', {
        method: 'POST',
        body: formData,
      });

      console.log('5. Response status:', response.status);
      console.log('6. Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('7. Error response:', errorText);
        throw new Error(`Failed to upload facilities - Context: const response = await fetch('/api/institution/pro...`);
      }

      const responseData = await response.json();
      console.log('8. Success response:', responseData);

      toast.success('Facilities uploaded successfully');
      console.log('9. Refreshing institution data');
      fetchInstitution();
    } catch (error) {
      console.error('10. Error in handleFacilityChange:', error);
      toast.error(`Failed to uploading facilities. Please try again or contact support if the problem persists.`);
      toast.error('Failed to upload facilities');
    } finally {
      setUploading(false);
      console.log('11. Upload process completed');
    }
  };

  const handleDeleteFacility = async (imageUrl: string) => {
    try {
      const response = await fetch(`/api/institution/profile/facilities?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete facility - Context: toast.error('Failed to upload facilities');...`);
      }

      toast.success('Facility deleted successfully');
      fetchInstitution();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting facility. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete facility');
    }
  };

  // Update the input fields to show validation errors
  const renderInput = (name: string, label: string, type: string = 'text', required: boolean = false) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={formData[name as keyof typeof formData]}
        onChange={handleInputChange}
        required={required}
        className={validationErrors[name] ? 'border-red-500' : ''}
      />
      {validationErrors[name] && (
        <p className="text-sm text-red-500">{validationErrors[name]}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Institution Profile</h1>
      </div>
      
      <form id="institution-profile-form" onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Institution Logo"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label>Upload Logo</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={uploading}
                  />
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={handleDeleteLogo}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Logo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Main Image (Hero)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative w-48 h-16 rounded-lg overflow-hidden bg-gray-100">
                {mainImagePreview ? (
                  <Image
                    src={mainImagePreview}
                    alt="Main Image Preview"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : formData.mainImageUrl ? (
                  <Image
                    src={formData.mainImageUrl}
                    alt="Institution Main Image"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label>Upload Main Image</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended size: 1200x384 pixels (3:1 ratio)
                  </p>
                  {formData.mainImageUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={handleDeleteMainImage}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Main Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderInput('name', 'Institution Name', 'text', true)}
              {renderInput('email', 'Institution Admin Email', 'email', true)}
              {renderInput('institutionEmail', 'Institution Email', 'email', true)}
              {renderInput('website', 'Website', 'url')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderInput('telephone', 'Institution Phone', 'tel', true)}
              {renderInput('contactName', 'Contact Person Name', 'text', true)}
              {renderInput('contactJobTitle', 'Contact Person Job Title')}
              {renderInput('contactPhone', 'Contact Person Phone', 'tel')}
              {renderInput('contactEmail', 'Contact Person Email', 'email', true)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={handleCountryChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Select
                  value={selectedState}
                  onValueChange={handleStateChange}
                  disabled={!selectedCountry}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCountry && statesByCountry[selectedCountry]?.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                  disabled={!selectedState}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedState && citiesByCountryAndState[selectedCountry]?.[selectedState]?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postal Code</Label>
                <Input
                  id="postcode"
                  name="postcode"
                  type="text"
                  value={formData.postcode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">About the Institution</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facility Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.isArray(institution?.facilities) && institution.facilities.map((imageUrl: string, index: number) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={`Facility ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFacility(imageUrl)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFacilityChange(e.target.files)}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {uploading && (
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <FaSpinner className="animate-spin mr-2" />
                Uploading images...
              </div>
            )}

            {Array.isArray(institution?.facilities) && institution.facilities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No facility images uploaded yet. Click the upload button to add images.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Profile Analytics
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAnalytics(!showAnalytics);
                  if (!showAnalytics && !analytics) {
                    fetchAnalytics();
                  }
                }}
              >
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </Button>
            </div>
          </CardHeader>
          {showAnalytics && (
            <CardContent>
              {analytics ? (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analytics.totalViews}</div>
                      <div className="text-sm text-gray-600">Profile Views</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analytics.totalContacts}</div>
                      <div className="text-sm text-gray-600">Contacts</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analytics.totalWebsiteClicks}</div>
                      <div className="text-sm text-gray-600">Website Clicks</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {(analytics.conversionRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                  </div>

                  {/* Detailed Analytics */}
                  {session?.user?.institutionId && (
                    <LeadTracking 
                      institutionId={session.user.institutionId}
                      showAnalytics={true}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Loading analytics...</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        <div className="flex justify-center pt-8 border-t border-gray-200">
          <Button
            type="submit"
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-md shadow-sm"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
} 