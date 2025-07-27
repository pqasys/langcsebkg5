import { prisma } from '../lib/prisma';

async function testAnalyticsAPI() {
  try {
    console.log('Testing institution analytics stats API...');
    
    // Get a test institution
    const institution = await prisma.institution.findFirst({
      where: {
        isApproved: true,
        status: 'ACTIVE'
      },
      include: {
        courses: {
          include: {
            enrollments: {
              include: {
                payments: true
              }
            },
            completions: true,
            bookings: true
          }
        },
        users: {
          where: {
            role: 'STUDENT'
          }
        }
      }
    });

    if (!institution) {
      console.log('No test institution found');
      return;
    }

    console.log(`Testing with institution: ${institution.name} (${institution.id})`);
    
    // Calculate statistics
    const courseCount = institution.courses.length;
    
    // Calculate student count based on enrollments (same logic as students API)
    const courseIds = institution.courses.map(c => c.id);
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: {
          in: courseIds
        }
      },
      select: {
        studentId: true
      }
    });
    const uniqueStudentIds = [...new Set(enrollments.map(e => e.studentId))];
    const studentCount = uniqueStudentIds.length;
    
    // Calculate total revenue from completed payments (institution amount after commission)
    const totalRevenue = institution.courses.reduce((sum, course) => {
      return sum + course.enrollments.reduce((enrollmentSum, enrollment) => {
        return enrollmentSum + enrollment.payments.reduce((paymentSum, payment) => {
          // Use institutionAmount if available, otherwise calculate it
          const institutionAmount = payment.institutionAmount || 
            (payment.amount ? payment.amount - (payment.amount * (institution.commissionRate || 0) / 100) : 0);
          return paymentSum + (institutionAmount || 0);
        }, 0);
      }, 0);
    }, 0);

    // Calculate priority score
    let priorityScore = 0;
    if (institution.isFeatured) priorityScore += 1000;
    
    const planBonus = {
      'BASIC': 0,
      'PROFESSIONAL': 100,
      'ENTERPRISE': 200
    };
    priorityScore += planBonus[institution.subscriptionPlan as keyof typeof planBonus] || 0;
    priorityScore += (institution.commissionRate || 0) * 5;

    const stats = {
      courseCount,
      studentCount,
      totalRevenue,
      subscriptionPlan: institution.subscriptionPlan,
      isFeatured: institution.isFeatured,
      commissionRate: institution.commissionRate,
      priorityScore
    };

    console.log('Analytics stats calculated successfully:');
    console.log(JSON.stringify(stats, null, 2));
    
    console.log('\nCourse details:');
    institution.courses.forEach(course => {
      console.log(`- ${course.title}: ${course.enrollments.length} enrollments, ${course.enrollments.reduce((sum, e) => sum + e.payments.length, 0)} payments`);
    });

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing analytics API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnalyticsAPI(); 