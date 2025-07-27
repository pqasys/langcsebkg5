import { prisma } from '../lib/prisma';

async function debugStudentNameDiscrepancy() {
  try {
    console.log('Debugging student name discrepancy...');
    
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    // Check database directly
    console.log('\n=== Database Check ===');
    const studentFromDB = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        updated_at: true
      }
    });
    
    if (studentFromDB) {
      console.log('Database Record:');
      console.log('- ID:', studentFromDB.id);
      console.log('- Name:', studentFromDB.name);
      console.log('- Email:', studentFromDB.email);
      console.log('- Last Updated:', studentFromDB.updated_at);
    } else {
      console.log('Student not found in database');
      return;
    }
    
    // Check if there's a user record with the same ID
    console.log('\n=== User Record Check ===');
    const userRecord = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    });
    
    if (userRecord) {
      console.log('User Record:');
      console.log('- ID:', userRecord.id);
      console.log('- Name:', userRecord.name);
      console.log('- Email:', userRecord.email);
      console.log('- Last Updated:', userRecord.updatedAt);
    } else {
      console.log('No user record found with this ID');
    }
    
    // Check for any recent updates
    console.log('\n=== Recent Updates Check ===');
    const recentStudentUpdates = await prisma.student.findMany({
      where: {
        email: studentFromDB.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        updated_at: true
      },
      orderBy: {
        updated_at: 'desc'
      }
    });
    
    console.log('All student records with this email:');
    recentStudentUpdates.forEach((record, index) => {
      console.log(`${index + 1}. ID: ${record.id}, Name: ${record.name}, Updated: ${record.updated_at}`);
    });
    
    // Check if there are any pending updates or sync issues
    console.log('\n=== Sync Status ===');
    if (userRecord && studentFromDB) {
      const nameMatch = userRecord.name === studentFromDB.name;
      const emailMatch = userRecord.email === studentFromDB.email;
      
      console.log('Name Match:', nameMatch ? '✅' : '❌');
      console.log('Email Match:', emailMatch ? '✅' : '❌');
      
      if (!nameMatch) {
        console.log('⚠️  Name mismatch detected!');
        console.log('  User record name:', userRecord.name);
        console.log('  Student record name:', studentFromDB.name);
      }
    }
    
    console.log('\n✅ Student name discrepancy debug completed!');
    
  } catch (error) {
    console.error('Error debugging student name discrepancy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugStudentNameDiscrepancy(); 