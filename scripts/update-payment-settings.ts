import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function updatePaymentSettings() {
  console.log('🔧 Updating Payment Settings...\n');

  try {
    // Get current admin settings
    let adminSettings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    if (!adminSettings) {
      console.log('Creating new admin settings...');
      adminSettings = await prisma.adminSettings.create({
        data: {
          id: '1',
          allowInstitutionPaymentApproval: true,
          showInstitutionApprovalButtons: true,
          defaultPaymentStatus: 'PENDING',
          institutionApprovableMethods: ['MANUAL', 'BANK_TRANSFER', 'CASH', 'OFFLINE'],
          adminOnlyMethods: ['CREDIT_CARD', 'PAYPAL', 'STRIPE'],
          institutionPaymentApprovalExemptions: [],
          fileUploadMaxSizeMB: 10
        }
      });
      console.log('✅ Created new admin settings');
    } else {
      console.log('Updating existing admin settings...');
      
      // Get current approvable methods
      const currentMethods = adminSettings.institutionApprovableMethods as string[];
      console.log(`Current institution approvable methods: ${JSON.stringify(currentMethods)}`);
      
      // Add OFFLINE if not already present
      if (!currentMethods.includes('OFFLINE')) {
        const updatedMethods = [...currentMethods, 'OFFLINE'];
        
        adminSettings = await prisma.adminSettings.update({
          where: { id: '1' },
          data: {
            institutionApprovableMethods: updatedMethods
          }
        });
        
        console.log(` Added OFFLINE to institution approvable methods`);
        console.log(`Updated methods: ${JSON.stringify(updatedMethods)}`);
      } else {
        console.log('✅ OFFLINE is already in the institution approvable methods');
      }
    }

    console.log('\n📋 Final Settings:');
    console.log(`  - allowInstitutionPaymentApproval: ${adminSettings.allowInstitutionPaymentApproval}`);
    console.log(`  - showInstitutionApprovalButtons: ${adminSettings.showInstitutionApprovalButtons}`);
    console.log(`  - institutionApprovableMethods: ${JSON.stringify(adminSettings.institutionApprovableMethods)}`);
    console.log(`  - adminOnlyMethods: ${JSON.stringify(adminSettings.adminOnlyMethods)}`);
    console.log(`  - institutionPaymentApprovalExemptions: ${JSON.stringify(adminSettings.institutionPaymentApprovalExemptions)}`);

  } catch (error) {
    logger.error('❌ Error updating payment settings:');
  } finally {
    await prisma.$disconnect();
  }
}

updatePaymentSettings(); 