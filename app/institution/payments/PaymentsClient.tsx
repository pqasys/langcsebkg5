'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MarkPaymentDialog } from '@/components/institution/MarkPaymentDialog';
import { PayoutDialog } from '@/components/institution/PayoutDialog';
import { Button } from '@/components/ui/button';

interface PaymentsClientProps {
  payments: unknown[];
  pendingEnrollments: unknown[];
  pendingPayouts: unknown[];
}

export function PaymentsClient({
  payments,
  pendingEnrollments,
  pendingPayouts,
}: PaymentsClientProps) {
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);

  const totalPendingAmount = pendingPayouts.reduce(
    (sum, payout) => sum + payout.amount,
    0
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Payments Management</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total pending amount
                </p>
                <p className="text-2xl font-bold">
                  ${totalPendingAmount.toFixed(2)}
                </p>
              </div>
              <Badge variant="outline">
                {pendingPayouts.length} pending payouts
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="payouts">Pending Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-6">
            {pendingEnrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{enrollment.course.title}</span>
                    <Badge variant="outline">Pending</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Student</h3>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.student.name} ({enrollment.student.email})
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Amount</h3>
                      <p className="text-sm text-muted-foreground">
                        ${enrollment.course.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Enrollment Date</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(enrollment.createdAt)}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <MarkPaymentDialog
                        enrollmentId={enrollment.id}
                        courseTitle={enrollment.course.title}
                        amount={enrollment.course.price}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingEnrollments.length === 0 && (
              <p className="text-center text-muted-foreground">
                No pending payments
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid gap-6">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{payment.enrollment.course.title}</span>
                    <Badge
                      className={
                        payment.status === 'COMPLETED'
                          ? 'bg-green-500'
                          : payment.status === 'REFUNDED'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Student</h3>
                      <p className="text-sm text-muted-foreground">
                        {payment.enrollment.student.name} (
                        {payment.enrollment.student.email})
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Payment Amount</h3>
                      <p className="text-sm text-muted-foreground">
                        ${payment.amount.toFixed(2)} {payment.currency || 'USD'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Commission</h3>
                      <p className="text-sm text-muted-foreground">
                        ${payment.metadata?.commissionAmount?.toFixed(2) || '0.00'} (
                        {payment.metadata?.commissionRate || '0'}%)
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Your Share</h3>
                      <p className="text-sm font-semibold text-green-600">
                        ${payment.metadata?.institutionAmount?.toFixed(2) || payment.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">
                        {payment.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Date</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    {payment.metadata?.referenceNumber && (
                      <div>
                        <h3 className="text-sm font-medium">Reference Number</h3>
                        <p className="text-sm text-muted-foreground">
                          {payment.metadata.referenceNumber}
                        </p>
                      </div>
                    )}
                    {payment.metadata?.notes && (
                      <div>
                        <h3 className="text-sm font-medium">Notes</h3>
                        <p className="text-sm text-muted-foreground">
                          {payment.metadata.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {payments.length === 0 && (
              <p className="text-center text-muted-foreground">
                No payment history
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payouts">
          <div className="grid gap-6">
            {pendingPayouts.map((payout) => (
              <Card key={payout.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{payout.enrollment.course.title}</span>
                    <Badge variant="outline">Pending Payout</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Student</h3>
                      <p className="text-sm text-muted-foreground">
                        {payout.enrollment.student.name} (
                        {payout.enrollment.student.email})
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Amount Due</h3>
                      <p className="text-sm text-muted-foreground">
                        ${payout.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Payment Date</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payout.enrollment.paymentDate!)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">
                        {payout.metadata?.paymentMethod}
                      </p>
                    </div>
                    {payout.metadata?.paymentId && (
                      <div>
                        <h3 className="text-sm font-medium">Payment ID</h3>
                        <p className="text-sm text-muted-foreground">
                          {payout.metadata.paymentId}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setSelectedPayout(payout.id)}
                        variant="outline"
                      >
                        Mark as Paid
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingPayouts.length === 0 && (
              <p className="text-center text-muted-foreground">
                No pending payouts
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPayout && (
        <PayoutDialog
          payout={pendingPayouts.find((p) => p.id === selectedPayout)!}
          open={!!selectedPayout}
          onOpenChange={(open) => !open && setSelectedPayout(null)}
        />
      )}
    </div>
  );
} 