'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { Upload, X, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { citiesByCountryAndState } from '@/lib/data/cities';
import { statesByCountry, NO_STATE } from '@/lib/data/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// List of countries from states data
const COUNTRIES = Object.keys(statesByCountry).sort();

interface Institution {
  id: string;
  name: string;
  email: string;
  website: string;
  institutionEmail: string;
  description: string;
  country: string;
  city: string;
  state: string;
  postcode: string;
  address: string;
  telephone: string;
  contactName: string;
  contactJobTitle: string;
  contactPhone: string;
  contactEmail: string;
  logoUrl: string;
  facilities: string[];
  isApproved: boolean;
}

interface InstitutionProfileFormProps {
  institution: Institution;
  isAdmin?: boolean;
}

export function InstitutionProfileForm({ institution, isAdmin = false }: InstitutionProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [facilityFiles, setFacilityFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Institution>({
    ...institution,
    facilities: (() => {
      try {
        if (!institution.facilities) return [];
        if (Array.isArray(institution.facilities)) return institution.facilities;
        if (typeof institution.facilities === 'string') {
          const parsed = JSON.parse(institution.facilities);
          return Array.isArray(parsed) ? parsed : [];
        }
        return [];
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error(`Failed to parsing facilities:. Please try again or contact support if the problem persists.`));
        return [];
      }
    })()
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
        throw new Error(`Failed to upload logo - Context: throw new Error('Failed to upload logo');...`);
      }

      toast.success('Logo uploaded successfully');
      router.refresh();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to uploading logo:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('mainImage', file);

      const response = await fetch('/api/institution/profile/main-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload main image - Context: body: formData,...`);
      }

      toast.success('Main image uploaded successfully');
      router.refresh();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to uploading main image:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to upload main image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!formData.logoUrl) return;
    
    if (!confirm('Are you sure you want to delete the logo?')) return;

    setUploading(true);
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

      setFormData(prev => ({ ...prev, logoUrl: '' }));
      toast.success('Logo deleted successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting logo:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to delete logo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMainImage = async () => {
    if (!formData.mainImageUrl) return;
    
    if (!confirm('Are you sure you want to delete the main image?')) return;

    setUploading(true);
    try {
      const response = await fetch('/api/institution/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: formData.mainImageUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete main image - Context: 'Content-Type': 'application/json',...`);
      }

      setFormData(prev => ({ ...prev, mainImageUrl: '' }));
      toast.success('Main image deleted successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting main image:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to delete main image');
    } finally {
      setUploading(false);
    }
  };

  const handleFacilityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('facilities', file);
      });

      const response = await fetch('/api/institution/profile/facilities', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload facilities - Context: formData.append('facilities', file);...`);
      }

      toast.success('Facilities uploaded successfully');
      router.refresh();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to uploading facilities:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to upload facilities');
    } finally {
      setUploading(false);
    }
  };

  const removeFacilityFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
    setFacilityFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/institution/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile - Context: try {...`);
      }

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (err) {
      toast.error(`Failed to updating profile:. Please try again or contact support if the problem persists.`));
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
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
                <SelectContent className="bg-white">
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
                  ))}
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
                    sizes="80px"
                  />
                ) : formData.logoUrl ? (
                  <Image
                    src={formData.logoUrl}
                    alt="Institution logo"
                    fill
                    className="object-contain rounded"
                    sizes="80px"
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
                  disabled={uploading}
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
                    sizes="128px"
                  />
                ) : formData.mainImageUrl ? (
                  <Image
                    src={formData.mainImageUrl}
                    alt="Institution main image"
                    fill
                    className="object-cover rounded"
                    sizes="128px"
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
                  disabled={uploading}
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
          {saving ? (
            <>
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          {success}
        </div>
      )}
    </form>
  );
} 