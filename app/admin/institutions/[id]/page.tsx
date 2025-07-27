'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen, ImageIcon, Pencil, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { InstitutionLogoImage, FacilityImage } from '@/components/ui/image-container';

interface Institution {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postcode: string;
  website: string;
  institutionEmail: string;
  telephone: string;
  contactName: string;
  contactJobTitle: string;
  contactPhone: string;
  contactEmail: string;
  logoUrl: string;
  mainImageUrl: string;
  facilities: string[];
  status: 'ACTIVE' | 'SUSPENDED';
  isApproved: boolean;
  _count?: {
    courses: number;
  };
}

export default function InstitutionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const handleStatusToggle = async () => {
    if (!institution) return;

    try {
      const response = await fetch(`/api/institutions/${institution.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: institution.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update institution status');
      }

      setNeedsRefresh(true);
      toast.success('Institution status updated successfully');
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating institution status:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update institution status');
    }
  };

  const fetchInstitution = async (force = false) => {
    try {
      const response = await fetch(`/api/admin/institutions/${params.id}`, {
        cache: force ? 'no-store' : 'default',
        headers: force ? {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } : undefined
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch institution');
      }
      const data = await response.json();
      
      if (!data || typeof data.id !== 'string') {
        throw new Error('Invalid institution data received');
      }

      const institutionData = {
        ...data,
        facilities: Array.isArray(data.facilities) ? data.facilities : []
      };

      setInstitution(institutionData);
      setNeedsRefresh(false);
    } catch (err) {
      toast.error('Fetch error:');
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load institution details');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourses = () => {
    // // // console.log('Navigating to courses with institution ID:', params.id);
    router.push(`/admin/courses?institutionId=${params.id}`);
  };

  useEffect(() => {
    fetchInstitution(needsRefresh);
  }, [params.id, needsRefresh]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Institution not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Institution Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24">
            <InstitutionLogoImage
              src={institution?.logoUrl || ''}
              alt={`${institution.name} logo`}
              className="w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{institution.name}</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewCourses}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  View Courses ({institution._count?.courses || 0})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/institutions/${params.id}/permissions`)}
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Permissions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/institutions/${params.id}/edit`)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStatusToggle}
                  className={institution.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'}
                >
                  {institution.status === 'ACTIVE' || institution.isApproved ? 'Suspend' : 'Activate'}
                </Button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={institution.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {institution.status}
              </Badge>
              <Badge variant={institution.isApproved ? 'default' : 'secondary'}>
                {institution.isApproved ? 'Approved' : 'Pending Approval'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="text-gray-600">{institution.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Country</Label>
                  <p className="text-gray-600">{institution.country || 'Not specified'}</p>
                </div>
                <div>
                  <Label>City</Label>
                  <p className="text-gray-600">{institution.city || 'Not specified'}</p>
                </div>
                <div>
                  <Label>State/Province</Label>
                  <p className="text-gray-600">{institution.state || 'Not specified'}</p>
                </div>
                <div>
                  <Label>Postcode</Label>
                  <p className="text-gray-600">{institution.postcode || 'Not specified'}</p>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <p className="text-gray-600">{institution.address || 'Not specified'}</p>
              </div>
              <div>
                <Label>Telephone</Label>
                <p className="text-gray-600">{institution.telephone || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Main Image (Hero)</CardTitle>
            </CardHeader>
            <CardContent>
              {institution.mainImageUrl ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={institution.mainImageUrl}
                    alt={`${institution.name} main image`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Main image for public display
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No main image uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Main image will be displayed on the public institution page
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Website</Label>
                <p className="text-sm text-gray-600">
                  {institution.website || 'Not provided'}
                </p>
              </div>
              <div>
                <Label>Institution Email</Label>
                <p className="text-sm text-gray-600">
                  {institution.institutionEmail || 'Not provided'}
                </p>
              </div>
              <div>
                <Label>Telephone</Label>
                <p className="text-sm text-gray-600">
                  {institution.telephone || 'Not provided'}
                </p>
              </div>
              <div>
                <Label>Contact Person</Label>
                <p className="text-sm text-gray-600">
                  {institution.contactName || 'Not provided'}
                </p>
              </div>
              <div>
                <Label>Contact Job Title</Label>
                <p className="text-sm text-gray-600">
                  {institution.contactJobTitle || 'Not provided'}
                </p>
              </div>
              <div>
                <Label>Contact Phone</Label>
                <p className="text-sm text-gray-600">
                  {institution.contactPhone || 'Not provided'}
                </p>
              </div>
              <div>
                <Label>Contact Email</Label>
                <p className="text-sm text-gray-600">
                  {institution.contactEmail || 'Not provided'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(Array.isArray(institution.facilities) ? institution.facilities : []).map((facility, index) => (
                  <div key={index} className="relative aspect-square group">
                    <FacilityImage
                      src={facility}
                      alt={`${institution.name} facility ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        fetch(`/api/institutions/${params.id}/upload`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ imageUrl: facility }),
                        }).then(() => {
                          setInstitution((prev) => {
                            if (!prev) return null;
                            return {
                              ...prev,
                              facilities: Array.isArray(prev.facilities) 
                                ? prev.facilities.filter((_, i) => i !== index)
                                : [],
                            };
                          });
                        });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(!institution.facilities || institution.facilities.length === 0) && (
                  <div className="col-span-full text-center py-8">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No facility images uploaded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {institution.description || 'No description provided'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 