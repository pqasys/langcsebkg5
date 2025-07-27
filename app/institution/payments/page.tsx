'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Search, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

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
}

export default function InstitutionPaymentsPage() {
  const { data: session, status } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch payment settings from institution-specific endpoint
        const settingsResponse = await fetch('/api/institution/settings/payment-approval');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setPaymentSettings(settingsData.settings);
        } else {
          toast.error('Failed to fetch payment settings:');
        }

        // Fetch payments
        const paymentsResponse = await fetch('/api/institution/payments');
        if (!paymentsResponse.ok) throw new Error(`Failed to fetch payments - Context: if (!paymentsResponse.ok) throw new Error('Failed ...`);
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData);

        // Get institution ID from session
        if (session?.user?.institutionId) {
          setInstitutionId(session.user.institutionId);
        }
      } catch (error) {
        console.error('Error occurred:', error);
        toast.error(`Failed to load data. Please try again or contact support if the problem persists.`);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, session]);

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
      setPayments(prevPayments =>
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
      
      if (!response.ok) throw new Error(`Failed to reject payment - Context: method: 'POST',...`);
      
      // Update the payment status in the local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'FAILED' }
          : payment
      ));
      
      toast.success('Payment rejected');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to rejecting payment. Please try again or contact support if the problem persists.`);
      toast.error('Failed to reject payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  // Check if institution can approve payments
  const canApprovePayments = () => {
    if (!paymentSettings || !institutionId) return false;
    
    // Check if institution payment approval is globally disabled
    if (!paymentSettings.allowInstitutionPaymentApproval) {
      return false;
    }

    // Check if institution is exempted
    if (paymentSettings.institutionPaymentApprovalExemptions?.includes(institutionId)) {
      return false;
    }

    return true;
  };

  // Check if specific payment can be approved by this institution
  const canApprovePayment = (payment: Payment) => {
    if (!canApprovePayments()) return false;
    
    // Check if payment method is approvable
    if (payment.paymentMethod && !paymentSettings?.institutionApprovableMethods?.includes(payment.paymentMethod)) {
      return false;
    }

    return true;
  };

  // Check if approval buttons should be shown
  const shouldShowApprovalButtons = () => {
    return paymentSettings?.showInstitutionApprovalButtons && canApprovePayments();
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Payment Management</h1>
          
          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(filteredPayments.reduce((sum, payment) => sum + payment.amount, 0))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredPayments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredPayments.filter(p => p.status === 'COMPLETED').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Institution Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(filteredPayments.reduce((sum, payment) => sum + payment.institutionAmount, 0))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Alert */}
          {!canApprovePayments() && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Payment Approval Disabled</p>
                    <p className="text-sm">
                      {!paymentSettings?.allowInstitutionPaymentApproval 
                        ? "Institution payment approval is currently disabled by the administrator."
                        : "Your institution is exempted from payment approval. All payments require administrator approval."
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 search-container-long">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by student name, email, course, or reference number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Payment Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Institution Share</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  {shouldShowApprovalButtons() && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.student.name}</div>
                        <div className="text-sm text-muted-foreground">{payment.student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.course.title}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{formatCurrency(payment.commissionAmount)}</TableCell>
                    <TableCell>{formatCurrency(payment.institutionAmount)}</TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>{payment.referenceNumber}</TableCell>
                    <TableCell>
                      {payment.paidAt 
                        ? format(new Date(payment.paidAt), 'MMM d, yyyy')
                        : format(new Date(payment.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        payment.status === 'COMPLETED' ? 'success' :
                        payment.status === 'FAILED' ? 'destructive' :
                        payment.status === 'REFUNDED' ? 'secondary' :
                        'warning'
                      }>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    {shouldShowApprovalButtons() && (
                      <TableCell>
                        {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && canApprovePayment(payment) && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprovePayment(payment.id)}
                              disabled={processingPayment === payment.id}
                            >
                              {processingPayment === payment.id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                'Approve'
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectPayment(payment.id)}
                              disabled={processingPayment === payment.id}
                            >
                              {processingPayment === payment.id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                'Reject'
                              )}
                            </Button>
                          </div>
                        )}
                        {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && !canApprovePayment(payment) && (
                          <div className="text-sm text-muted-foreground">
                            Requires admin approval
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 