import { prisma } from '../lib/prisma';

async function verifyLoginRequirements() {
  try {
    console.log('Verifying login requirements for student details page...');
    
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    // Find the student's enrollments
    const enrollments = await prisma.studentCourseEnrollment.findMany({
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
    
    console.log('\n=== Student Enrollment Summary ===');
    console.log(`Student ID: ${studentId}`);
    console.log(`Total Enrollments: ${enrollments.length}`);
    
    // Group by institution
    const institutionEnrollments = new Map();
    enrollments.forEach(enrollment => {
      const institution = enrollment.course.institution;
      if (!institutionEnrollments.has(institution.id)) {
        institutionEnrollments.set(institution.id, {
          institution: institution,
          enrollments: []
        });
      }
      institutionEnrollments.get(institution.id).enrollments.push(enrollment);
    });
    
    console.log('\n=== Institutions Where Student is Enrolled ===');
    institutionEnrollments.forEach((data, institutionId) => {
      console.log(`\n🏫 ${data.institution.name}`);
      console.log(`   ID: ${institutionId}`);
      console.log(`   Email: ${data.institution.email}`);
      console.log(`   Courses: ${data.enrollments.length}`);
      
      data.enrollments.forEach((enrollment, index) => {
        console.log(`     ${index + 1}. ${enrollment.course.title} (${enrollment.status})`);
      });
    });
    
    // Find institution users
    const institutionUsers = await prisma.user.findMany({
      where: {
        role: 'INSTITUTION'
      },
      select: {
        id: true,
        name: true,
        email: true,
        institutionId: true,
        institution: {
          select: {
            name: true
          }
        }
      }
    });
    
    console.log('\n=== Available Institution Logins ===');
    institutionUsers.forEach((user, index) => {
      console.log(`\n👤 ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Institution: ${user.institution?.name || 'No institution'}`);
      console.log(`   Institution ID: ${user.institutionId || 'No ID'}`);
      
      // Check if this user can access the student
      const canAccess = institutionEnrollments.has(user.institutionId);
      console.log(`   Can access student: ${canAccess ? '✅ YES' : '❌ NO'}`);
    });
    
    console.log('\n=== LOGIN REQUIREMENTS ===');
    console.log('To access the student details page, you must log in as:');
    
    const accessibleInstitutions = Array.from(institutionEnrollments.keys());
    const accessibleUsers = institutionUsers.filter(user => 
      accessibleInstitutions.includes(user.institutionId)
    );
    
    if (accessibleUsers.length > 0) {
      accessibleUsers.forEach(user => {
        console.log(`\n✅ ${user.name} (${user.email})`);
        console.log(`   Institution: ${user.institution?.name}`);
        console.log(`   Login with: ${user.email}`);
      });
    } else {
      console.log('❌ No institution users found that can access this student');
    }
    
    console.log('\n=== TROUBLESHOOTING ===');
    console.log('If you\'re still having issues:');
    console.log('1. Make sure you\'re logged in as one of the users above');
    console.log('2. Clear your browser cache and cookies');
    console.log('3. Log out and log back in');
    console.log('4. Restart the development server');
    console.log('5. Check that the student is actually enrolled in your institution\'s courses');
    
    console.log('\n✅ Login requirements verification completed!');
    
  } catch (error) {
    console.error('Error verifying login requirements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyLoginRequirements(); 