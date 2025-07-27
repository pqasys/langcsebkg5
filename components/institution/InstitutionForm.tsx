'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { citiesByCountryAndState } from '@/lib/data/cities';
import { statesByCountry, NO_STATE } from '@/lib/data/states';
import { Upload, X, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

// List of countries from states data
const COUNTRIES = Object.keys(statesByCountry).sort();

interface InstitutionFormProps {
  initialData: unknown;
  onSubmit: (data: unknown) => Promise<void>;
  isSubmitting: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function InstitutionForm({ initialData, onSubmit, isSubmitting }: InstitutionFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    description: initialData.description || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    country: initialData.country || '',
    postcode: initialData.postcode || '',
    website: initialData.website || '',
    institutionEmail: initialData.institutionEmail || '',
    telephone: initialData.telephone || '',
    contactName: initialData.contactName || '',
    contactJobTitle: initialData.contactJobTitle || '',
    contactPhone: initialData.contactPhone || '',
    contactEmail: initialData.contactEmail || '',
    logoUrl: initialData.logoUrl || '',
    mainImageUrl: initialData.mainImageUrl || '',
    facilities: Array.isArray(initialData.facilities) ? initialData.facilities : [],
    facilityFiles: [] as File[]
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [lastSavedData, setLastSavedData] = useState<any>(null);
  const router = useRouter();

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Institution name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.state) {
      errors.state = 'State is required';
    }
    if (!formData.city) {
      errors.city = 'City is required';
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Invalid website URL';
    }
    if (formData.institutionEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.institutionEmail)) {
      errors.institutionEmail = 'Invalid email format';
    }
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = 'Invalid email format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user makes a selection
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');
      formData.append('preview', 'false');
      formData.append('institutionId', initialData.id);

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      const response = await new Promise((resolve, reject) => {
        xhr.open('POST', '/api/institution/upload');
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(formData);
      });

      if (typeof response === 'string') {
        const data = JSON.parse(response);
        setFormData(prev => ({
          ...prev,
          logoUrl: data.url
        }));
        toast.success('Logo uploaded successfully');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to uploading logo:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to upload logo');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'mainImage');
      formData.append('preview', 'false');
      formData.append('institutionId', initialData.id);

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      const response = await new Promise((resolve, reject) => {
        xhr.open('POST', '/api/institution/upload');
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(formData);
      });

      if (typeof response === 'string') {
        const data = JSON.parse(response);
        setFormData(prev => ({
          ...prev,
          mainImageUrl: data.url
        }));
        toast.success('Main image uploaded successfully');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to uploading main image. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to upload main image');
    } finally {
      setUploadProgress(0);
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
        throw new Error(`Failed to delete logo - Context: throw new Error('Failed to delete logo');...`);
      }

      setFormData(prev => ({ ...prev, logoUrl: '' }));
      toast.success('Logo deleted successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting logo. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete logo');
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
        throw new Error(`Failed to delete main image - Context: body: JSON.stringify({ imageUrl: formData.mainImag...`);
      }

      setFormData(prev => ({ ...prev, mainImageUrl: '' }));
      toast.success('Main image deleted successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting main image. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete main image');
    }
  };

  const handleFacilityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const newFacilities = [...formData.facilities];
      
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'facility');
        formData.append('preview', 'false');
        formData.append('institutionId', initialData.id);

        console.log('Uploading facility image:', {
          fileName: file.name,
          fileSize: file.size,
          institutionId: initialData.id
        });

        const response = await fetch('/api/institution/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload facility image');
        }

        const data = await response.json();
        newFacilities.push(data.url);
      }

      setFormData(prev => ({
        ...prev,
        facilities: newFacilities
      }));
      toast.success('Facility images uploaded successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to uploading facility images. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to upload facility images');
    }
  };

  const removeFacilityFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
      facilityFiles: prev.facilityFiles.filter((_, i) => i !== index)
    }));
    toast.success('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting', {
        description: 'Please check the highlighted fields and try again.'
      });
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    // Store current form data for potential recovery
    const currentFormData = { ...formData };
    setLastSavedData(currentFormData);

    // Show saving toast
    const saveToast = toast.loading('Saving changes...', {
      description: 'Please wait while we update your institution profile.'
    });

    try {
      // Optimistically update the UI
      setFormData(prev => ({
        ...prev,
        isUpdating: true
      }));

      // First, upload the logo if it exists
      let logoUrl = formData.logoUrl;
      if (logoFile) {
        setUploadProgress(0);
        const logoFormData = new FormData();
        logoFormData.append('file', logoFile);
        logoFormData.append('type', 'logo');
        logoFormData.append('preview', 'false');
        logoFormData.append('institutionId', initialData.id);

        // Show upload toast
        const uploadToast = toast.loading('Uploading logo...', {
          description: 'Please wait while we upload your logo.'
        });

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
          }
        };

        const logoResponse = await new Promise((resolve, reject) => {
          xhr.open('POST', '/api/institution/upload');
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = () => reject(xhr.statusText);
          xhr.send(logoFormData);
        });

        if (typeof logoResponse === 'string') {
          const logoData = JSON.parse(logoResponse);
          logoUrl = logoData.url;
          toast.dismiss(uploadToast);
          toast.success('Logo uploaded successfully');
        }
      }

      // Upload main image if it exists
      let mainImageUrl = formData.mainImageUrl;
      if (mainImageFile) {
        setUploadProgress(0);
        const mainImageFormData = new FormData();
        mainImageFormData.append('file', mainImageFile);
        mainImageFormData.append('type', 'mainImage');
        mainImageFormData.append('preview', 'false');
        mainImageFormData.append('institutionId', initialData.id);

        // Show upload toast
        const uploadToast = toast.loading('Uploading main image...', {
          description: 'Please wait while we upload your main image.'
        });

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
          }
        };

        const mainImageResponse = await new Promise((resolve, reject) => {
          xhr.open('POST', '/api/institution/upload');
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = () => reject(xhr.statusText);
          xhr.send(mainImageFormData);
        });

        if (typeof mainImageResponse === 'string') {
          const mainImageData = JSON.parse(mainImageResponse);
          mainImageUrl = mainImageData.url;
          toast.dismiss(uploadToast);
          toast.success('Main image uploaded successfully');
        }
      }

      // Then, update the profile
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'facilities' && key !== 'logoPreview' && key !== 'mainImagePreview' && key !== 'facilityFiles' && key !== 'logoUrl' && key !== 'mainImageUrl') {
          if (value !== null && value !== undefined) {
            formDataToSend.append(key, String(value));
          }
        }
      });

      formDataToSend.append('institutionId', initialData.id);
      if (logoUrl) {
        formDataToSend.append('logoUrl', logoUrl);
      }
      if (mainImageUrl) {
        formDataToSend.append('mainImageUrl', mainImageUrl);
      }

      const existingFacilities = formData.facilities.filter(url => !url.startsWith('data:'));
      formDataToSend.append('facilities', JSON.stringify(existingFacilities));

      const response = await fetch('/api/institution/profile', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedData = await response.json();
      
      setFormData(prev => ({
        ...prev,
        ...updatedData,
        facilities: updatedData.facilities || [],
        isUpdating: false
      }));

      // Update save toast to success
      toast.dismiss(saveToast);
      toast.success('Profile updated successfully', {
        description: 'Your institution profile has been saved.'
      });

      setSuccess('Profile updated successfully');
      
      // Call the onSubmit callback if provided (for admin usage)
      if (onSubmit) {
        await onSubmit(updatedData);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to submitting form. Please try again or contact support if the problem persists.`);
      setError('An error occurred while saving changes');
      // Restore form data on failure
      setFormData(currentFormData);
      
      // Update save toast to error
      toast.dismiss(saveToast);
      toast.error('Failed to update profile', {
        description: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Institution Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Institution Admin Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institutionEmail">Institution Email</Label>
              <Input
                id="institutionEmail"
                name="institutionEmail"
                type="email"
                value={formData.institutionEmail}
                onChange={handleInputChange}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
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
                value={formData.country}
                onValueChange={(value) => handleSelectChange('country', value)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
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
                value={formData.state}
                onValueChange={(value) => handleSelectChange('state', value)}
                disabled={!formData.country}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {statesByCountry[formData.country]?.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  )) || (
                    <SelectItem value={NO_STATE}>
                      No state/province required
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleSelectChange('city', value)}
                disabled={!formData.country || !formData.state}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {citiesByCountryAndState[formData.country]?.[formData.state]?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  )) || (
                    <SelectItem value="no-cities">
                      No cities available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telephone">Institution Telephone</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactJobTitle">Contact Job Title</Label>
              <Input
                id="contactJobTitle"
                name="contactJobTitle"
                value={formData.contactJobTitle}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Institution Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                {formData.logoPreview ? (
                  <Image
                    src={formData.logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain rounded"
                  />
                ) : formData.logoUrl ? (
                  <Image
                    src={formData.logoUrl}
                    alt="Institution logo"
                    fill
                    className="object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="bg-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended size: 200x200 pixels
                </p>
              </div>
              {formData.logoUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteLogo}
                  disabled={saving}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainImage">Main Image (Hero)</Label>
            <div className="flex items-center space-x-4">
              <div className="relative w-48 h-16">
                {formData.mainImagePreview ? (
                  <Image
                    src={formData.mainImagePreview}
                    alt="Main image preview"
                    fill
                    className="object-cover rounded"
                  />
                ) : formData.mainImageUrl ? (
                  <Image
                    src={formData.mainImageUrl}
                    alt="Institution main image"
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="mainImage"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="bg-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended size: 1200x384 pixels (3:1 ratio)
                </p>
              </div>
              {formData.mainImageUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteMainImage}
                  disabled={saving}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Facility Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.facilities?.map((facility, index) => (
                <div key={index} className="relative aspect-square group">
                  <Image
                    src={facility}
                    alt={`Facility ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <button
                    type="button"
                    onClick={() => removeFacilityFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {(formData.facilities?.length || 0) < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFacilityChange}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Maximum 5 images. Recommended size: 800x800 pixels
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
} 