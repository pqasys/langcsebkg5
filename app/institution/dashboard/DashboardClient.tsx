'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { SubscriptionOverviewCard } from '@/components/SubscriptionOverviewCard';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Palette, BookOpen, Users, Settings } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  referenceNumber: string;
  paidAt: string | null;
  createdAt: string;
  commissionAmount: number;
  institutionAmount: number;
  student: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
  };
  enrollment: {
    id: string;
    startDate: string;
    endDate: string;
  };
}

interface PaymentSettings {
  allowInstitutionPaymentApproval: boolean;
  showInstitutionApprovalButtons: boolean;
  institutionApprovableMethods: string[];
  institutionPaymentApprovalExemptions: string[];
  canApprovePayments: boolean;
  showApprovalButtons: boolean;
  isExempted: boolean;
}

interface DashboardClientProps {
  totalCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  totalRevenue: number;
  pendingPayments: number;
  recentEnrollmentsWithPayment: unknown[];
  validPendingPayments: Payment[];
  recentStudentsWithEnrollments: unknown[];
}

export function DashboardClient({
  totalCourses,
  totalEnrollments,
  totalCompletions,
  totalRevenue,
  pendingPayments,
  recentEnrollmentsWithPayment,
  validPendingPayments,
  recentStudentsWithEnrollments
}: DashboardClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [localPendingPayments, setLocalPendingPayments] = useState<Payment[]>(validPendingPayments);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const settingsResponse = await fetch('/api/institution/settings/payment-approval');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setPaymentSettings(settingsData.settings);
        } else {
          toast.error('Failed to fetch payment settings:');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        toast.error(`Failed to load payment settings. Please try again or contact support if the problem persists.`);
      }
    };

    if (session?.user) {
      fetchPaymentSettings();
    }
  }, [session]);

  const handleApprovePayment = async (paymentId: string) => {
    try {
      setProcessingPayment(paymentId);
      const response = await fetch(`/api/institution/payments/${paymentId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve payment');
      }

      const updatedPayment = await response.json();
      
      // Update the local state
      setLocalPendingPayments(prevPayments =>
        prevPayments.map(payment =>
          payment.id === paymentId
            ? { ...payment, status: 'COMPLETED', paidAt: new Date().toISOString() }
            : payment
        )
      );

      toast.success('Payment approved successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to approving payment. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to approve payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      setProcessingPayment(paymentId);
      const response = await fetch(`/api/institution/payments/${paymentId}/reject`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error(`Failed to reject payment - Context: if (!response.ok) throw new Error('Failed to rejec...`);
      
      // Update the payment status in the local state
      setLocalPendingPayments(prevPayments =>
        prevPayments.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'FAILED' }
            : payment
        )
      );
      
      toast.success('Payment rejected');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to rejecting payment. Please try again or contact support if the problem persists.`);
      toast.error('Failed to reject payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  // Check if specific payment can be approved by this institution
  const canApprovePayment = (payment: Payment) => {
    if (!paymentSettings?.canApprovePayments) return false;
    
    // Check if payment method is approvable
    if (payment.paymentMethod && !paymentSettings?.institutionApprovableMethods?.includes(payment.paymentMethod)) {
      return false;
    }

    return true;
  };

  // Check if approval buttons should be shown
  const shouldShowApprovalButtons = () => {
    return paymentSettings?.showApprovalButtons;
  };

  // Determine payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>;
      case 'PROCESSING':
      case 'INITIATED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processing</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Pending</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No Payment</span>;
    }
  };

  // Determine enrollment status badge
  const getEnrollmentStatusBadge = (status: string) => {
    switch (status) {
      case 'ENROLLED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Enrolled</span>;
      case 'PENDING_PAYMENT':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending Payment</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Institution Dashboard</h1>
      
      {/* Subscription Overview */}
      <div className="mb-6 sm:mb-8">
        <SubscriptionOverviewCard />
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalCompletions}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{pendingPayments}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Manage Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/institution/courses')}
              variant="outline"
              className="w-full"
            >
              Go to Courses
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Manage Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/institution/students')}
              variant="outline"
              className="w-full"
            >
              Go to Students
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/institution/settings')}
              variant="outline"
              className="w-full"
            >
              Go to Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-pink-600" />
              Design Toolkit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/admin/design-configs')}
              variant="outline"
              className="w-full"
            >
              Open Design Toolkit
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {recentEnrollmentsWithPayment.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No recent enrollments
                </div>
              ) : (
                <div className="divide-y">
                  {recentEnrollmentsWithPayment.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {enrollment.student.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {enrollment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {enrollment.course.title}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-sm font-medium">
                            ${enrollment.paymentAmount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(enrollment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Students</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {recentStudentsWithEnrollments.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No recent students
                </div>
              ) : (
                <div className="divide-y">
                  {recentStudentsWithEnrollments.map((student) => (
                    <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {student.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {(student.enrollmentCount || 0)} courses
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {student.email}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-xs text-muted-foreground">
                            {new Date(student.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 