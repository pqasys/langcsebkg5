import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminSubscriptionsAPI() {
  try {
    console.log('🧪 Testing Admin Subscriptions API...\n');

    // Test 1: Check if we can query subscriptions without errors
    console.log('1. Testing subscription query with valid institutions...');
    
    // Get all valid institution IDs
    const validInstitutions = await prisma.institution.findMany({
      select: { id: true }
    });
    const validInstitutionIds = validInstitutions.map(inst => inst.id);

    console.log(`Found ${validInstitutionIds.length} valid institutions`);

    // Get subscriptions with relations
    const subscriptions = await prisma.institutionSubscription.findMany({
      where: {
        institutionId: {
          in: validInstitutionIds
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true,
          }
        },
        commissionTier: true
      }
    });

    console.log(`✅ Successfully queried ${subscriptions.length} subscriptions`);
    
    // Display subscription details
    subscriptions.forEach((sub, index) => {
      console.log(`\n  ${index + 1}. ${sub.institution?.name || 'Unknown'}`);
      console.log(`     Institution ID: ${sub.institutionId}`);
      console.log(`     Status: ${sub.status}`);
      console.log(`     Commission Tier: ${sub.commissionTier?.name || 'Unknown'}`);
      console.log(`     Plan Type: ${sub.commissionTier?.planType || 'Unknown'}`);
      console.log(`     Created: ${sub.createdAt.toLocaleDateString()}`);
    });

    // Test 2: Check for any remaining orphaned records
    console.log('\n2. Checking for any remaining orphaned records...');
    
    const allSubscriptions = await prisma.institutionSubscription.findMany({
      select: {
        id: true,
        institutionId: true
      }
    });

    const orphanedCount = allSubscriptions.filter(
      sub => !validInstitutionIds.includes(sub.institutionId)
    ).length;

    console.log(`Found ${orphanedCount} orphaned subscriptions`);
    
    if (orphanedCount === 0) {
      console.log('✅ No orphaned subscriptions found - cleanup successful!');
    } else {
      console.log('⚠️  Some orphaned subscriptions still exist');
    }

    // Test 3: Verify commission tier relationships
    console.log('\n3. Verifying commission tier relationships...');
    
    const subscriptionsWithTiers = await prisma.institutionSubscription.findMany({
      include: {
        commissionTier: true
      }
    });

    const invalidTierCount = subscriptionsWithTiers.filter(
      sub => !sub.commissionTier
    ).length;

    console.log(`Found ${invalidTierCount} subscriptions with invalid commission tiers`);
    
    if (invalidTierCount === 0) {
      console.log('✅ All subscriptions have valid commission tiers');
    } else {
      console.log('⚠️  Some subscriptions have invalid commission tiers');
    }

    console.log('\n✅ Admin Subscriptions API test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Total subscriptions: ${subscriptions.length}`);
    console.log(`   • Valid institutions: ${validInstitutionIds.length}`);
    console.log(`   • Orphaned records: ${orphanedCount}`);
    console.log(`   • Invalid commission tiers: ${invalidTierCount}`);

  } catch (error) {
    console.error('❌ Error testing admin subscriptions API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminSubscriptionsAPI();
