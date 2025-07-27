import { spawn } from 'child_process';
import fetch from 'node-fetch';

async function testServerStartup() {
  console.log('🧪 Testing Server Startup with Warmup...\n');

  // Start the development server
  console.log('1. Starting development server...');
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true
  });

  let serverReady = false;
  let startupLogs = '';

  // Monitor server output
  devProcess.stdout?.on('data', (data) => {
    const output = data.toString();
    startupLogs += output;
    console.log(output.trim());

    // Check if server is ready
    if (output.includes('Ready in') && !serverReady) {
      serverReady = true;
      console.log('\n✅ Server is ready!');
    }

    // Check for warmup logs
    if (output.includes('Warming up database connection on server start')) {
      console.log('\n🔥 Database warmup detected!');
    }
  });

  devProcess.stderr?.on('data', (data) => {
    const output = data.toString();
    console.error(output.trim());
  });

  // Wait for server to be ready
  await new Promise<void>((resolve) => {
    const checkInterval = setInterval(() => {
      if (serverReady) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 1000);

    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 30000);
  });

  // Wait a bit more for warmup to complete
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test the API
  console.log('\n2. Testing API endpoints...');
  try {
    const statsResponse = await fetch('http://localhost:3000/api/stats', {
      headers: {
        'Cache-Control': 'no-cache',
        'X-Cache-Bust': Date.now().toString()
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats API working correctly:');
      console.log(`   - Students: ${statsData.students}`);
      console.log(`   - Institutions: ${statsData.institutions}`);
      console.log(`   - Courses: ${statsData.courses}`);
      console.log(`   - Languages: ${statsData.languages}`);
      
      if (statsData._fallback) {
        console.log(`   ⚠️  Using fallback data: ${statsData._error}`);
      } else {
        console.log('   ✅ Real data received (no fallback)');
      }
    } else {
      console.log(`❌ Stats API failed: ${statsResponse.status}`);
    }
  } catch (error) {
    console.error('❌ API test failed:', error);
  }

  // Stop the server
  console.log('\n3. Stopping development server...');
  devProcess.kill('SIGINT');

  // Wait for server to stop
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n🎉 Server startup test completed!');
}

testServerStartup().catch(console.error); 