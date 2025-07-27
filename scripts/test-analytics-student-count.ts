import { prisma } from '../lib/prisma';

async function testAnalyticsStudentCount() {
  try {
    console.log('Testing updated analytics API student count calculation...');
    
    // Find the specific institution
    const institution = await prisma.institution.findFirst({
      where: {
        name: 'XYZ Language School'
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
      console.log('XYZ Language School not found');
      return;
    }

    console.log(`\nInstitution: ${institution.name} (${institution.id})`);
    console.log(`Total Courses: ${institution.courses.length}`);

    // Calculate statistics exactly like the updated analytics API
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
        return enrollmentSum + enrollment.payments
          .filter(payment => payment.status === 'COMPLETED') // Only include completed payments
          .reduce((paymentSum, payment) => {
            // Use institutionAmount if available, otherwise calculate it
            const institutionAmount = payment.institutionAmount || 
              (payment.amount ? payment.amount - (payment.amount * (institution.commissionRate || 0) / 100) : 0);
            return paymentSum + (institutionAmount || 0);
          }, 0);
      }, 0);
    }, 0);

    console.log(`\n=== UPDATED ANALYTICS API CALCULATION ===`);
    console.log(`Course Count: ${courseCount}`);
    console.log(`Student Count: ${studentCount}`);
    console.log(`Total Revenue: $${totalRevenue}`);

    // Compare with old calculation
    const oldStudentCount = institution.users.length;
    console.log(`\n=== COMPARISON ===`);
    console.log(`Old Analytics API (institution.users): ${oldStudentCount}`);
    console.log(`New Analytics API (enrollments): ${studentCount}`);
    console.log(`Students API (enrollments): ${studentCount}`);
    
    if (oldStudentCount === studentCount) {
      console.log(`✅ Both old and new analytics calculations match`);
    } else {
      console.log(`❌ Old and new analytics calculations differ`);
      console.log(`   Old shows: ${oldStudentCount}`);
      console.log(`   New shows: ${studentCount}`);
    }

    // Test students API calculation for comparison
    const studentsEnrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: {
          in: courseIds
        }
      },
      select: {
        studentId: true
      }
    });
    const studentsUniqueIds = [...new Set(studentsEnrollments.map(e => e.studentId))];
    
    console.log(`\n=== STUDENTS API VERIFICATION ===`);
    console.log(`Students API count: ${studentsUniqueIds.length}`);
    
    if (studentCount === studentsUniqueIds.length) {
      console.log(`✅ Analytics and Students APIs now match!`);
    } else {
      console.log(`❌ Analytics and Students APIs still don't match`);
    }

  } catch (error) {
    console.error('Error testing analytics student count:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnalyticsStudentCount(); 