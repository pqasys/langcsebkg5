import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PaymentSuccessPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Get the latest payment for the user
  const payment = await prisma.payment.findFirst({
    where: {
      enrollment: {
        studentId: session.user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      enrollment: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!payment) {
    redirect('/student/courses');
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Course Details</h3>
              <p className="text-sm text-muted-foreground">
                {payment.enrollment.course.title}
              </p>
              <p className="text-lg font-semibold mt-2">
                ${payment.amount.toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Payment Details</h3>
              <p className="text-sm text-muted-foreground">
                Payment ID: {payment.paymentId}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(payment.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button asChild variant="outline">
                <Link href="/student/courses">View All Courses</Link>
              </Button>
              <Button asChild>
                <Link href={`/student/courses/${payment.enrollment.courseId}`}>
                  Go to Course
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 