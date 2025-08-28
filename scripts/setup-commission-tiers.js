const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Default commission tier configurations
const INSTRUCTOR_TIERS = [
  {
    tierName: 'BRONZE',
    displayName: 'Bronze Instructor',
    commissionRate: 65.0,
    minSessions: 0,
    maxSessions: 9,
    requirements: 'New instructors starting out',
    benefits: ['Basic commission rate', 'Access to platform tools'],
    color: '#CD7F32'
  },
  {
    tierName: 'SILVER',
    displayName: 'Silver Instructor',
    commissionRate: 70.0,
    minSessions: 10,
    maxSessions: 49,
    requirements: '10+ completed sessions',
    benefits: ['Higher commission rate', 'Priority support', 'Featured listings'],
    color: '#C0C0C0'
  },
  {
    tierName: 'GOLD',
    displayName: 'Gold Instructor',
    commissionRate: 75.0,
    minSessions: 50,
    maxSessions: 199,
    requirements: '50+ completed sessions, 4.5+ rating',
    benefits: ['Premium commission rate', 'Advanced analytics', 'Marketing support'],
    color: '#FFD700'
  },
  {
    tierName: 'PLATINUM',
    displayName: 'Platinum Instructor',
    commissionRate: 80.0,
    minSessions: 200,
    maxSessions: 999,
    requirements: '200+ completed sessions, 4.8+ rating',
    benefits: ['Highest commission rate', 'Dedicated support', 'Custom branding'],
    color: '#E5E4E2'
  },
  {
    tierName: 'DIAMOND',
    displayName: 'Diamond Instructor',
    commissionRate: 85.0,
    minSessions: 1000,
    maxSessions: null,
    requirements: '1000+ completed sessions, 4.9+ rating',
    benefits: ['Maximum commission rate', 'VIP support', 'Exclusive features'],
    color: '#B9F2FF'
  }
];

const HOST_TIERS = [
  {
    tierName: 'COMMUNITY',
    displayName: 'Community Host',
    commissionRate: 60.0,
    minConversations: 0,
    maxConversations: 4,
    requirements: 'New community hosts',
    benefits: ['Basic commission rate', 'Community access'],
    color: '#87CEEB'
  },
  {
    tierName: 'ACTIVE',
    displayName: 'Active Host',
    commissionRate: 65.0,
    minConversations: 5,
    maxConversations: 19,
    requirements: '5+ hosted conversations',
    benefits: ['Higher commission rate', 'Hosting tools'],
    color: '#32CD32'
  },
  {
    tierName: 'EXPERIENCED',
    displayName: 'Experienced Host',
    commissionRate: 70.0,
    minConversations: 20,
    maxConversations: 99,
    requirements: '20+ hosted conversations, 4.5+ rating',
    benefits: ['Premium commission rate', 'Advanced features'],
    color: '#FF8C00'
  },
  {
    tierName: 'PROFESSIONAL',
    displayName: 'Professional Host',
    commissionRate: 75.0,
    minConversations: 100,
    maxConversations: 499,
    requirements: '100+ hosted conversations, 4.8+ rating',
    benefits: ['High commission rate', 'Professional tools'],
    color: '#9370DB'
  },
  {
    tierName: 'MASTER',
    displayName: 'Master Host',
    commissionRate: 80.0,
    minConversations: 500,
    maxConversations: null,
    requirements: '500+ hosted conversations, 4.9+ rating',
    benefits: ['Maximum commission rate', 'VIP features'],
    color: '#FF1493'
  }
];

async function setupCommissionTiers() {
  console.log('🚀 Setting up commission tiers...\n');

  try {
    // Clear existing tiers
    await prisma.instructorCommissionTier.deleteMany({});
    await prisma.hostCommissionTier.deleteMany({});
    console.log('✅ Cleared existing tiers');

    // Create instructor tiers
    console.log('\n📚 Creating instructor tiers...');
    for (const tier of INSTRUCTOR_TIERS) {
      await prisma.instructorCommissionTier.create({
        data: {
          tierName: tier.tierName,
          displayName: tier.displayName,
          commissionRate: tier.commissionRate,
          minSessions: tier.minSessions,
          maxSessions: tier.maxSessions,
          requirements: tier.requirements,
          benefits: tier.benefits,
          color: tier.color,
          effectiveDate: new Date(),
          isActive: true,
          metadata: {
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            tierType: 'INSTRUCTOR'
          }
        }
      });
      console.log(`  ✅ Created ${tier.displayName} (${tier.commissionRate}%)`);
    }

    // Create host tiers
    console.log('\n💬 Creating host tiers...');
    for (const tier of HOST_TIERS) {
      await prisma.hostCommissionTier.create({
        data: {
          tierName: tier.tierName,
          displayName: tier.displayName,
          commissionRate: tier.commissionRate,
          minConversations: tier.minConversations,
          maxConversations: tier.maxConversations,
          requirements: tier.requirements,
          benefits: tier.benefits,
          color: tier.color,
          effectiveDate: new Date(),
          isActive: true,
          metadata: {
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            tierType: 'HOST'
          }
        }
      });
      console.log(`  ✅ Created ${tier.displayName} (${tier.commissionRate}%)`);
    }

    console.log('\n🎉 Commission tiers setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • ${INSTRUCTOR_TIERS.length} instructor tiers created`);
    console.log(`  • ${HOST_TIERS.length} host tiers created`);
    console.log('\n💡 Next steps:');
    console.log('  1. Review and adjust tier rates in the admin panel');
    console.log('  2. Assign tiers to existing instructors/hosts');
    console.log('  3. Configure automatic tier progression rules');

  } catch (error) {
    console.error('❌ Error setting up commission tiers:', error);
    throw error;
  }
}

async function main() {
  try {
    await setupCommissionTiers();
  } catch (error) {
    console.error('Failed to setup commission tiers:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupCommissionTiers, INSTRUCTOR_TIERS, HOST_TIERS };
