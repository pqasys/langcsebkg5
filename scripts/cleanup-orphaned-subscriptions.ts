import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupOrphanedSubscriptions() {
  try {
    console.log('🔍 Checking for orphaned institution subscriptions...\n');

    // Get all valid institution IDs
    const validInstitutions = await prisma.institution.findMany({
      select: { id: true }
    });
    const validInstitutionIds = new Set(validInstitutions.map(inst => inst.id));

    console.log(`Found ${validInstitutionIds.size} valid institutions`);

    // Get all subscriptions
    const allSubscriptions = await prisma.institutionSubscription.findMany({
      select: {
        id: true,
        institutionId: true,
        status: true,
        createdAt: true,
        commissionTierId: true
      }
    });

    console.log(`Found ${allSubscriptions.length} total subscriptions`);

    // Find orphaned subscriptions (those with invalid institutionId)
    const orphanedSubscriptions = allSubscriptions.filter(
      sub => !validInstitutionIds.has(sub.institutionId)
    );

    console.log(`Found ${orphanedSubscriptions.length} orphaned subscriptions:`);
    
    if (orphanedSubscriptions.length > 0) {
      orphanedSubscriptions.forEach((sub, index) => {
        console.log(`  ${index + 1}. ID: ${sub.id}`);
        console.log(`     Invalid InstitutionId: ${sub.institutionId}`);
        console.log(`     Status: ${sub.status}`);
        console.log(`     CommissionTierId: ${sub.commissionTierId}`);
        console.log(`     Created: ${sub.createdAt}`);
        console.log('');
      });

      // Delete orphaned subscriptions
      console.log('🗑️ Deleting orphaned subscriptions...');
      const orphanedIds = orphanedSubscriptions.map(sub => sub.id);
      const deleteResult = await prisma.institutionSubscription.deleteMany({
        where: {
          id: { in: orphanedIds }
        }
      });

      console.log(`✅ Deleted ${deleteResult.count} orphaned subscriptions`);
    } else {
      console.log('✅ No orphaned subscriptions found');
    }

    // Verify the cleanup
    console.log('\n✅ Verification - Checking remaining subscriptions...');
    const remainingSubscriptions = await prisma.institutionSubscription.findMany({
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        },
        commissionTier: {
          select: {
            id: true,
            planType: true,
            name: true
          }
        }
      }
    });

    console.log(`Total remaining subscriptions: ${remainingSubscriptions.length}`);
    remainingSubscriptions.forEach((sub, index) => {
      console.log(`  ${index + 1}. ${sub.institution?.name || 'Unknown'} (${sub.institution?.id})`);
      console.log(`     Plan: ${sub.commissionTier?.planType || 'Unknown'} - ${sub.status}`);
      console.log(`     Tier: ${sub.commissionTier?.name || 'Unknown'}`);
      console.log('');
    });

    console.log('✅ Orphaned subscription cleanup completed!');

  } catch (error) {
    console.error('❌ Error cleaning up orphaned subscriptions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedSubscriptions();
