import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkApprovalStatus() {
  try {
    console.log('Checking institution approval and status...\\n');

    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        isApproved: true,
        status: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`Found ${institutions.length} institutions:\\n`);

    institutions.forEach((institution, index) => {
      console.log(`${index + 1}. ${institution.name}`);
      console.log(`   ID: ${institution.id}`);
      console.log(`   isApproved: ${institution.isApproved}`);
      console.log(`   status: ${institution.status}`);
      console.log('');
    });

    // Check which institutions should be visible publicly
    const publicInstitutions = institutions.filter(
      inst => inst.isApproved === true && inst.status === 'ACTIVE'
    );

    console.log(`\\n=== Public Visibility Summary ===`);
    console.log(`Total institutions: ${institutions.length}`);
    console.log(`Publicly visible: ${publicInstitutions.length}`);
    console.log(`Hidden from public: ${institutions.length - publicInstitutions.length}`);

    if (publicInstitutions.length > 0) {
      console.log(`\\nPublicly visible institutions:`);
      publicInstitutions.forEach(inst => {
        console.log(`- ${inst.name}`);
      });
    }

    const hiddenInstitutions = institutions.filter(
      inst => !(inst.isApproved === true && inst.status === 'ACTIVE')
    );

    if (hiddenInstitutions.length > 0) {
      console.log(`\\nHidden institutions:`);
      hiddenInstitutions.forEach(inst => {
        console.log(`- ${inst.name} (Approved: ${inst.isApproved}, Status: ${inst.status})`);
      });
    }

  } catch (error) {
    logger.error('Error checking approval status:');
  } finally {
    await prisma.$disconnect();
  }
}

checkApprovalStatus(); 