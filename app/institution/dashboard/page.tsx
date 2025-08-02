import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export default async function InstitutionDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.institutionId) {
    redirect('/auth/signin');
  }

  // Get statistics
  const [
    totalCourses,
    totalEnrollments,
    totalCompletions,
    totalRevenue,
    pendingPayments,
    recentEnrollments,
    recentStudents
  ] = await Promise.all([
    prisma.course.count({
      where: {
        institutionId: session.user.institutionId
      }
    }),
    // Get course IDs for this institution first, then count enrollments
    prisma.course.findMany({
      where: {
        institutionId: session.user.institutionId
      },
      select: {
        id: true
      }
    }).then(courses => {
      const courseIds = courses.map(c => c.id);
      return prisma.studentCourseEnrollment.count({
        where: {
          courseId: {
            in: courseIds
          }
        }
      });
    }),
    // Get course IDs for this institution first, then count completions
    prisma.course.findMany({
      where: {
        institutionId: session.user.institutionId
      },
      select: {
        id: true
      }
    }).then(courses => {
      const courseIds = courses.map(c => c.id);
      return prisma.studentCourseCompletion.count({
        where: {
          courseId: {
            in: courseIds
          }
        }
      });
    }),
    // Calculate total revenue from completed payments
    prisma.payment.aggregate({
      where: {
        institutionId: session.user.institutionId,
        status: 'COMPLETED'
      },
      _sum: {
        institutionAmount: true
      }
    }).then(result => result._sum.institutionAmount || 0),
    // Count pending payments
    prisma.payment.count({
      where: {
        institutionId: session.user.institutionId,
        status: { in: ['PENDING', 'PROCESSING', 'INITIATED'] }
      }
    }),
    // Get course IDs first, then get recent enrollments
    prisma.course.findMany({
      where: {
        institutionId: session.user.institutionId
      },
      select: {
        id: true
      }
    }).then(courses => {
      const courseIds = courses.map(c => c.id);
      return prisma.studentCourseEnrollment.findMany({
        take: 10,
        where: {
          courseId: {
            in: courseIds
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          createdAt: true,
          status: true,
          paymentStatus: true,
          courseId: true,
          studentId: true
        }
      });
    }),
    // Get course IDs first, then get recent students
    prisma.course.findMany({
      where: {
        institutionId: session.user.institutionId
      },
      select: {
        id: true
      }
    }).then(courses => {
      const courseIds = courses.map(c => c.id);
      return prisma.studentCourseEnrollment.findMany({
        where: {
          courseId: {
            in: courseIds
          }
        },
        select: {
          studentId: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }).then(enrollments => {
        const studentIds = enrollments.map(e => e.studentId);
        return prisma.student.findMany({
          where: {
            id: {
              in: studentIds
            }
          },
          orderBy: {
            created_at: 'desc'
          },
          select: {
            id: true,
            email: true,
            name: true,
            created_at: true,
            status: true
          }
        });
      });
    })
  ]);

  // Get recent enrollments with details
  const recentEnrollmentsWithDetails = await Promise.all(
    recentEnrollments.map(async (enrollment) => {
      const [student, course, payments] = await Promise.all([
        prisma.student.findUnique({
          where: { id: enrollment.studentId },
          select: { id: true, name: true, email: true }
        }),
        prisma.course.findUnique({
          where: { id: enrollment.courseId },
          select: {
            id: true,
            title: true,
            base_price: true,
            institution: {
              select: { commissionRate: true }
            }
          }
        }),
        prisma.payment.findMany({
          where: { enrollmentId: enrollment.id },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      return {
        ...enrollment,
        student,
        course,
        payments
      };
    })
  );

  // Calculate recent enrollments with payment breakdown (show all enrollments, not just paid ones)
  const recentEnrollmentsWithPayment = recentEnrollmentsWithDetails
    .filter(enrollment => enrollment.student && enrollment.course) // Filter out enrollments without valid student or course data
    .slice(0, 5)
    .map(enrollment => {
      const payment = enrollment.payments[0];
      const institutionAmount = payment?.metadata?.institutionAmount || 
        (payment ? payment.amount - (payment.amount * enrollment.course.institution.commissionRate / 100) : 0);
      
      return {
        ...enrollment,
        paymentAmount: payment?.amount || 0,
        institutionAmount,
        commissionAmount: payment?.metadata?.commissionAmount || 0,
        paymentStatus: payment?.status || 'NO_PAYMENT',
        paymentMethod: payment?.paymentMethod || null,
      };
    });

  // Get additional data for recent students
  const recentStudentsWithEnrollments = await Promise.all(
    recentStudents.map(async (student) => {
      // First get course IDs for this institution
      const institutionCourses = await prisma.course.findMany({
        where: {
          institutionId: session.user.institutionId
        },
        select: {
          id: true
        }
      });
      
      const courseIds = institutionCourses.map(c => c.id);
      
      const studentEnrollments = await prisma.studentCourseEnrollment.findMany({
        where: {
          studentId: student.id,
          courseId: {
            in: courseIds
          }
        },
        select: {
          id: true,
          studentId: true,
          courseId: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Get course details for the enrollments
      const enrollmentCourseIds = studentEnrollments.map(e => e.courseId);
      const courses = await prisma.course.findMany({
        where: {
          id: {
            in: enrollmentCourseIds
          }
        },
        select: {
          id: true,
          title: true
        }
      });

      // Create a map for quick lookup
      const courseMap = new Map(courses.map(c => [c.id, c]));

      // Add course data to enrollments
      const enrollmentsWithCourseData = studentEnrollments.map(enrollment => ({
        ...enrollment,
        course: courseMap.get(enrollment.courseId)
      }));

      return {
        ...student,
        enrollmentCount: studentEnrollments.length,
        latestEnrollment: enrollmentsWithCourseData[0]
      };
    })
  );

  // Get pending payments for this institution
  const pendingPaymentsList = await prisma.payment.findMany({
    where: {
      institutionId: session.user.institutionId,
      status: { in: ['PENDING', 'PROCESSING', 'INITIATED'] }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  // Get enrollment IDs from payments
  const enrollmentIds = [...new Set(pendingPaymentsList.map(p => p.enrollmentId))];

  // Get enrollments with course and student details
  const enrollmentsWithDetails = await prisma.studentCourseEnrollment.findMany({
    where: {
      id: {
        in: enrollmentIds
      }
    },
    select: {
      id: true,
      studentId: true,
      courseId: true,
      course: {
        select: {
          title: true,
          institution: {
            select: {
              commissionRate: true
            }
          }
        }
      }
    }
  });

  // Get student IDs from enrollments
  const studentIds = [...new Set(enrollmentsWithDetails.map(e => e.studentId))];

  // Get student details
  const students = await prisma.student.findMany({
    where: {
      id: {
        in: studentIds
      }
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  // Create a map for quick lookup
  const enrollmentMap = new Map(enrollmentsWithDetails.map(e => [e.id, e]));
  const studentMap = new Map(students.map(s => [s.id, s]));

  // Combine payments with enrollment and student details
  const validPendingPayments = pendingPaymentsList
    .map(payment => {
      const enrollment = enrollmentMap.get(payment.enrollmentId);
      const student = studentMap.get(enrollment?.studentId || '');
      
      if (!enrollment || !student) {
        return null;
      }

      return {
        ...payment,
        enrollment: {
          id: enrollment.id,
          course: enrollment.course,
          student: student
        },
        student: student
      };
    })
    .filter(Boolean);

  return (
    <DashboardClient
      totalCourses={totalCourses}
      totalEnrollments={totalEnrollments}
      totalCompletions={totalCompletions}
      totalRevenue={totalRevenue}
      pendingPayments={pendingPayments}
      recentEnrollmentsWithPayment={recentEnrollmentsWithPayment}
      validPendingPayments={validPendingPayments}
      recentStudentsWithEnrollments={recentStudentsWithEnrollments}
    />
  );
} 