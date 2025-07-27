import { prisma } from '../lib/prisma';

async function testAnalyticsAPI() {
  try {
    console.log('Testing the actual analytics API calculation...');
    
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
    console.log(`Commission Rate: ${institution.commissionRate}%`);
    console.log(`Total Courses: ${institution.courses.length}`);

    // Calculate statistics exactly like the analytics API
    const courseCount = institution.courses.length;
    const studentCount = institution.users.length;
    
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

    console.log(`\n=== ANALYTICS API CALCULATION ===`);
    console.log(`Course Count: ${courseCount}`);
    console.log(`Student Count: ${studentCount}`);
    console.log(`Total Revenue: $${totalRevenue}`);

    // Also calculate the old way for comparison
    const oldTotalRevenue = institution.courses.reduce((sum, course) => {
      return sum + course.enrollments.reduce((enrollmentSum, enrollment) => {
        return enrollmentSum + enrollment.payments.reduce((paymentSum, payment) => {
          return paymentSum + (payment.amount || 0);
        }, 0);
      }, 0);
    }, 0);

    console.log(`\n=== OLD CALCULATION (for comparison) ===`);
    console.log(`Old Total Revenue: $${oldTotalRevenue}`);

    // Dashboard calculation for comparison
    const dashboardRevenue = await prisma.payment.aggregate({
      where: {
        institutionId: institution.id,
        status: 'COMPLETED'
      },
      _sum: {
        institutionAmount: true
      }
    });

    console.log(`\n=== DASHBOARD CALCULATION ===`);
    console.log(`Dashboard Revenue: $${dashboardRevenue._sum.institutionAmount || 0}`);

    console.log(`\n=== COMPARISON ===`);
    console.log(`Analytics API: $${totalRevenue}`);
    console.log(`Dashboard API: $${dashboardRevenue._sum.institutionAmount || 0}`);
    console.log(`Old Calculation: $${oldTotalRevenue}`);
    
    if (totalRevenue === dashboardRevenue._sum.institutionAmount) {
      console.log(`✅ Analytics and Dashboard match!`);
    } else {
      console.log(`❌ Analytics and Dashboard don't match!`);
    }

  } catch (error) {
    console.error('Error testing analytics API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnalyticsAPI(); 