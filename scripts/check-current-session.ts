import { prisma } from '../lib/prisma';

async function checkCurrentSession() {
  try {
    console.log('Checking current session and institution mapping...');
    
    // Find all institution users
    const institutionUsers = await prisma.user.findMany({
      where: {
        role: 'INSTITUTION'
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    console.log('\n=== Institution Users ===');
    institutionUsers.forEach((user, index) => {
      console.log(`${index + 1}. User: ${user.name} (${user.email})`);
      console.log(`   Institution: ${user.institution?.name || 'No institution'}`);
      console.log(`   Institution ID: ${user.institutionId || 'No ID'}`);
      console.log(`   User ID: ${user.id}`);
      console.log('');
    });
    
    // Find the student and their enrollments
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    const studentEnrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        studentId: studentId
      },
      include: {
        course: {
          include: {
            institution: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    console.log('\n=== Student Enrollments by Institution ===');
    const institutionMap = new Map();
    
    studentEnrollments.forEach(enrollment => {
      const institution = enrollment.course.institution;
      if (!institutionMap.has(institution.id)) {
        institutionMap.set(institution.id, {
          institution: institution,
          enrollments: []
        });
      }
      institutionMap.get(institution.id).enrollments.push(enrollment);
    });
    
    institutionMap.forEach((data, institutionId) => {
      console.log(`\nInstitution: ${data.institution.name}`);
      console.log(`ID: ${institutionId}`);
      console.log(`Email: ${data.institution.email}`);
      console.log(`Enrollments: ${data.enrollments.length}`);
      
      // Check if there's a user for this institution
      const institutionUser = institutionUsers.find(u => u.institutionId === institutionId);
      if (institutionUser) {
        console.log(`✅ Has user account: ${institutionUser.name} (${institutionUser.email})`);
      } else {
        console.log(`❌ No user account found for this institution`);
      }
    });
    
    console.log('\n=== Recommendations ===');
    console.log('To access the student details page, you need to:');
    console.log('1. Log in as the institution where the student is enrolled');
    console.log('2. Or update the student enrollments to be in your current institution');
    
    const xyzInstitutions = Array.from(institutionMap.keys()).filter(id => {
      const data = institutionMap.get(id);
      return data.institution.name.includes('XYZ');
    });
    
    if (xyzInstitutions.length > 0) {
      console.log('\nXYZ Language School institutions where student is enrolled:');
      xyzInstitutions.forEach(id => {
        const data = institutionMap.get(id);
        console.log(`- ${data.institution.name} (${id})`);
      });
    }
    
    console.log('\n✅ Session check completed!');
    
  } catch (error) {
    console.error('Error checking current session:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentSession(); 