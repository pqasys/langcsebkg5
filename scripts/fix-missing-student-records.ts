import { prisma } from '../lib/prisma';

// This script ensures all users with the STUDENT role have a matching student record.
// Run this after migrations or user imports, or call it from an admin settings page or deployment script.
import { logger } from '../lib/logger';
// It is safe to run multiple times.

async function fixMissingStudentRecords() {
  try {
    console.log('🔧 Fixing Missing Student Records...\n');

    // Find all users with STUDENT role
    const studentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log(`Found ${studentUsers.length} users with STUDENT role`);

    // Check which users are missing student records
    const missingStudentRecords: typeof studentUsers = [];
    
    for (const user of studentUsers) {
      const existingStudent = await prisma.student.findUnique({
        where: { id: user.id }
      });

      if (!existingStudent) {
        missingStudentRecords.push(user);
        console.log(` Missing student record for user: ${user.name} (${user.email})`);
      } else {
        console.log(` Student record exists for user: ${user.name} (${user.email})`);
      }
    }

    if (missingStudentRecords.length === 0) {
      console.log('\n🎉 All student records are properly created!');
      return;
    }

    console.log(`\n Creating ${missingStudentRecords.length} missing student records...`);

    // Create missing student records
    for (const user of missingStudentRecords) {
      try {
        const student = await prisma.student.create({
          data: {
            id: user.id, // Use the same ID as the user
            name: user.name,
            email: user.email,
            status: 'active',
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            last_active: new Date()
          }
        });

        console.log(` Created student record for: ${student.name} (${student.email})`);
      } catch (error) {
        logger.error('❌ Failed to create student record for ${user.name}:');
      }
    }

    console.log('\n🎉 Student record creation completed!');

    // Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const verificationUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true }
    });

    let allFixed = true;
    for (const user of verificationUsers) {
      const student = await prisma.student.findUnique({
        where: { id: user.id }
      });

      if (!student) {
        console.log(` Still missing student record for: ${user.name}`);
        allFixed = false;
      } else {
        console.log(` Student record verified for: ${user.name}`);
      }
    }

    if (allFixed) {
      console.log('\n🎉 All student records are now properly created and verified!');
    } else {
      console.log('\n⚠️ Some student records are still missing. Please check the errors above.');
    }

  } catch (error) {
    logger.error('❌ Error fixing missing student records:');
  } finally {
    await prisma.$disconnect();
  }
}

fixMissingStudentRecords(); 