import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/utils';
import PaymentStatus from '../../components/PaymentStatus';
import PayCourseButton from '../../components/PayCourseButton';

export default async function PaymentHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const payments = await prisma.payment.findMany({
    where: {
      enrollment: {
        studentId: session.user.id
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      enrollment: {
        select: {
          course: {
            select: {
              title: true,
              institution: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment History</h1>
      </div>

      <div className="grid gap-6">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {payment.enrollment?.course.title || 'Course Payment'}
                </span>
                <PaymentStatus payment={payment} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="text-sm font-medium">Amount</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(payment.amount)}
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
                    <h3 className="text-sm font-medium">Reference</h3>
                    <p className="text-sm text-muted-foreground">
                      {payment.metadata.referenceNumber}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium">Institution</h3>
                  <p className="text-sm text-muted-foreground">
                    {payment.enrollment?.course.institution.name || 'N/A'}
                  </p>
                </div>
              </div>
              {payment.status === 'PENDING' && payment.enrollment?.course && (
                <div className="mt-4 flex justify-end">
                  <PayCourseButton
                    courseId={payment.enrollment.courseId}
                    amount={payment.amount}
                    courseTitle={payment.enrollment.course.title}
                    institutionName={payment.enrollment.course.institution?.name || 'N/A'}
                    initialPaymentStatus={{
                      status: 'pending',
                      message: 'Payment is being processed...',
                      details: {
                        paymentStatus: payment.status,
                        enrollmentStatus: payment.enrollment.status
                      }
                    }}
                  />
                </div>
              )}
              {payment.notes && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium">Notes</h3>
                  <p className="text-sm text-muted-foreground">{payment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {payments.length === 0 && (
          <p className="text-center text-muted-foreground">
            No payment history found
          </p>
        )}
      </div>
    </div>
  );
} 