#!/usr/bin/env tsx

import fetch from 'node-fetch';

async function testPerformance() {
  console.log('🚀 Testing Page Load Performance...\n');

  const baseUrl = 'http://localhost:3000';
  const headers = {
    'Cache-Control': 'no-cache',
    'X-Cache-Bust': Date.now().toString()
  };

  const tests = [
    { name: 'Homepage', url: '/' },
    { name: 'Stats API', url: '/api/stats' },
    { name: 'Courses API', url: '/api/courses/by-country' },
    { name: 'Homepage (cached)', url: '/' },
    { name: 'Stats API (cached)', url: '/api/stats' }
  ];

  const results = [];

  for (const test of tests) {
    console.log(`Testing ${test.name}...`);
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${baseUrl}${test.url}`, { headers });
      const loadTime = Date.now() - startTime;
      
      if (response.ok) {
        console.log(`✅ ${test.name}: ${loadTime}ms`);
        results.push({ name: test.name, time: loadTime, status: 'success' });
      } else {
        console.log(`❌ ${test.name}: ${response.status} (${loadTime}ms)`);
        results.push({ name: test.name, time: loadTime, status: 'error' });
      }
    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.log(`❌ ${test.name}: Failed (${loadTime}ms)`);
      results.push({ name: test.name, time: loadTime, status: 'failed' });
    }
  }

  // Performance analysis
  console.log('\n📊 Performance Analysis:');
  const successfulTests = results.filter(r => r.status === 'success');
  
  if (successfulTests.length > 0) {
    const avgTime = successfulTests.reduce((sum, test) => sum + test.time, 0) / successfulTests.length;
    const minTime = Math.min(...successfulTests.map(t => t.time));
    const maxTime = Math.max(...successfulTests.map(t => t.time));
    
    console.log(`Average load time: ${avgTime.toFixed(0)}ms`);
    console.log(`Fastest: ${minTime}ms`);
    console.log(`Slowest: ${maxTime}ms`);
    
    // Performance recommendations
    if (avgTime > 2000) {
      console.log('\n⚠️  Performance recommendations:');
      console.log('- Consider implementing more aggressive caching');
      console.log('- Optimize database queries');
      console.log('- Use CDN for static assets');
    } else if (avgTime > 1000) {
      console.log('\n💡 Performance is acceptable but could be improved');
    } else {
      console.log('\n🎉 Excellent performance!');
    }
  }

  console.log('\n🎯 Performance test completed!');
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

  await testPerformance();
}

main(); 