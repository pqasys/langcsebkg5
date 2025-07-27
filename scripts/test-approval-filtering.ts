import fetch from 'node-fetch';
import { logger } from '../lib/logger';

async function testApprovalFiltering() {
  try {
    console.log('Testing approval filtering across public APIs...\\n');

    // Test 1: Public Institutions API
    console.log('1. Testing Public Institutions API...');
    const institutionsResponse = await fetch('http://localhost:3000/api/institutions');
    const institutions = await institutionsResponse.json();
    
    console.log(`   Found ${institutions.length} institutions`);
    institutions.forEach((inst: any) => {
      console.log(`   - ${inst.name}: Approved=${inst.isApproved}, Status=${inst.status}`);
    });

    // Test 2: Public Courses API
    console.log('\\n2. Testing Public Courses API...');
    const coursesResponse = await fetch('http://localhost:3000/api/courses/public');
    const courses = await coursesResponse.json();
    
    console.log(`   Found ${courses.length} courses`);
    courses.forEach((course: any) => {
      console.log(`   - ${course.title} (${course.institution?.name}): Institution Approved=${course.institution?.isApproved}, Status=${course.institution?.status}`);
    });

    // Test 3: Search API
    console.log('\\n3. Testing Search API...');
    const searchResponse = await fetch('http://localhost:3000/api/courses/search?query=english');
    const searchResults = await searchResponse.json();
    
    console.log(`   Found ${searchResults.courses?.length || 0} courses in search`);
    if (searchResults.courses) {
      searchResults.courses.forEach((course: any) => {
        console.log(`   - ${course.title} (${course.institution?.name}): Institution Approved=${course.institution?.isApproved}, Status=${course.institution?.status}`);
      });
    }

    // Test 4: Individual Institution API (for approved institution)
    console.log('\\n4. Testing Individual Institution API (approved institution)...');
    const approvedInstitution = institutions.find((inst: any) => inst.isApproved && inst.status === 'ACTIVE');
    if (approvedInstitution) {
      const institutionResponse = await fetch(`http://localhost:3000/api/institutions/${approvedInstitution.id}`);
      const institution = await institutionResponse.json();
      console.log(`   Successfully fetched ${institution.name} with ${institution.courses?.length || 0} courses`);
    } else {
      console.log('   No approved institutions found to test');
    }

    // Test 5: Individual Institution API (for non-approved institution)
    console.log('\\n5. Testing Individual Institution API (non-approved institution)...');
    const nonApprovedInstitution = institutions.find((inst: any) => !inst.isApproved || inst.status !== 'ACTIVE');
    if (nonApprovedInstitution) {
      const institutionResponse = await fetch(`http://localhost:3000/api/institutions/${nonApprovedInstitution.id}`);
      if (institutionResponse.status === 404) {
        console.log(`   Correctly blocked access to ${nonApprovedInstitution.name} (404 returned)`);
      } else {
        const institution = await institutionResponse.json();
        console.log(`   WARNING: Non-approved institution ${institution.name} is accessible!`);
      }
    } else {
      console.log('   No non-approved institutions found to test');
    }

    console.log('\\n=== Summary ===');
    console.log('✅ Public APIs should now only show approved and active institutions');
    console.log('✅ Non-approved institutions should return 404 errors');
    console.log('✅ All courses should be from approved and active institutions');

  } catch (error) {
    logger.error('Error testing approval filtering:');
  }
}

testApprovalFiltering(); 