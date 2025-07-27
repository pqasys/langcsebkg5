import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface PaymentStatusProps {
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  message?: string;
  details?: {
    enrollmentStatus?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function PaymentStatus({ status, message, details }: PaymentStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'FAILED':
        return 'text-red-600';
      case 'PENDING':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'COMPLETED':
        return 'Payment completed successfully';
      case 'FAILED':
        return 'Payment failed. Please try again.';
      case 'PENDING':
        return 'Payment is being processed...';
      default:
        return 'Unknown payment status';
    }
  };

  return (
    <Alert variant={status === 'FAILED' ? 'destructive' : 'default'}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <AlertDescription className={getStatusColor()}>
          {getStatusMessage()}
        </AlertDescription>
      </div>
      
      {details && (
        <div className="mt-2 space-y-1 text-sm">
          {details.enrollmentStatus && (
            <p>Enrollment Status: {details.enrollmentStatus}</p>
          )}
          {details.paymentStatus && (
            <p>Payment Status: {details.paymentStatus}</p>
          )}
          {details.startDate && (
            <p>Start Date: {new Date(details.startDate).toLocaleDateString()}</p>
          )}
          {details.endDate && (
            <p>End Date: {new Date(details.endDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </Alert>
  );
} 