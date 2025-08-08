import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrphanedSubscriptions() {
  try {
    console.log('🔍 Checking for orphaned institution subscriptions...\n');

    // Find subscriptions with null institutionId
    const orphanedSubscriptions = await prisma.institutionSubscription.findMany({
      where: {
        institutionId: null
      }
    });

    console.log(`Found ${orphanedSubscriptions.length} orphaned subscriptions:`);
    
    if (orphanedSubscriptions.length > 0) {
      orphanedSubscriptions.forEach((sub, index) => {
        console.log(`  ${index + 1}. ID: ${sub.id}`);
        console.log(`     Plan Type: ${sub.planType}`);
        console.log(`     Status: ${sub.status}`);
        console.log(`     Amount: $${sub.amount}`);
        console.log(`     Created: ${sub.createdAt}`);
        console.log('');
      });

      // Delete orphaned subscriptions
      console.log('🗑️ Deleting orphaned subscriptions...');
      const deleteResult = await prisma.institutionSubscription.deleteMany({
        where: {
          institutionId: null
        }
      });

      console.log(`✅ Deleted ${deleteResult.count} orphaned subscriptions`);
    } else {
      console.log('✅ No orphaned subscriptions found');
    }

    // Check for subscriptions with invalid institutionId (pointing to non-existent institutions)
    console.log('\n🔍 Checking for subscriptions with invalid institutionId...');
    
    const allSubscriptions = await prisma.institutionSubscription.findMany({
      select: {
        id: true,
        institutionId: true,
        planType: true,
        status: true
      }
    });

    const invalidSubscriptions = [];
    
    for (const sub of allSubscriptions) {
      if (sub.institutionId) {
        const institution = await prisma.institution.findUnique({
          where: { id: sub.institutionId }
        });
        
        if (!institution) {
          invalidSubscriptions.push(sub);
        }
      }
    }

    console.log(`Found ${invalidSubscriptions.length} subscriptions with invalid institutionId:`);
    
    if (invalidSubscriptions.length > 0) {
      invalidSubscriptions.forEach((sub, index) => {
        console.log(`  ${index + 1}. ID: ${sub.id}`);
        console.log(`     Invalid InstitutionId: ${sub.institutionId}`);
        console.log(`     Plan Type: ${sub.planType}`);
        console.log(`     Status: ${sub.status}`);
        console.log('');
      });

      // Delete subscriptions with invalid institutionId
      console.log('🗑️ Deleting subscriptions with invalid institutionId...');
      const invalidIds = invalidSubscriptions.map(sub => sub.id);
      const deleteResult = await prisma.institutionSubscription.deleteMany({
        where: {
          id: { in: invalidIds }
        }
      });

      console.log(`✅ Deleted ${deleteResult.count} subscriptions with invalid institutionId`);
    } else {
      console.log('✅ No subscriptions with invalid institutionId found');
    }

    // Verify the fix
    console.log('\n✅ Verification - Checking remaining subscriptions...');
    const remainingSubscriptions = await prisma.institutionSubscription.findMany({
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log(`Total remaining subscriptions: ${remainingSubscriptions.length}`);
    remainingSubscriptions.forEach((sub, index) => {
      console.log(`  ${index + 1}. ${sub.institution?.name || 'Unknown'} (${sub.institution?.id})`);
      console.log(`     Plan: ${sub.planType} - ${sub.status}`);
      console.log('');
    });

    console.log('✅ Orphaned subscription cleanup completed!');

  } catch (error) {
    console.error('❌ Error fixing orphaned subscriptions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOrphanedSubscriptions();
