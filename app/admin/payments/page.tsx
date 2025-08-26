'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { isClientBuildTime, getFallbackData } from '@/lib/client-error-handler';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { 
  Search, 
  Info, 
  Check, 
  X, 
  AlertTriangle, 
  Eye, 
  Clock, 
  DollarSign,
  Filter,
  RefreshCw,
  Shield,
  UserCheck,
  Building
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PROCESSING' | 'CANCELLED';
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
  institution: {
    id: string;
    name: string;
  };
  enrollment: {
    id: string;
    startDate: string;
    endDate: string;
  };
  bookingId?: string;
  metadata?: unknown;
}

interface PaymentSettings {
  allowInstitutionPaymentApproval: boolean;
  showInstitutionApprovalButtons: boolean;
  institutionApprovableMethods: string[];
  adminOnlyMethods: string[];
  institutionPaymentApprovalExemptions: string[];
}

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [selectedPaymentForAction, setSelectedPaymentForAction] = useState<Payment | null>(null);
  const [showDisapprovalDialog, setShowDisapprovalDialog] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // During build time, use fallback data
        if (isClientBuildTime()) {
          setPayments(getFallbackData('payments'));
          setInstitutions(getFallbackData('institutions'));
          setPaymentSettings(getFallbackData('settings'));
          setLoading(false);
          return;
        }
        
        const [paymentsRes, institutionsRes, settingsRes] = await Promise.all([
          fetch('/api/admin/payments'),
          fetch('/api/admin/institutions'),
          fetch('/api/admin/settings/payment-approval')
        ]);
        
        if (!paymentsRes.ok) throw new Error('Failed to fetch payments');
        if (!institutionsRes.ok) throw new Error('Failed to fetch institutions');
        
        const paymentsData = await paymentsRes.json();
        const institutionsData = await institutionsRes.json();
        
        setPayments(paymentsData);
        setInstitutions(institutionsData);

        // Fetch payment settings if available
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setPaymentSettings(settingsData.settings);
        }
      } catch (error) {
          console.error('Error occurred:', error);
        toast.error(`Failed to load data:. Please try again or contact support if the problem persists.`);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchData();
    }
  }, [status, session]);

  const handleApprovePayment = async (paymentId: string) => {
    try {
      setProcessingPayment(paymentId);
      const response = await fetch(`/api/admin/payments/approve/${paymentId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to approve payment');
      }

      const result = await response.json();
      
      // Update the local state
      setPayments(prevPayments =>
        prevPayments.map(payment =>
          payment.id === paymentId
            ? { ...payment, status: 'COMPLETED', paidAt: new Date().toISOString() }
            : payment
        )
      );

      toast.success(result.message || 'Payment approved successfully');
      
      // Refresh the pending count in the sidebar
      if (typeof window !== 'undefined' && (window as any).refreshAdminPendingCount) {
        (window as any).refreshAdminPendingCount();
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to approving payment:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to approve payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleDisapprovePayment = async (paymentId: string, reason: string) => {
    try {
      setProcessingPayment(paymentId);
      const response = await fetch(`/api/admin/payments/disapprove/${paymentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to disapprove payment');
      }

      const result = await response.json();
      
      // Update the local state
      setPayments(prevPayments =>
        prevPayments.map(payment =>
          payment.id === paymentId
            ? { ...payment, status: 'FAILED' }
            : payment
        )
      );

      toast.success(result.message || 'Payment disapproved successfully');
      setShowDisapprovalDialog(false);
      setDisapprovalReason('');
      setSelectedPaymentForAction(null);
      
      // Refresh the pending count in the sidebar
      if (typeof window !== 'undefined' && (window as any).refreshAdminPendingCount) {
        (window as any).refreshAdminPendingCount();
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to disapproving payment:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to disapprove payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const openDisapprovalDialog = (payment: Payment) => {
    setSelectedPaymentForAction(payment);
    setShowDisapprovalDialog(true);
  };

  const openPaymentDetails = (payment: Payment) => {
    setSelectedPaymentForDetails(payment);
    setShowPaymentDetails(true);
  };

  // Check if payment could have been approved by institution
  const couldBeInstitutionApproved = (payment: Payment) => {
    if (!paymentSettings) {
      // // // // // // // // // // // // // // // console.log('No payment settings available');
      return false;
    }
    
    // Check if institution payment approval is enabled
    if (!paymentSettings.allowInstitutionPaymentApproval) {
      console.log('Institution payment approval is disabled');
      return false;
    }
    
    // Check if institution is exempted
    if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {
      console.log('Institution is exempted from payment approval');
      return false;
    }
    
    // Check if payment method is institution approvable
    if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {
      console.log('Payment method requires admin approval:', payment.paymentMethod);
      return false;
    }
    
    return true;
  };

  // Check if payment requires admin approval due to withdrawn rights
  const requiresAdminApprovalDueToWithdrawnRights = (payment: Payment) => {
    if (!paymentSettings) return false;
    
    // If institution approval is globally disabled, all payments require admin approval
    if (!paymentSettings.allowInstitutionPaymentApproval) {
      return true;
    }
    
    // If institution is exempted, it requires admin approval
    if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {
      return true;
    }
    
    // If payment method requires admin approval
    if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {
      return true;
    }
    
    return false;
  };

  // Get approval authority badge for a payment
  const getApprovalAuthorityBadge = (payment: Payment) => {
    if (payment.status !== 'PENDING' && payment.status !== 'PROCESSING') return null;
    
    if (couldBeInstitutionApproved(payment)) {
      return (
        <Badge variant="outline" className="text-xs mt-1 bg-green-50 text-green-700 border-green-300">
          <UserCheck className="h-3 w-3 mr-1" />
          Institution could approve
        </Badge>
      );
    }
    
    if (requiresAdminApprovalDueToWithdrawnRights(payment)) {
      return (
        <Badge variant="outline" className="text-xs mt-1 bg-red-50 text-red-700 border-red-300">
          <Shield className="h-3 w-3 mr-1" />
          Admin only
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="text-xs mt-1 bg-gray-50 text-gray-700 border-gray-300">
        <Info className="h-3 w-3 mr-1" />
        Admin approval
      </Badge>
    );
  };

  // Get reason why admin approval is required
  const getAdminApprovalReason = (payment: Payment) => {
    if (!paymentSettings) return 'Payment approval settings not configured';
    
    if (!paymentSettings.allowInstitutionPaymentApproval) {
      return 'Institution payment approval is globally disabled';
    }
    
    if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {
      return 'Institution is exempted from payment approval';
    }
    
    if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {
      return `Payment method '${payment.paymentMethod}' requires admin approval`;
    }
    
    return 'Requires admin approval';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      case 'REFUNDED':
        return 'outline';
      case 'PROCESSING':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'FAILED':
        return <X className="h-4 w-4 text-red-600" />;
      case 'REFUNDED':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'PROCESSING':
        return <FaSpinner className="h-4 w-4 animate-spin text-blue-600" />;
      case 'CANCELLED':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesInstitution = selectedInstitution === 'all' || payment.institution.id === selectedInstitution;
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || payment.paymentMethod === selectedPaymentMethod;
    return matchesSearch && matchesStatus && matchesInstitution && matchesPaymentMethod;
  });

  const pendingPayments = filteredPayments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING');
  const completedPayments = filteredPayments.filter(p => p.status === 'COMPLETED');
  const failedPayments = filteredPayments.filter(p => p.status === 'FAILED');
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCommission = filteredPayments.reduce((sum, payment) => sum + payment.commissionAmount, 0);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payment Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage all payments across all institutions
            </p>
          </div>
          <Button 
            onClick={() => navigate.reload()} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(totalAmount)}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {filteredPayments.length} payments
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {pendingPayments.length}
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                Require action
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {completedPayments.length}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Successfully processed
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
                <X className="h-4 w-4" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                {failedPayments.length}
              </div>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Rejected/declined
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(totalCommission)}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Platform revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Settings Info */}
        {paymentSettings && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Info className="h-5 w-5" />
                <div>
                  <p className="font-medium">Payment Approval Settings</p>
                  <p className="text-sm">
                    Institution payment approval is {paymentSettings.allowInstitutionPaymentApproval ? 'enabled' : 'disabled'}.
                    {paymentSettings.institutionPaymentApprovalExemptions?.length > 0 && (
                      <span> {paymentSettings.institutionPaymentApprovalExemptions.length} institution(s) are exempted.</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative search-container-long">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutions</SelectItem>
                  {institutions.map(institution => (
                    <SelectItem key={institution.id} value={institution.id}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                  <SelectItem value="PAYPAL">PayPal</SelectItem>
                  <SelectItem value="STRIPE">Stripe</SelectItem>
                  <SelectItem value="WIRE_TRANSFER">Wire Transfer</SelectItem>
                  <SelectItem value="CHECK">Check</SelectItem>
                  <SelectItem value="MONEY_ORDER">Money Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Payments ({filteredPayments.length})</span>
              {pendingPayments.length > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {pendingPayments.length} require action
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Student</TableHead>
                    <TableHead className="w-[180px] hidden md:table-cell">Course</TableHead>
                    <TableHead className="w-[130px] hidden lg:table-cell">Institution</TableHead>
                    <TableHead className="w-[110px]">Amount</TableHead>
                    <TableHead className="w-[90px] hidden md:table-cell">Method</TableHead>
                    <TableHead className="w-[110px] hidden lg:table-cell">Reference</TableHead>
                    <TableHead className="w-[90px] hidden sm:table-cell">Date</TableHead>
                    <TableHead className="w-[110px]">Status</TableHead>
                    <TableHead className="w-[110px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No payments found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => {
                      console.log('Rendering payment:', payment.id, 'Status:', payment.status, 'Method:', payment.paymentMethod);
                      return (
                        <TableRow key={payment.id} className={(payment.status === 'PENDING' || payment.status === 'PROCESSING') ? 'bg-orange-50 dark:bg-orange-900/10' : ''}>
                          <TableCell className="w-[160px]">
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{payment.student.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{payment.student.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="w-[180px] hidden md:table-cell">
                            <div className="min-w-0">
                              <div className="truncate" title={payment.course.title}>
                                {payment.course.title}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-[130px] hidden lg:table-cell">
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{payment.institution.name}</div>
                              {getApprovalAuthorityBadge(payment)}
                              {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && requiresAdminApprovalDueToWithdrawnRights(payment) && (
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  {getAdminApprovalReason(payment)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="w-[110px]">
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(payment.amount)}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Commission: {formatCurrency(payment.commissionAmount)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-[90px] hidden md:table-cell">
                            <Badge variant="outline" className="text-xs truncate max-w-full">
                              {payment.paymentMethod}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[110px] hidden lg:table-cell">
                            <div className="min-w-0">
                              <div className="truncate" title={payment.referenceNumber}>
                                {payment.referenceNumber || 'N/A'}
                              </div>
                              {payment.bookingId && (
                                <div className="text-xs text-gray-500 truncate" title={`Booking: ${payment.bookingId}`}>
                                  Booking: {payment.bookingId}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="w-[90px] hidden sm:table-cell">
                            <div className="text-sm">
                              {payment.paidAt 
                                ? format(new Date(payment.paidAt), 'MMM d, yyyy')
                                : format(new Date(payment.createdAt), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.paidAt ? 'Paid' : 'Created'}
                            </div>
                          </TableCell>
                          <TableCell className="w-[110px]">
                            <Badge variant={getStatusBadgeVariant(payment.status)} className="flex items-center gap-1 text-xs">
                              {getStatusIcon(payment.status)}
                              <span className="truncate">{payment.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[110px]">
                            <div className="flex items-center gap-1 flex-wrap">
                              <Button
                                size="sm"
                                onClick={() => openPaymentDetails(payment)}
                                className="h-7 w-7 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              
                              {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprovePayment(payment.id)}
                                    disabled={processingPayment === payment.id}
                                    className="bg-green-600 hover:bg-green-700 text-white h-7 w-7 p-0"
                                  >
                                    {processingPayment === payment.id ? (
                                      <FaSpinner className="animate-spin h-3 w-3" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    onClick={() => openDisapprovalDialog(payment)}
                                    disabled={processingPayment === payment.id}
                                    variant="destructive"
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disapproval Dialog */}
      <Dialog open={showDisapprovalDialog} onOpenChange={setShowDisapprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disapprove Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to disapprove this payment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPaymentForAction && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Payment Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Student:</strong> {selectedPaymentForAction.student.name}</p>
                  <p><strong>Course:</strong> {selectedPaymentForAction.course.title}</p>
                  <p><strong>Amount:</strong> {formatCurrency(selectedPaymentForAction.amount)}</p>
                  <p><strong>Method:</strong> {selectedPaymentForAction.paymentMethod}</p>
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Reason for disapproval (optional)</label>
              <Textarea
                placeholder="Enter reason for disapproval..."
                value={disapprovalReason}
                onChange={(e) => setDisapprovalReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDisapprovalDialog(false);
                setDisapprovalReason('');
                setSelectedPaymentForAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedPaymentForAction && handleDisapprovePayment(selectedPaymentForAction.id, disapprovalReason)}
              disabled={processingPayment === selectedPaymentForAction?.id}
            >
              {processingPayment === selectedPaymentForAction?.id ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Disapprove Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment
            </DialogDescription>
          </DialogHeader>
          {selectedPaymentForDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Student Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedPaymentForDetails.student.name}</p>
                    <p><strong>Email:</strong> {selectedPaymentForDetails.student.email}</p>
                    <p><strong>ID:</strong> {selectedPaymentForDetails.student.id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Title:</strong> {selectedPaymentForDetails.course.title}</p>
                    <p><strong>Course ID:</strong> {selectedPaymentForDetails.course.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Institution Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedPaymentForDetails.institution.name}</p>
                    <p><strong>ID:</strong> {selectedPaymentForDetails.institution.id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Amount:</strong> {formatCurrency(selectedPaymentForDetails.amount)}</p>
                    <p><strong>Commission:</strong> {formatCurrency(selectedPaymentForDetails.commissionAmount)}</p>
                    <p><strong>Institution Share:</strong> {formatCurrency(selectedPaymentForDetails.institutionAmount)}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Payment Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Method:</strong> {selectedPaymentForDetails.paymentMethod}</p>
                    <p><strong>Reference:</strong> {selectedPaymentForDetails.referenceNumber || 'N/A'}</p>
                    <p><strong>Booking ID:</strong> {selectedPaymentForDetails.bookingId || 'N/A'}</p>
                    <p><strong>Status:</strong> 
                      <Badge variant={getStatusBadgeVariant(selectedPaymentForDetails.status)} className="ml-2">
                        {selectedPaymentForDetails.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Created:</strong> {format(new Date(selectedPaymentForDetails.createdAt), 'PPP')}</p>
                    {selectedPaymentForDetails.paidAt && (
                      <p><strong>Paid:</strong> {format(new Date(selectedPaymentForDetails.paidAt), 'PPP')}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedPaymentForDetails.metadata && (
                <div>
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedPaymentForDetails.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 