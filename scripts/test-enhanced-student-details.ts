import { prisma } from '../lib/prisma';

async function testEnhancedStudentDetails() {
  try {
    console.log('Testing enhanced student details API...');
    
    // Find the specific student
    const student = await prisma.student.findFirst({
      where: {
        name: 'Student One'
      },
      include: {
        enrollments: {
          include: {
            course: true
          }
        }
      }
    });

    if (!student) {
      console.log('Student One not found');
      return;
    }

    console.log(`\nStudent: ${student.name} (${student.id})`);
    console.log('Email:', student.email);
    console.log('Phone:', student.phone || 'N/A');
    console.log('Address:', student.address || 'N/A');
    console.log('Status:', student.status);
    console.log('Join Date:', student.created_at);
    console.log('Last Active:', student.last_active);
    
    // Test additional fields
    console.log('\n=== Additional Student Information ===');
    console.log('Bio:', student.bio || 'N/A');
    console.log('Native Language:', student.native_language || 'N/A');
    console.log('Spoken Languages:', student.spoken_languages || 'N/A');
    console.log('Learning Goals:', student.learning_goals || 'N/A');
    console.log('Interests:', student.interests || 'N/A');
    console.log('Social Visibility:', student.social_visibility || 'N/A');
    console.log('Timezone:', student.timezone || 'N/A');
    console.log('Date of Birth:', student.date_of_birth || 'N/A');
    console.log('Gender:', student.gender || 'N/A');
    console.log('Location:', student.location || 'N/A');
    console.log('Website:', student.website || 'N/A');
    console.log('Social Links:', student.social_links || 'N/A');
    
    console.log('\n=== Enrollments ===');
    console.log('Total Enrollments:', student.enrollments.length);
    student.enrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. ${enrollment.course.title} - Status: ${enrollment.status} - Progress: ${enrollment.progress}%`);
    });

    // Test the API response format
    console.log('\n=== API Response Format ===');
    const apiResponse = {
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
      completedCourses: [], // Will be populated by the API
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

    console.log('API Response Keys:', Object.keys(apiResponse));
    console.log('Additional Fields Included:', [
      'bio', 'native_language', 'spoken_languages', 'learning_goals', 
      'interests', 'social_visibility', 'timezone', 'date_of_birth', 
      'gender', 'location', 'website', 'social_links'
    ].filter(key => apiResponse[key] !== undefined && apiResponse[key] !== null));

    console.log('\n✅ Enhanced student details API test completed successfully!');
    
  } catch (error) {
    console.error('Error testing enhanced student details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnhancedStudentDetails(); 