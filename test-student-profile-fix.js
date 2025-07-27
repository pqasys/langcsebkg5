// Test script to verify student profile API fix
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('🧪 Testing Student Profile API Fix...\n');

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`Testing ${description}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    console.log(`  Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log(`   Expected: Unauthorized (not logged in)`);
    } else if (response.status === 200) {
      const data = await response.json();
      console.log(`   Success: Profile data returned`);
      console.log(`     Student ID: ${data.id}`);
      console.log(`     Name: ${data.name}`);
      console.log(`     Email: ${data.email}`);
      console.log(`     Preferences: ${data.preferences ? 'Loaded' : 'Default'}`);
      console.log(`     Enrollments: ${data.enrollments ? data.enrollments.length : 0} found`);
    } else {
      console.log(`   Unexpected status: ${response.status}`);
      const text = await response.text();
      console.log(`  Error: ${text}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

async function runTests() {
  // Test the fixed student profile API
  await testEndpoint('/api/student/profile', 'Student Profile API (should return 401 when not authenticated)');

  console.log('✅ Student Profile API fix testing completed!');
  console.log('The API should now:');
  console.log('- Return 401 when not authenticated (instead of 500)');
  console.log('- Handle missing preferences gracefully');
  console.log('- Handle missing enrollments gracefully');
  console.log('- Use separate queries for related data');
}

runTests().catch(console.error); 