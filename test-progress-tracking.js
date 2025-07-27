// Test script for Progress Tracking APIs
// Run this after starting the dev server

const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, description) {
  try {
    // // // // // // // // // // // // // // // // // // // // // // console.log(`\n🧪 Testing: ${description}`);
    console.log(`� Endpoint: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(` Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(` Success: ${JSON.stringify(data, null, 2)}`);
    } else {
      const errorText = await response.text();
      console.log(` Error: ${errorText}`);
    }
  } catch (error) {
    console.log(`� Exception: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting Progress Tracking API Tests...\n');
  
  // Test all dashboard endpoints
  await testAPI('/api/student/dashboard/courses', 'Course Progress API');
  await testAPI('/api/student/dashboard/stats', 'Learning Stats API');
  await testAPI('/api/student/dashboard/achievements', 'Achievements API');
  await testAPI('/api/student/dashboard/recent-modules', 'Recent Modules API');
  
  console.log('\n🎯 Test Summary:');
  console.log('- If you see 401 errors, that\'s expected (not logged in)');
  console.log('- If you see 404 errors, check if the endpoints exist');
  console.log('- If you see 500 errors, check server logs for issues');
}

// Run the tests
runTests(); 