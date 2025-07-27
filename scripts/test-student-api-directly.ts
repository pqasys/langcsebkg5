import { prisma } from '../lib/prisma';

async function testStudentAPIDirectly() {
  try {
    console.log('Testing student API directly...');
    
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    // Simulate the exact API logic
    const session = {
      user: {
        institutionId: '6752d3c9-64dc-471a-8c2c-48015fbdb547' // XYZ Language School ID
      }
    };
    
    // Get the student and verify they are enrolled in a course from this institution
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        enrollments: {
          some: {
            course: {
              institutionId: session.user.institutionId,
            },
          },
        },
      },
      include: {
        enrollments: {
          where: {
            course: {
              institutionId: session.user.institutionId,
            },
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      console.log('Student not found or not enrolled in this institution');
      return;
    }

    // Get course completions for this student
    const completions = await prisma.studentCourseCompletion.findMany({
      where: {
        studentId: studentId,
        course: {
          institutionId: session.user.institutionId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Format the response exactly like the API
    const studentDetails = {
      ...student,
      joinDate: student.created_at ? new Date(student.created_at).toISOString() : null,
      lastActive: student.last_active ? new Date(student.last_active).toISOString() : null,
      enrolledCourses: student.enrollments.map(enrollment => ({
        id: enrollment.id,
        name: enrollment.course.title,
        start_date: enrollment.startDate ? new Date(enrollment.startDate).toISOString() : null,
        end_date: enrollment.endDate ? new Date(enrollment.endDate).toISOString() : null,
        status: enrollment.status.toLowerCase(),
        progress: enrollment.progress || 0,
      })),
      completedCourses: completions.map(completion => ({
        id: completion.id,
        name: completion.course.title,
        completionDate: completion.createdAt ? new Date(completion.createdAt).toISOString() : null,
        status: completion.status,
      })),
      // Include all additional student information
      bio: student.bio,
      native_language: student.native_language,
      spoken_languages: student.spoken_languages,
      learning_goals: student.learning_goals,
      interests: student.interests,
      social_visibility: student.social_visibility,
      timezone: student.timezone,
      date_of_birth: student.date_of_birth ? new Date(student.date_of_birth).toISOString() : null,
      gender: student.gender,
      location: student.location,
      website: student.website,
      social_links: student.social_links,
    };

    console.log('\n=== API Response ===');
    console.log('Student Name:', studentDetails.name);
    console.log('Student Email:', studentDetails.email);
    console.log('Student ID:', studentDetails.id);
    console.log('Join Date:', studentDetails.joinDate);
    console.log('Last Active:', studentDetails.lastActive);
    console.log('Status:', studentDetails.status);
    
    console.log('\n=== Enrolled Courses ===');
    console.log('Total Enrolled:', studentDetails.enrolledCourses.length);
    studentDetails.enrolledCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.name} - ${course.status} - ${course.progress}%`);
    });
    
    console.log('\n=== Completed Courses ===');
    console.log('Total Completed:', studentDetails.completedCourses.length);
    studentDetails.completedCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.name} - ${course.status}`);
    });
    
    console.log('\n✅ API test completed successfully!');
    
  } catch (error) {
    console.error('Error testing student API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStudentAPIDirectly(); 