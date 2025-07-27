'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  DollarSign,
  Eye,
  Edit,
  Download,
  RefreshCw
} from 'lucide-react';
import { format, isValid } from 'date-fns';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  last_active: string | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string | null;
  currency: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string | null;
  paymentStatus: string;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
  student: Student;
  payments: Payment[];
  totalPaid: number;
  latestPayment: Payment | null;
  daysSinceEnrollment: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  institution: {
    id: string;
    name: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminCourseEnrollmentsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const courseId = params.id as string;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Status update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [updatePaymentStatus, setUpdatePaymentStatus] = useState<string>('');
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Ensure component is mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  const fetchEnrollments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL(`/api/admin/courses/${courseId}/enrollments`, window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '50');
      
      if (statusFilter !== 'all') {
        url.searchParams.append('status', statusFilter);
      }
      if (paymentStatusFilter !== 'all') {
        url.searchParams.append('paymentStatus', paymentStatusFilter);
      }
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }

      const data = await response.json();
      setEnrollments(data.enrollments || []);
      setCourse(data.course);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId && mounted) {
      fetchEnrollments(currentPage);
    }
  }, [courseId, currentPage, statusFilter, paymentStatusFilter, searchTerm, mounted]);

  const handleStatusUpdate = async () => {
    if (!selectedEnrollment) return;

    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/admin/courses/${courseId}/enrollments`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId: selectedEnrollment.id,
          status: updateStatus || undefined,
          paymentStatus: updatePaymentStatus || undefined,
          notes: updateNotes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update enrollment');
      }

      toast.success('Enrollment updated successfully');
      setIsUpdateModalOpen(false);
      setSelectedEnrollment(null);
      setUpdateStatus('');
      setUpdatePaymentStatus('');
      setUpdateNotes('');
      
      // Refresh the enrollments list
      fetchEnrollments(currentPage);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error('Failed to update enrollment');
    } finally {
      setIsUpdating(false);
    }
  };

  const openUpdateModal = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setUpdateStatus(enrollment.status);
    setUpdatePaymentStatus(enrollment.paymentStatus);
    setUpdateNotes('');
    setIsUpdateModalOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid Date';
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'ENROLLED':
      case 'IN_PROGRESS':
        return 'default';
      case 'COMPLETED':
        return 'secondary';
      case 'PENDING_PAYMENT':
        return 'destructive';
      case 'CANCELLED':
      case 'DROPPED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'PAID':
        return 'default';
      case 'PENDING':
        return 'destructive';
      case 'FAILED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Loading enrollments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Enrollments</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchEnrollments()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Users className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">Course Enrollments</h1>
            {course && (
              <p className="text-gray-600 mt-1">
                {course.title} • {course.institution.name}
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {pagination && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Enrollments</p>
                    <p className="text-2xl font-bold">{pagination.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Students</p>
                    <p className="text-2xl font-bold">
                      {enrollments.filter(e => ['IN_PROGRESS', 'ENROLLED', 'ACTIVE'].includes(e.status)).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Paid Enrollments</p>
                    <p className="text-2xl font-bold">
                      {enrollments.filter(e => e.paymentStatus === 'COMPLETED' || e.paymentStatus === 'PAID').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Payment</p>
                    <p className="text-2xl font-bold">
                      {enrollments.filter(e => e.paymentStatus === 'PENDING').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative search-container-long">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="ENROLLED">Enrolled</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="DROPPED">Dropped</SelectItem>
                  <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPaymentStatusFilter('all');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrollments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollments</CardTitle>
            <CardDescription>
              Manage student enrollments for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{enrollment.student.name}</div>
                          <div className="text-sm text-gray-500">{enrollment.student.email}</div>
                          {enrollment.student.phone && (
                            <div className="text-sm text-gray-500">{enrollment.student.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatDate(enrollment.createdAt)}</div>
                          <div className="text-sm text-gray-500">
                            {enrollment.daysSinceEnrollment} days ago
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusBadgeVariant(enrollment.paymentStatus)}>
                          {enrollment.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{enrollment.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatCurrency(enrollment.totalPaid)}
                          </div>
                          {enrollment.latestPayment && (
                            <div className="text-sm text-gray-500">
                              {formatDate(enrollment.latestPayment.createdAt)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdateModal(enrollment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} enrollments
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Update Modal */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Enrollment Status</DialogTitle>
              <DialogDescription>
                Update the status for {selectedEnrollment?.student.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enrollment Status</label>
                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ENROLLED">Enrolled</SelectItem>
                    <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Status</label>
                <Select value={updatePaymentStatus} onValueChange={setUpdatePaymentStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <Input
                  placeholder="Add notes about this update..."
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateModalOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 