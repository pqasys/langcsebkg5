import { prisma } from '../lib/prisma';

async function checkStudentEnrollments() {
  try {
    console.log('Checking student enrollments...');
    
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    // Get all enrollments for this student
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
                name: true
              }
            }
          }
        }
      }
    });
    
    console.log(`\n=== Student Enrollments ===`);
    console.log(`Total Enrollments: ${enrollments.length}`);
    
    if (enrollments.length === 0) {
      console.log('No enrollments found for this student');
      return;
    }
    
    // Group by institution
    const institutionEnrollments = new Map();
    
    enrollments.forEach((enrollment, index) => {
      const institution = enrollment.course.institution;
      const institutionId = institution.id;
      
      if (!institutionEnrollments.has(institutionId)) {
        institutionEnrollments.set(institutionId, {
          institution: institution,
          enrollments: []
        });
      }
      
      institutionEnrollments.get(institutionId).enrollments.push({
        courseName: enrollment.course.title,
        status: enrollment.status,
        progress: enrollment.progress,
        startDate: enrollment.startDate,
        endDate: enrollment.endDate
      });
    });
    
    console.log('\n=== Enrollments by Institution ===');
    institutionEnrollments.forEach((data, institutionId) => {
      console.log(`\nInstitution: ${data.institution.name} (${institutionId})`);
      console.log(`Courses: ${data.enrollments.length}`);
      
      data.enrollments.forEach((enrollment, index) => {
        console.log(`  ${index + 1}. ${enrollment.courseName}`);
        console.log(`     Status: ${enrollment.status}`);
        console.log(`     Progress: ${enrollment.progress}%`);
        console.log(`     Start: ${enrollment.startDate}`);
        console.log(`     End: ${enrollment.endDate || 'Not set'}`);
      });
    });
    
    // Check if the student is enrolled in XYZ Language School
    const xyzInstitutionId = '6752d3c9-64dc-471a-8c2c-48015fbdb547';
    const xyzEnrollments = enrollments.filter(e => e.course.institution.id === xyzInstitutionId);
    
    console.log(`\n=== XYZ Language School Check ===`);
    console.log(`Enrollments in XYZ Language School: ${xyzEnrollments.length}`);
    
    if (xyzEnrollments.length > 0) {
      console.log('✅ Student is enrolled in XYZ Language School');
      xyzEnrollments.forEach((enrollment, index) => {
        console.log(`  ${index + 1}. ${enrollment.course.title} - ${enrollment.status}`);
      });
    } else {
      console.log('❌ Student is NOT enrolled in XYZ Language School');
      console.log('Available institutions:');
      institutionEnrollments.forEach((data, institutionId) => {
        console.log(`  - ${data.institution.name} (${institutionId})`);
      });
    }
    
    console.log('\n✅ Student enrollment check completed!');
    
  } catch (error) {
    console.error('Error checking student enrollments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentEnrollments(); 