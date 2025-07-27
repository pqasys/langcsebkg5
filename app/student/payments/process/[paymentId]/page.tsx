import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import PaymentStatus from '@/app/components/PaymentStatus';

interface PaymentProcessPageProps {
  params: {
    paymentId: string;
  };
}

export default async function PaymentProcessPage({
  params,
}: PaymentProcessPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: params.paymentId,
      enrollment: {
        studentId: session.user.id,
      },
    },
    include: {
      enrollment: {
        select: {
          course: {
            select: {
              title: true,
              institution: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!payment) {
    redirect('/student/payments');
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payment Details</span>
            <PaymentStatus payment={payment} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Course</h3>
              <p className="text-sm text-muted-foreground">
                {payment.enrollment?.course.title}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Institution</h3>
              <p className="text-sm text-muted-foreground">
                {payment.enrollment?.course.institution.name}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Amount</h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(payment.amount)}
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
          </div>

          {/* TODO: Add payment gateway integration here (see roadmap: 'Payment System - payment gateway integration') */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              Payment gateway integration coming soon. For now, this is a mock payment page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 