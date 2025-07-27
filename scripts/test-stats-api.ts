import fetch from 'node-fetch';

async function testStatsAPI() {
  console.log('🧪 Testing Stats API...\n');

  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    '/api/stats',
    '/api/courses/by-country'
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}...`);
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'X-Cache-Bust': Date.now().toString()
        }
      });
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        
        if (endpoint === '/api/stats') {
          console.log(`✅ Stats API response (${responseTime}ms):`);
          console.log(`   - Students: ${data.students}`);
          console.log(`   - Institutions: ${data.institutions}`);
          console.log(`   - Courses: ${data.courses}`);
          console.log(`   - Languages: ${data.languages}`);
          
          if (data._fallback) {
            console.log(`   ⚠️  Using fallback data: ${data._error}`);
          }
        } else {
          console.log(`✅ Courses by country API response (${responseTime}ms):`);
          console.log(`   - Countries: ${data.length}`);
          if (data.length > 0) {
            console.log(`   - Top country: ${data[0].country} (${data[0].courseCount} courses)`);
          }
        }
      } else {
        console.log(`❌ API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    console.log('');
  }

  console.log('🎉 Stats API testing completed!');
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
    console.log('Or use the warmup version: npm run dev:warmup');
    return;
  }

  await testStatsAPI();
}

main(); 