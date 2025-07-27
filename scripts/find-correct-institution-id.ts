import { prisma } from '../lib/prisma';

async function findCorrectInstitutionId() {
  try {
    console.log('Finding correct institution ID for XYZ Language School...');
    
    // Find all institutions with "XYZ" in the name
    const xyzInstitutions = await prisma.institution.findMany({
      where: {
        name: {
          contains: 'XYZ'
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    console.log('\n=== XYZ Institutions Found ===');
    xyzInstitutions.forEach((institution, index) => {
      console.log(`${index + 1}. ${institution.name}`);
      console.log(`   ID: ${institution.id}`);
      console.log(`   Email: ${institution.email}`);
      console.log(`   Created: ${institution.createdAt}`);
      console.log('');
    });
    
    // Check which one has the student enrollments
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    for (const institution of xyzInstitutions) {
      const enrollments = await prisma.studentCourseEnrollment.findMany({
        where: {
          studentId: studentId,
          course: {
            institutionId: institution.id
          }
        },
        include: {
          course: {
            select: {
              title: true
            }
          }
        }
      });
      
      console.log(`\n=== Checking ${institution.name} ===`);
      console.log(`Enrollments: ${enrollments.length}`);
      
      if (enrollments.length > 0) {
        console.log('✅ This institution has student enrollments!');
        enrollments.forEach((enrollment, index) => {
          console.log(`  ${index + 1}. ${enrollment.course.title}`);
        });
      } else {
        console.log('❌ No enrollments found');
      }
    }
    
    // Also check the old ID that was being used
    const oldId = '6752d3c9-64dc-471a-8c2c-48015fbdb547';
    const oldInstitution = await prisma.institution.findUnique({
      where: { id: oldId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    console.log(`\n=== Old Institution ID Check ===`);
    if (oldInstitution) {
      console.log(`Institution: ${oldInstitution.name}`);
      console.log(`ID: ${oldInstitution.id}`);
      console.log(`Email: ${oldInstitution.email}`);
      
      const oldEnrollments = await prisma.studentCourseEnrollment.findMany({
        where: {
          studentId: studentId,
          course: {
            institutionId: oldId
          }
        }
      });
      
      console.log(`Enrollments: ${oldEnrollments.length}`);
    } else {
      console.log('❌ Institution with old ID not found');
    }
    
    console.log('\n✅ Institution ID check completed!');
    
  } catch (error) {
    console.error('Error finding institution ID:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findCorrectInstitutionId(); 