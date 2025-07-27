import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Download, Mail, Bell } from "lucide-react";
import { format } from "date-fns";
import { handleSendInvoice, handleDownloadInvoice } from "@/lib/invoice-handlers";
import { toast } from "sonner";
import { MarkPaymentDialog } from './MarkPaymentDialog';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface EnrollmentStatusCardProps {
  enrollment: {
    id: string;
    status: string;
    paymentStatus: string;
    hasContentAccess: boolean;
    startDate: Date;
    endDate: Date;
    paymentAmount: number;
    invoiceNumber: string;
    paymentCompletedAt?: Date;
    student: {
      name: string;
      email: string;
    };
    course: {
      title: string;
      price: number;
    };
  };
  onSendInvoice?: () => void;
  onDownloadInvoice?: () => void;
}

export function EnrollmentStatusCard({ 
  enrollment, 
  onSendInvoice: onSendInvoiceProp, 
  onDownloadInvoice: onDownloadInvoiceProp 
}: EnrollmentStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-green-500';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSendInvoiceClick = async () => {
    if (onSendInvoiceProp) {
      await onSendInvoiceProp();
    } else {
      await handleSendInvoice(enrollment.id);
    }
  };

  const handleDownloadInvoiceClick = async () => {
    if (onDownloadInvoiceProp) {
      await onDownloadInvoiceProp();
    } else {
      await handleDownloadInvoice(enrollment.id);
    }
  };

  const handleSendReminder = async () => {
    try {
      const response = await fetch(`/api/institution/enrollments/${enrollment.id}/reminder`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reminder');
      }

      const data = await response.json();
      toast.success(`Payment reminder sent. Due in ${data.daysUntilDue} days.`);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to sending reminder:. Please try again or contact support if the problem persists.`));
      toast.error(error instanceof Error ? error.message : 'Failed to send reminder');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Enrollment Details</span>
          <div className="flex gap-2">
            <Badge className={getStatusColor(enrollment.status)}>
              {enrollment.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPaymentStatusColor(enrollment.paymentStatus)}>
              {enrollment.paymentStatus}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Student</p>
              <p className="font-medium">{enrollment.student.name}</p>
              <p className="text-sm text-gray-500">{enrollment.student.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Course</p>
              <p className="font-medium">{enrollment.course.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(enrollment.startDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(enrollment.endDate), 'PPP')}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Details</p>
                <p className="font-medium">${enrollment.paymentAmount}</p>
                <p className="text-sm text-gray-500">Invoice: {enrollment.invoiceNumber}</p>
                {enrollment.paymentCompletedAt && (
                  <p className="text-sm text-gray-500">
                    Paid on: {format(new Date(enrollment.paymentCompletedAt), 'PPP')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {enrollment.paymentStatus === 'PENDING' && (
                  <Button 
                    variant="outline" 
                    onClick={handleSendReminder}
                    className="flex items-center"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleSendInvoiceClick}
                  className="flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invoice
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadInvoiceClick}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {enrollment.paymentStatus === 'PENDING' && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-yellow-800">
                Payment is pending. The student will not have access to course content until payment is completed.
              </p>
            </div>
          )}

          {enrollment.paymentStatus !== 'PAID' && (
            <div className="flex justify-end">
              <MarkPaymentDialog
                enrollmentId={enrollment.id}
                courseTitle={enrollment.course.title}
                amount={enrollment.course.price}
                trigger={
                  <Button variant="outline" size="sm">
                    Mark as Paid
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 