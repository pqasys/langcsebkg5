import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function testZeroFlash() {
  console.log('🧪 Testing Zero Flash Prevention...\n');

  try {
    // Test homepage HTML
    const response = await fetch('http://localhost:3000');
    const html = await response.text();
    
    // Parse HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;

    console.log('📊 Checking for Zero Values:');
    
    // Check for any "0" values in stats
    const statsElements = document.querySelectorAll('[class*="text-2xl"], [class*="text-3xl"], [class*="text-4xl"]');
    let zerosFound = false;
    let loadingFound = false;
    
    statsElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text) {
        if (text === '0' || text === '0+') {
          console.log(`  ❌ Found zero value: "${text}"`);
          zerosFound = true;
        } else if (text === 'Loading...') {
          console.log(`  ✅ Found loading state: "${text}"`);
          loadingFound = true;
        } else if (text.includes('+') && !text.includes('0')) {
          console.log(`  ✅ Found actual stat: "${text}"`);
        }
      }
    });

    if (zerosFound) {
      console.log('\n❌ ZERO FLASH ISSUE DETECTED!');
      console.log('Zeros are being shown before loading completes.');
    } else {
      console.log('\n✅ NO ZERO FLASH DETECTED!');
      console.log('Zeros are not being shown during loading.');
    }

    if (loadingFound) {
      console.log('✅ Loading states are properly displayed.');
    } else {
      console.log('⚠️  No loading states found - may indicate immediate data load.');
    }

    // Check for skeleton elements
    console.log('\n⏳ Checking Skeleton States:');
    const skeletonElements = document.querySelectorAll('[class*="animate-pulse"]');
    if (skeletonElements.length > 0) {
      console.log(`  ✅ Found ${skeletonElements.length} skeleton elements`);
    } else {
      console.log('  ⚠️  No skeleton elements found');
    }

    console.log('\n🎯 Zero flash test completed!');
    
    if (!zerosFound) {
      console.log('✅ SUCCESS: No zeros are being shown during loading!');
    } else {
      console.log('❌ ISSUE: Zeros are being shown during loading!');
    }

  } catch (error) {
    console.error('❌ Zero flash test failed:', error);
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

  await testZeroFlash();
}

main(); 