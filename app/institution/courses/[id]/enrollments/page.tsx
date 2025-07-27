'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
import { format, isValid } from 'date-fns';
import { ArrowLeft, ExternalLink, Download, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  name: string;
}

interface Booking {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
}

interface Progress {
  moduleId: string;
  contentCompleted: boolean;
  exercisesCompleted: boolean;
  quizCompleted: boolean;
  quizScore: number | null;
  startedAt: string | null;
  completedAt: string | null;
}

interface Completion {
  completedAt: string | null;
  certificateIssued: boolean;
  certificateUrl: string | null;
}

interface Enrollment {
  id: string;
  enrolledAt: string;
  student: Student;
  bookings: Booking[];
  progress: Progress[];
  completion: Completion | null;
  status: string;
}

type SortField = 'name' | 'enrollmentDate' | 'progress' | 'paymentStatus' | 'status';
type SortDirection = 'asc' | 'desc';

export default function CourseEnrollmentsPage() {
  const params = useParams();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('enrollmentDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/institution/courses/${params.id}/enrollments`);
        if (!response.ok) {
          throw new Error(`Failed to fetch enrollments - Context: throw new Error('Failed to fetch enrollments');...`);
        }
        const data = await response.json();
        setEnrollments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [params.id]);

  const getPaymentStatus = (bookings: Booking[] | undefined) => {
    if (!bookings || bookings.length === 0) return '0/0 paid';
    const totalAmount = bookings.reduce((sum, b) => sum + b.amount, 0);
    const paidAmount = bookings
      .filter(b => b.status === 'PAID')
      .reduce((sum, b) => sum + b.amount, 0);
    return `${paidAmount}/${totalAmount} paid`;
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return direction * (a.student.firstName + a.student.lastName).localeCompare(b.student.firstName + b.student.lastName);
      case 'enrollmentDate':
        return direction * (new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime());
      case 'progress':
        const aProgress = a.progress.filter(p => p.completedAt).length;
        const bProgress = b.progress.filter(p => p.completedAt).length;
        return direction * (aProgress - bProgress);
      case 'paymentStatus':
        const aPaid = a.bookings.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.amount, 0);
        const bPaid = b.bookings.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.amount, 0);
        return direction * (aPaid - bPaid);
      case 'status':
        return direction * a.student.status.localeCompare(b.student.status);
      default:
        return 0;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    if (sortedEnrollments.length === 0) return;

    const headers = [
      'Student Name',
      'Email',
      'Phone',
      'Enrollment Date',
      'Progress',
      'Payment Status',
      'Status'
    ];

    const rows = sortedEnrollments.map(enrollment => [
      `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      enrollment.student.email,
      enrollment.student.phone,
      format(new Date(enrollment.enrolledAt), 'yyyy-MM-dd'),
      getPaymentStatus(enrollment.bookings),
      enrollment.student.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `course-enrollments-${params.id}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy') : 'N/A';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/institution/courses/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Course Enrollments</h1>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>
            View and manage student enrollments for this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1"
                  >
                    Student
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('enrollmentDate')}
                    className="flex items-center gap-1"
                  >
                    Enrollment Date
                    {sortField === 'enrollmentDate' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('progress')}
                    className="flex items-center gap-1"
                  >
                    Progress
                    {sortField === 'progress' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('paymentStatus')}
                    className="flex items-center gap-1"
                  >
                    Payment Status
                    {sortField === 'paymentStatus' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1"
                  >
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {enrollment.student.firstName} {enrollment.student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{enrollment.student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(enrollment.enrolledAt)}
                  </TableCell>
                  <TableCell>{getPaymentStatus(enrollment.bookings)}</TableCell>
                  <TableCell>
                    <Badge variant={enrollment.student.status === 'active' ? 'default' : 'secondary'}>
                      {enrollment.student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/institution/students/${enrollment.student.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 font-medium"
                        aria-label={`View details for ${enrollment.student.firstName} ${enrollment.student.lastName}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 