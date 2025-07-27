import { prisma } from '../lib/prisma';

async function debugAnalyticsCalculation() {
  try {
    console.log('Debugging analytics calculation step by step...');
    
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
            }
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

    let totalRevenue = 0;
    let courseIndex = 0;

    // Step through each course
    for (const course of institution.courses) {
      courseIndex++;
      console.log(`\n--- Course ${courseIndex}: ${course.title} ---`);
      console.log(`Enrollments: ${course.enrollments.length}`);
      
      let courseRevenue = 0;
      let enrollmentIndex = 0;

      // Step through each enrollment
      for (const enrollment of course.enrollments) {
        enrollmentIndex++;
        console.log(`  Enrollment ${enrollmentIndex}:`);
        console.log(`    Payments: ${enrollment.payments.length}`);
        
        let enrollmentRevenue = 0;
        let paymentIndex = 0;

        // Step through each payment
        for (const payment of enrollment.payments) {
          paymentIndex++;
          console.log(`      Payment ${paymentIndex}:`);
          console.log(`        Status: ${payment.status}`);
          console.log(`        Amount: $${payment.amount}`);
          console.log(`        InstitutionAmount: $${payment.institutionAmount || 'NULL'}`);
          
          if (payment.status === 'COMPLETED') {
            const institutionAmount = payment.institutionAmount || 
              (payment.amount ? payment.amount - (payment.amount * (institution.commissionRate || 0) / 100) : 0);
            
            console.log(`        Calculated InstitutionAmount: $${institutionAmount}`);
            enrollmentRevenue += institutionAmount || 0;
            console.log(`        Added to enrollment: $${institutionAmount}`);
          } else {
            console.log(`        Skipped (not completed)`);
          }
        }
        
        console.log(`    Enrollment ${enrollmentIndex} total: $${enrollmentRevenue}`);
        courseRevenue += enrollmentRevenue;
      }
      
      console.log(`  Course ${courseIndex} total: $${courseRevenue}`);
      totalRevenue += courseRevenue;
    }

    console.log(`\n=== FINAL RESULT ===`);
    console.log(`Total Revenue: $${totalRevenue}`);

    // Compare with dashboard calculation
    const dashboardRevenue = await prisma.payment.aggregate({
      where: {
        institutionId: institution.id,
        status: 'COMPLETED'
      },
      _sum: {
        institutionAmount: true
      }
    });

    console.log(`Dashboard Revenue: $${dashboardRevenue._sum.institutionAmount || 0}`);
    console.log(`Difference: $${totalRevenue - (dashboardRevenue._sum.institutionAmount || 0)}`);

    // Check for any duplicate payments or other issues
    const allPayments = await prisma.payment.findMany({
      where: {
        institutionId: institution.id
      },
      include: {
        enrollment: {
          include: {
            course: true
          }
        }
      }
    });

    console.log(`\n=== PAYMENT ANALYSIS ===`);
    console.log(`Total payments in database: ${allPayments.length}`);
    
    const completedPayments = allPayments.filter(p => p.status === 'COMPLETED');
    console.log(`Completed payments: ${completedPayments.length}`);
    
    const pendingPayments = allPayments.filter(p => p.status !== 'COMPLETED');
    console.log(`Non-completed payments: ${pendingPayments.length}`);
    
    if (pendingPayments.length > 0) {
      console.log('\nNon-completed payments:');
      pendingPayments.forEach((payment, index) => {
        console.log(`  ${index + 1}. Status: ${payment.status}, Amount: $${payment.amount}, Course: ${payment.enrollment.course.title}`);
      });
    }

  } catch (error) {
    console.error('Error debugging analytics calculation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAnalyticsCalculation(); 