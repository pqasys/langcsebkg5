'use client';

import { Badge } from '@/components/ui/badge';

interface PaymentStatusProps {
  payment: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    amount: number;
    currency: string;
  };
}

export default function PaymentStatus({ payment }: PaymentStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
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
    <div className="flex items-center gap-2">
      <Badge className={getStatusColor(payment.status)}>
        {payment.status}
      </Badge>
      <span className="text-sm text-muted-foreground">
        {payment.amount} {payment.currency}
      </span>
    </div>
  );
} 