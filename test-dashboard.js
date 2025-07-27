// Quick test for dashboard APIs
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    // // // // // // // // console.log(`${endpoint}: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`${endpoint}: ERROR - ${error.message}`);
  }
}

async function runQuickTests() {
  console.log('Testing Dashboard APIs...\n');
  
  await testEndpoint('/api/student/dashboard/courses');
  await testEndpoint('/api/student/dashboard/stats');
  await testEndpoint('/api/student/dashboard/achievements');
  await testEndpoint('/api/student/dashboard/recent-modules');
  
  console.log('\nExpected: All should return 401 (Unauthorized) when not logged in');
}

runQuickTests(); 