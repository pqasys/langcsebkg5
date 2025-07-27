import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function testFrontendDisplay() {
  console.log('🧪 Testing Frontend Display...\n');

  try {
    // Test homepage HTML
    const response = await fetch('http://localhost:3000');
    const html = await response.text();
    
    // Parse HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;

    console.log('📊 Checking Stats Display:');
    
    // Check for stats elements
    const statsElements = document.querySelectorAll('[class*="text-2xl"], [class*="text-3xl"], [class*="text-4xl"]');
    let statsFound = false;
    
    statsElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && (text.includes('+') || text.includes('Loading'))) {
        console.log(`  Found stat: "${text}"`);
        statsFound = true;
      }
    });

    if (!statsFound) {
      console.log('  ⚠️  No stats found in HTML');
    }

    console.log('\n🌍 Checking Countries Display:');
    
    // Check for country elements
    const countryElements = document.querySelectorAll('[class*="card"], [class*="Card"]');
    let countriesFound = false;
    
    countryElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && (text.includes('courses') || text.includes('United Kingdom') || text.includes('🇬🇧'))) {
        console.log(`  Found country: "${text.substring(0, 50)}..."`);
        countriesFound = true;
      }
    });

    if (!countriesFound) {
      console.log('  ⚠️  No countries found in HTML');
    }

    // Check for loading states
    console.log('\n⏳ Checking Loading States:');
    const loadingElements = document.querySelectorAll('[class*="animate-pulse"], [class*="Loading"]');
    if (loadingElements.length > 0) {
      console.log(`  Found ${loadingElements.length} loading elements`);
    } else {
      console.log('  ✅ No loading elements found (good!)');
    }

    // Check for skeleton elements
    const skeletonElements = document.querySelectorAll('[class*="skeleton"], [class*="Skeleton"]');
    if (skeletonElements.length > 0) {
      console.log(`  Found ${skeletonElements.length} skeleton elements`);
    } else {
      console.log('  ✅ No skeleton elements found (good!)');
    }

    console.log('\n🎯 Frontend display test completed!');
    
    if (statsFound && countriesFound) {
      console.log('✅ Frontend appears to be displaying data correctly');
    } else {
      console.log('⚠️  Some elements may not be displaying correctly');
    }

  } catch (error) {
    console.error('❌ Frontend display test failed:', error);
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

  await testFrontendDisplay();
}

main(); 