import { prisma } from '../lib/prisma';

async function debugRevenueDiscrepancy() {
  try {
    console.log('Debugging revenue discrepancy for XYZ Language School...');
    
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
    console.log(`Subscription Plan: ${institution.subscriptionPlan}`);

    // Method 1: Dashboard calculation (using aggregate)
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
    console.log(`Aggregate institutionAmount: $${dashboardRevenue._sum.institutionAmount || 0}`);

    // Method 2: Analytics calculation (using reduce)
    const analyticsRevenue = institution.courses.reduce((sum, course) => {
      return sum + course.enrollments.reduce((enrollmentSum, enrollment) => {
        return enrollmentSum + enrollment.payments.reduce((paymentSum, payment) => {
          // Use institutionAmount if available, otherwise calculate it
          const institutionAmount = payment.institutionAmount || 
            (payment.amount ? payment.amount - (payment.amount * (institution.commissionRate || 0) / 100) : 0);
          return paymentSum + (institutionAmount || 0);
        }, 0);
      }, 0);
    }, 0);

    console.log(`\n=== ANALYTICS CALCULATION ===`);
    console.log(`Reduce calculation: $${analyticsRevenue}`);

    // Method 3: Raw payment data
    const payments = await prisma.payment.findMany({
      where: {
        institutionId: institution.id,
        status: 'COMPLETED'
      },
      include: {
        enrollment: {
          include: {
            course: true
          }
        }
      }
    });

    console.log(`\n=== RAW PAYMENT DATA ===`);
    console.log(`Total payments found: ${payments.length}`);
    
    let totalAmount = 0;
    let totalInstitutionAmount = 0;
    let calculatedInstitutionAmount = 0;

    payments.forEach((payment, index) => {
      const calculated = payment.amount ? payment.amount - (payment.amount * (institution.commissionRate || 0) / 100) : 0;
      
      console.log(`Payment ${index + 1}:`);
      console.log(`  - Amount: $${payment.amount}`);
      console.log(`  - InstitutionAmount (DB): $${payment.institutionAmount || 'NULL'}`);
      console.log(`  - Calculated InstitutionAmount: $${calculated}`);
      console.log(`  - Course: ${payment.enrollment.course.title}`);
      
      totalAmount += payment.amount || 0;
      totalInstitutionAmount += payment.institutionAmount || 0;
      calculatedInstitutionAmount += calculated;
    });

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total Amount (before commission): $${totalAmount}`);
    console.log(`Total InstitutionAmount (from DB): $${totalInstitutionAmount}`);
    console.log(`Total Calculated InstitutionAmount: $${calculatedInstitutionAmount}`);
    console.log(`Dashboard API result: $${dashboardRevenue._sum.institutionAmount || 0}`);
    console.log(`Analytics API result: $${analyticsRevenue}`);

    // Check if there are any payments with NULL institutionAmount
    const nullInstitutionAmountPayments = payments.filter(p => p.institutionAmount === null);
    if (nullInstitutionAmountPayments.length > 0) {
      console.log(`\n⚠️  WARNING: ${nullInstitutionAmountPayments.length} payments have NULL institutionAmount`);
      console.log('This could cause discrepancies between dashboard and analytics calculations.');
    }

  } catch (error) {
    console.error('Error debugging revenue discrepancy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugRevenueDiscrepancy(); 