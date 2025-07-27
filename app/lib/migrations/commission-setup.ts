import { prisma } from '@/lib/prisma';
// import { toast } from 'sonner';

export async function setupCommissionRates() {
  try {
    // Get all institutions
    const institutions = await prisma.institution.findMany();

    // Create commission rates for each institution
    for (const institution of institutions) {
      // Check if institution already has a commission rate
      const existingCommission = await prisma.institutionCommission.findFirst({
        where: {
          institutionId: institution.id,
          isActive: true,
        },
      });

      if (!existingCommission) {
        // Create default commission rate (can be adjusted as needed)
        await prisma.institutionCommission.create({
          data: {
            institutionId: institution.id,
            rate: 10, // Default 10% commission rate
            isActive: true,
          },
        });
      }
    }

    // // // // // // // // // console.log('Commission rates setup completed successfully');
  } catch (error) {
    console.error('Error setting up commission rates:', error);
    throw error;
  }
}

// Function to calculate and update commission for existing payments
export async function updateExistingPayments() {
  try {
    // Get all completed payments
    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
      },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                institution: true,
              },
            },
          },
        },
      },
    });

    for (const payment of payments) {
      // Get institution's commission rate
      const commission = await prisma.institutionCommission.findFirst({
        where: {
          institutionId: payment.enrollment.course.institution.id,
          isActive: true,
        },
      });

      if (commission) {
        // Calculate commission amounts
        const commissionAmount = (payment.amount * commission.rate) / 100;
        const institutionAmount = payment.amount - commissionAmount;

        // Update payment metadata
        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            metadata: {
              ...payment.metadata,
              commissionAmount,
              commissionRate: commission.rate,
              institutionAmount,
            },
          },
        });

        // Create payout record if it doesn't exist
        const existingPayout = await prisma.institutionPayout.findFirst({
          where: {
            enrollmentId: payment.enrollment.id,
          },
        });

        if (!existingPayout) {
          await prisma.institutionPayout.create({
            data: {
              institutionId: payment.enrollment.course.institution.id,
              enrollmentId: payment.enrollment.id,
              amount: institutionAmount,
              status: 'PAID', // Mark as paid since payment is already completed
              metadata: {
                paymentId: payment.id,
                paymentMethod: payment.metadata?.paymentMethod || 'UNKNOWN',
                processedAt: payment.paidAt?.toISOString(),
              },
            },
          });
        }
      }
    }

    console.log('Existing payments updated successfully');
  } catch (error) {
    console.error('Error updating existing payments:', error);
    throw error;
  }
}

// Function to run all migrations
export async function runCommissionMigrations() {
  try {
    await setupCommissionRates();
    await updateExistingPayments();
    console.log('All commission migrations completed successfully');
  } catch (error) {
    console.error('Error running commission migrations:', error);
    throw error;
  }
} 