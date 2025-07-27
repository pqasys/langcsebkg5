import fetch from 'node-fetch';

async function testFreshVisit() {
  console.log('🧪 Testing Fresh Visit Simulation...\n');

  const baseUrl = 'http://localhost:3000';
  
  // Simulate a fresh visit by clearing cache headers
  const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Cache-Bust': Date.now().toString(),
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  try {
    // Test 1: Homepage
    console.log('1. Testing homepage...');
    const homeStartTime = Date.now();
    const homeResponse = await fetch(`${baseUrl}/`, { headers });
    const homeTime = Date.now() - homeStartTime;
    
    if (homeResponse.ok) {
      console.log(`✅ Homepage loaded in ${homeTime}ms`);
    } else {
      console.log(`❌ Homepage failed: ${homeResponse.status}`);
    }

    // Test 2: Stats API (simulating first request)
    console.log('\n2. Testing stats API (first request)...');
    const statsStartTime = Date.now();
    const statsResponse = await fetch(`${baseUrl}/api/stats`, { headers });
    const statsTime = Date.now() - statsStartTime;
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log(`✅ Stats API response in ${statsTime}ms:`);
      console.log(`   - Students: ${statsData.students}`);
      console.log(`   - Institutions: ${statsData.institutions}`);
      console.log(`   - Courses: ${statsData.courses}`);
      console.log(`   - Languages: ${statsData.languages}`);
      
      if (statsData._fallback) {
        console.log(`   ⚠️  Using fallback data: ${statsData._error}`);
      }
    } else {
      console.log(`❌ Stats API failed: ${statsResponse.status} ${statsResponse.statusText}`);
    }

    // Test 3: Courses by country API
    console.log('\n3. Testing courses by country API...');
    const countryStartTime = Date.now();
    const countryResponse = await fetch(`${baseUrl}/api/courses/by-country`, { headers });
    const countryTime = Date.now() - countryStartTime;
    
    if (countryResponse.ok) {
      const countryData = await countryResponse.json();
      console.log(`✅ Courses by country API response in ${countryTime}ms:`);
      console.log(`   - Countries: ${countryData.length}`);
      if (countryData.length > 0) {
        console.log(`   - Top country: ${countryData[0].country} (${countryData[0].courseCount} courses)`);
      }
    } else {
      console.log(`❌ Courses by country API failed: ${countryResponse.status} ${countryResponse.statusText}`);
    }

    // Test 4: Second stats request (to test caching)
    console.log('\n4. Testing stats API (second request)...');
    const stats2StartTime = Date.now();
    const stats2Response = await fetch(`${baseUrl}/api/stats`, { headers });
    const stats2Time = Date.now() - stats2StartTime;
    
    if (stats2Response.ok) {
      const stats2Data = await stats2Response.json();
      console.log(`✅ Stats API second response in ${stats2Time}ms:`);
      console.log(`   - Students: ${stats2Data.students}`);
      console.log(`   - Institutions: ${stats2Data.institutions}`);
      console.log(`   - Courses: ${stats2Data.courses}`);
      console.log(`   - Languages: ${stats2Data.languages}`);
      
      if (stats2Data._fallback) {
        console.log(`   ⚠️  Still using fallback data: ${stats2Data._error}`);
      }
    } else {
      console.log(`❌ Stats API second request failed: ${stats2Response.status} ${stats2Response.statusText}`);
    }

    console.log('\n🎉 Fresh visit simulation completed!');

  } catch (error) {
    console.error('\n❌ Fresh visit test failed:', error);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Next.js development server is not running.');
    console.log('Please start the server with: npm run dev');
    return;
  }

  await testFreshVisit();
}

main(); 