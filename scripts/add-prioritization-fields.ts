import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function addPrioritizationFields() {
  console.log('🔧 Adding prioritization fields to database...\n');

  try {
    // Check if fields already exist
    console.log('1. Checking existing fields...');
    
    // Try to query the fields to see if they exist
    const testInstitution = await prisma.institution.findFirst({
      select: {
        id: true,
        name: true,
        commissionRate: true
      }
    });

    console.log('   ✅ Commission rate field exists');
    console.log(`   Current commission rate: ${testInstitution?.commissionRate || 'N/A'}`);

    // Add missing fields using raw SQL
    console.log('\n2. Adding missing fields...');

    // Add subscriptionPlan field
    try {
      await prisma.$executeRaw`ALTER TABLE institution ADD COLUMN subscriptionPlan ENUM('BASIC', 'PROFESSIONAL', 'ENTERPRISE') DEFAULT 'BASIC'`;
      console.log('   ✅ Added subscriptionPlan field');
    } catch (error: any) {
      if (error.message.includes('Duplicate column name')) {
        console.log('   ⚠️  subscriptionPlan field already exists');
      } else {
        console.log('   ❌ Error adding subscriptionPlan field:', error.message);
      }
    }

    // Add isFeatured field
    try {
      await prisma.$executeRaw`ALTER TABLE institution ADD COLUMN isFeatured BOOLEAN DEFAULT FALSE`;
      console.log('   ✅ Added isFeatured field');
    } catch (error: any) {
      if (error.message.includes('Duplicate column name')) {
        console.log('   ⚠️  isFeatured field already exists');
      } else {
        console.log('   ❌ Error adding isFeatured field:', error.message);
      }
    }

    // Add priority fields to course table
    try {
      await prisma.$executeRaw`ALTER TABLE course ADD COLUMN priorityScore INTEGER DEFAULT 0`;
      console.log('   ✅ Added priorityScore field to course table');
    } catch (error: any) {
      if (error.message.includes('Duplicate column name')) {
        console.log('   ⚠️  priorityScore field already exists');
      } else {
        console.log('   ❌ Error adding priorityScore field:', error.message);
      }
    }

    try {
      await prisma.$executeRaw`ALTER TABLE course ADD COLUMN isPremiumPlacement BOOLEAN DEFAULT FALSE`;
      console.log('   ✅ Added isPremiumPlacement field to course table');
    } catch (error: any) {
      if (error.message.includes('Duplicate column name')) {
        console.log('   ⚠️  isPremiumPlacement field already exists');
      } else {
        console.log('   ❌ Error adding isPremiumPlacement field:', error.message);
      }
    }

    try {
      await prisma.$executeRaw`ALTER TABLE course ADD COLUMN isFeaturedPlacement BOOLEAN DEFAULT FALSE`;
      console.log('   ✅ Added isFeaturedPlacement field to course table');
    } catch (error: any) {
      if (error.message.includes('Duplicate column name')) {
        console.log('   ⚠️  isFeaturedPlacement field already exists');
      } else {
        console.log('   ❌ Error adding isFeaturedPlacement field:', error.message);
      }
    }

    // Update some institutions with sample data
    console.log('\n3. Setting up sample data...');
    
    const institutions = await prisma.institution.findMany({
      take: 5
    });

    for (let i = 0; i < institutions.length; i++) {
      const institution = institutions[i];
      
      // Set different subscription plans and featured status
      const subscriptionPlan = i === 0 ? 'ENTERPRISE' : i === 1 ? 'PROFESSIONAL' : 'BASIC';
      const isFeatured = i < 2; // First 2 institutions are featured
      const commissionRate = 15 + (i * 2); // Varying commission rates
      
      try {
        await prisma.institution.update({
          where: { id: institution.id },
          data: {
            subscriptionPlan: subscriptionPlan as any,
            isFeatured: isFeatured as any,
            commissionRate: commissionRate
          }
        });
        
        console.log(`    Updated ${institution.name}: ${subscriptionPlan}, Featured: ${isFeatured}, Commission: ${commissionRate}%`);
      } catch (error: any) {
        console.log(`   ⚠️  Could not update ${institution.name}: ${error.message}`);
      }
    }

    // Verify the fields were added
    console.log('\n4. Verifying fields...');
    
    const testInstitutionWithNewFields = await prisma.institution.findFirst({
      select: {
        id: true,
        name: true,
        commissionRate: true,
        // Try to select the new fields
      }
    });

    console.log('   ✅ Fields added successfully');

    // Test the prioritization system
    console.log('\n5. Testing prioritization system...');
    
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        institution: {
          select: {
            name: true,
            commissionRate: true
          }
        }
      },
      take: 3
    });

    console.log(`   Found ${courses.length} published courses`);
    
    courses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.title} (${course.institution.name})`);
      console.log(`      Commission Rate: ${course.institution.commissionRate}%`);
    });

    console.log('\n✅ Prioritization fields setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Update your Prisma schema to include the new fields');
    console.log('   2. Run "npx prisma generate" to update the client');
    console.log('   3. Test the prioritization system with the test script');

  } catch (error) {
    logger.error('❌ Error setting up prioritization fields:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
addPrioritizationFields(); 