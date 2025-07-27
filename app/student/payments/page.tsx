import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/utils';
import PaymentStatus from '../components/PaymentStatus';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, History, CreditCard } from 'lucide-react';
import PayCourseButton from '../components/PayCourseButton';

export default async function StudentPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Get recent payments (last 5)
  const recentPayments = await prisma.payment.findMany({
    where: {
      enrollment: {
        studentId: session.user.id
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
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

  // Get payment statistics
  const paymentStats = await prisma.payment.aggregate({
    where: {
      enrollment: {
        studentId: session.user.id
      }
    },
    _sum: {
      amount: true
    },
    _count: true
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button asChild variant="outline">
          <Link href="/student/payments/history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            View Full History
          </Link>
        </Button>
      </div>

      {/* Payment Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(paymentStats._sum.amount || 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              {paymentStats._count} payments made
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {recentPayments.length > 0 ? formatCurrency(recentPayments[0].amount) : formatCurrency(0)}
            </p>
            <p className="text-sm text-muted-foreground">
              Latest payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Payments</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/student/payments/history" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4">
          {recentPayments.map((payment) => (
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
              </CardContent>
            </Card>
          ))}
          {recentPayments.length === 0 && (
            <p className="text-center text-muted-foreground">
              No recent payments found
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 