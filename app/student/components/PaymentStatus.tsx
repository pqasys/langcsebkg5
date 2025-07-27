'use client';

import { Badge } from '@/components/ui/badge';
import { Payment } from '@prisma/client';

interface PaymentStatusProps {
  payment: Payment;
}

export default function PaymentStatus({ payment }: PaymentStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-500';
      case 'REFUNDED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={getStatusColor(payment.status)}>
      {payment.status}
    </Badge>
  );
} 