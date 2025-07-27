'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { InstitutionForm } from '@/components/institution/InstitutionForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface InstitutionEditPageProps {
  params: {
    id: string;
  };
}

export default function InstitutionEditPage({ params }: InstitutionEditPageProps) {
  const router = useRouter();
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`/api/admin/institutions/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch institution');
        }
        const data = await response.json();
        
        // Map the admin API response to match what InstitutionForm expects
        const mappedData = {
          ...data,
          logoUrl: data.logoUrl || '', // Ensure logoUrl is available
          mainImageUrl: data.mainImageUrl || '', // Ensure mainImageUrl is available
          facilities: Array.isArray(data.facilities) ? data.facilities : []
        };
        
        setInstitution(mappedData);
      } catch (error) {
          console.error('Error occurred:', error);
        toast.error(`Failed to load institution:. Please try again or contact support if the problem persists.`);
        toast.error('Failed to load institution details');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [params.id]);

  const handleSubmit = async (data: unknown) => {
    setIsSubmitting(true);
    try {
      // Let the InstitutionForm handle the uploads and submission
      // We just need to redirect after successful submission
      toast.success('Institution updated successfully');
      router.push(`/admin/institutions/${params.id}`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating institution:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update institution');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600">Institution not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/institutions/${params.id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Institution Details
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-6">Edit Institution</h1>
        <InstitutionForm
          initialData={institution}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 