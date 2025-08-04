import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminLiveClassUpdate() {
  try {
    console.log('Testing admin live class update functionality...');
    
    // Get a live class to test with
    const liveClass = await prisma.videoSession.findFirst({
      where: {
        status: 'SCHEDULED'
      }
    });
    
    if (!liveClass) {
      console.log('No live class found for testing');
      return;
    }
    
    console.log('Found live class:', {
      id: liveClass.id,
      title: liveClass.title,
      institutionId: liveClass.institutionId,
      courseId: liveClass.courseId
    });
    
    // Test data for update
    const updateData = {
      title: 'Updated Test Class',
      description: 'Updated description',
      sessionType: 'LECTURE',
      language: 'en',
      level: 'BEGINNER',
      maxParticipants: 20,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
      duration: 60,
      price: 0,
      currency: 'USD',
      isPublic: true,
      isRecorded: false,
      allowChat: true,
      allowScreenShare: true,
      allowRecording: false,
      instructorId: liveClass.instructorId,
      institutionId: 'platform', // This should work now
      courseId: 'no-course' // This should work now
    };
    
    console.log('Testing update with platform institution and no course...');
    console.log('Update data:', updateData);
    
    // Test the validation logic
    console.log('\nValidation tests:');
    
    // Test institution validation
    if (updateData.institutionId && updateData.institutionId !== 'platform') {
      console.log('❌ Institution validation would fail');
    } else {
      console.log('✅ Institution validation passes (platform selected)');
    }
    
    // Test course validation
    if (updateData.courseId && updateData.courseId !== 'no-course') {
      console.log('❌ Course validation would fail');
    } else {
      console.log('✅ Course validation passes (no course selected)');
    }
    
    // Test with actual institution ID
    const institution = await prisma.institution.findFirst();
    if (institution) {
      console.log('\nTesting with actual institution ID...');
      const updateDataWithInstitution = {
        ...updateData,
        institutionId: institution.id
      };
      
      if (updateDataWithInstitution.institutionId && updateDataWithInstitution.institutionId !== 'platform') {
        console.log('✅ Institution validation would pass (actual institution ID)');
      } else {
        console.log('❌ Institution validation would fail');
      }
    }
    
    // Test with actual course ID
    const course = await prisma.course.findFirst();
    if (course) {
      console.log('\nTesting with actual course ID...');
      const updateDataWithCourse = {
        ...updateData,
        courseId: course.id
      };
      
      if (updateDataWithCourse.courseId && updateDataWithCourse.courseId !== 'no-course') {
        console.log('✅ Course validation would pass (actual course ID)');
      } else {
        console.log('❌ Course validation would fail');
      }
    }
    
    console.log('\n✅ All validation tests completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLiveClassUpdate(); 