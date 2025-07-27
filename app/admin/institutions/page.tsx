'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaPlus } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, BookOpen, Calendar, Pause, Play, X, Check, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InstitutionLogoImage } from '@/components/ui/image-container';
import Link from 'next/link';

interface Institution {
  id: string;
  name: string;
  email: string;
  institutionEmail: string;
  description: string;
  country: string;
  city: string;
  address: string;
  telephone: string;
  contactName: string;
  contactJobTitle: string;
  contactPhone: string;
  contactEmail: string;
  logoUrl: string | null;
  facilities: unknown[];
  status: string;
  createdAt: string;
  _count: {
    courses: number;
    bookings: number;
  };
  isApproved: boolean;
}

export default function AdminInstitutions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      setError(null);
      // // // // // // // // // console.log('Fetching institutions...'); // Debug log
      
      const response = await fetch('/api/admin/institutions', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to response:. Please try again or contact support if the problem persists.`); // Debug log
        throw new Error(errorData.error || errorData.details || 'Failed to fetch institutions');
      }

      const data = await response.json();
      console.log('Fetched institutions data:', data); // Debug log
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected an array');
      }
      
      setInstitutions(data);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load institutions:. Please try again or contact support if the problem persists.`);
      setError(error instanceof Error ? error.message : 'Failed to fetch institutions');
      toast.error(error instanceof Error ? error.message : 'Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchInstitutions();
  }, [session, status]);

  const handleToggleApproval = async (id: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/institutions/${id}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
      });

      if (!response.ok) {
        throw new Error('Failed to update approval status');
      }

      // Refresh the institutions list
      await fetchInstitutions();
      toast.success(`Institution ${isApproved ? 'approved' : 'unapproved'} successfully`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating approval status:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update approval status');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/institutions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update the institutions list directly
      setInstitutions(prevInstitutions => 
        prevInstitutions.map(institution => 
          institution.id === id 
            ? { ...institution, status: newStatus }
            : institution
        )
      );
      toast.success(`Institution status updated to ${newStatus.toLowerCase()}`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating status:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Institution Management</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => window.open('/institution-registration', '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Public Registration
              </button>
              <button
                onClick={() => router.push('/admin/institutions/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FaPlus className="mr-2" />
                Add New Institution
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="p-4">
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Logo</TableHead>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead className="w-[180px]">Public Email</TableHead>
                      <TableHead className="w-[180px]">Admin Email</TableHead>
                      <TableHead className="w-[120px]">Country</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                      <TableHead className="w-24">Approval</TableHead>
                      <TableHead className="w-48">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {institutions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-sm text-gray-500">
                          No institutions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      institutions.map((institution) => (
                        <TableRow key={institution.id}>
                          <TableCell className="w-16">
                            <Link href={`/admin/institutions/${institution.id}`} className="block">
                              <div className="w-10 h-10">
                                <InstitutionLogoImage
                                  src={institution.logoUrl || ''}
                                  alt={`${institution.name} logo`}
                                  className="rounded"
                                />
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="w-[200px]">
                            <Link 
                              href={`/admin/institutions/${institution.id}`}
                              className="font-medium text-gray-900 hover:text-blue-600 truncate block"
                            >
                              {institution.name}
                            </Link>
                          </TableCell>
                          <TableCell className="w-[180px]">
                            <span className="truncate block">{institution.institutionEmail}</span>
                          </TableCell>
                          <TableCell className="w-[180px]">
                            <span className="truncate block">{institution.email}</span>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <span className="truncate block">{institution.country}</span>
                          </TableCell>
                          <TableCell className="w-24">
                            <Badge
                              variant={institution.status === 'ACTIVE' ? 'default' : 'destructive'}
                            >
                              {institution.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-24">
                            <Badge
                              variant={institution.isApproved ? 'default' : 'secondary'}
                            >
                              {institution.isApproved ? 'Approved' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-48">
                            <div className="flex items-center space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => router.push(`/admin/institutions/${institution.id}/edit`)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Institution</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => router.push(`/admin/institutions/${institution.id}/courses`)}
                                    >
                                      <BookOpen className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Manage Courses</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => router.push(`/admin/institutions/${institution.id}/bookings`)}
                                    >
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Bookings</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleToggleStatus(institution.id, institution.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                                    >
                                      {institution.status === 'ACTIVE' ? (
                                        <Pause className="h-4 w-4" />
                                      ) : (
                                        <Play className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{institution.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleToggleApproval(institution.id, !institution.isApproved)}
                                    >
                                      {institution.isApproved ? (
                                        <X className="h-4 w-4" />
                                      ) : (
                                        <Check className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{institution.isApproved ? 'Revoke Approval' : 'Approve Institution'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 