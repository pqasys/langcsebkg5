import fetch from 'node-fetch';
import { logger } from '../lib/logger';

async function testNonApprovedInstitution() {
  try {
    console.log('Testing access to non-approved institution...\\n');

    // Test access to GraceFul English School (non-approved)
    const institutionId = '9f71efc3-7b31-4953-b398-29f2197af202';
    
    console.log('Attempting to access GraceFul English School (non-approved)...');
    const response = await fetch(`http://localhost:3000/api/institutions/${institutionId}`);
    
    console.log(`Response status: ${response.status}`);
    
    if (response.status === 404) {
      console.log('✅ SUCCESS: Non-approved institution correctly blocked (404 returned)');
    } else {
      const data = await response.json();
      console.log('❌ FAILURE: Non-approved institution is accessible!');
      console.log('Response data:', data);
    }

    // Test that it doesn't appear in the public institutions list
    console.log('\\nChecking public institutions list...');
    const institutionsResponse = await fetch('http://localhost:3000/api/institutions');
    const institutions = await institutionsResponse.json();
    
    const nonApprovedInList = institutions.find((inst: any) => inst.id === institutionId);
    
    if (nonApprovedInList) {
      console.log('❌ FAILURE: Non-approved institution appears in public list!');
      console.log('Institution found:', nonApprovedInList.name);
    } else {
      console.log('✅ SUCCESS: Non-approved institution correctly excluded from public list');
    }

    // Test that its courses don't appear in public courses
    console.log('\\nChecking public courses list...');
    const coursesResponse = await fetch('http://localhost:3000/api/courses/public');
    const courses = await coursesResponse.json();
    
    const nonApprovedCourses = courses.filter((course: any) => course.institution?.id === institutionId);
    
    if (nonApprovedCourses.length > 0) {
      console.log('❌ FAILURE: Non-approved institution courses appear in public list!');
      nonApprovedCourses.forEach((course: any) => {
        console.log(`Course found: ${course.title}`);
      });
    } else {
      console.log('✅ SUCCESS: Non-approved institution courses correctly excluded from public list');
    }

  } catch (error) {
    logger.error('Error testing non-approved institution:');
  }
}

testNonApprovedInstitution(); 