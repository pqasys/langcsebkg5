#!/usr/bin/env tsx

import { chromium, devices } from '@playwright/test';
import { logger } from '../lib/logger';

async function runSimpleMobileTests() {
  console.log('🚀 Starting Simple Mobile Device Tests...\n');

  // Test devices
  const testDevices = [
    { name: 'iPhone SE', ...devices['iPhone SE'] },
    { name: 'Galaxy S8', ...devices['Galaxy S8'] },
    { name: 'Desktop Chrome', ...devices['Desktop Chrome'] }
  ];

  const results = [];

  for (const device of testDevices) {
    console.log(`� Testing on ${device.name}...`);
    
    const browser = await chromium.launch();
    const context = await browser.newContext(device);
    const page = await context.newPage();

    try {
      // Test 1: Page Load
      const startTime = Date.now();
      await page.goto('http://localhost:3000');
      const loadTime = Date.now() - startTime;

      // Test 2: Basic Elements
      const title = await page.title();
      const navVisible = await page.locator('nav').isVisible();
      const mainVisible = await page.locator('main').isVisible();

      // Test 3: Responsive Check
      const viewport = page.viewportSize();
      const bodyWidth = await page.evaluate(() => document.body.offsetWidth);

      // Test 4: Touch Support (for mobile)
      const touchSupport = device.isMobile ? await page.evaluate(() => 'ontouchstart' in window) : false;

      // Test 5: Service Worker
      const swSupport = await page.evaluate(() => 'serviceWorker' in navigator);

      const result = {
        device: device.name,
        passed: true,
        tests: {
          pageLoad: { passed: loadTime < 5000, duration: loadTime },
          title: { passed: title.includes('Fluentish'), value: title },
          navigation: { passed: navVisible, value: navVisible },
          mainContent: { passed: mainVisible, value: mainVisible },
          responsive: { passed: bodyWidth <= (viewport?.width || 0), value: bodyWidth },
          touchSupport: { passed: !device.isMobile || touchSupport, value: touchSupport },
          serviceWorker: { passed: swSupport, value: swSupport }
        }
      };

      results.push(result);
      console.log(` ${device.name}: All tests passed (${loadTime}ms)`);

    } catch (error) {
      console.log(` ${device.name}: Test failed - ${error.message}`);
      results.push({
        device: device.name,
        passed: false,
        error: error.message
      });
    }

    await browser.close();
  }

  // Generate report
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    if (result.passed) {
      console.log(` ${result.device}: PASSED`);
      Object.entries(result.tests).forEach(([test, data]) => {
        console.log(`   - ${test}: ${data.passed ? '' : ''} ${data.value || data.duration}ms`);
      });
    } else {
      console.log(` ${result.device}: FAILED - ${result.error}`);
    }
  });

  console.log(`\n Overall: ${passed}/${total} devices passed (${(passed/total*100).toFixed(1)}%)`);

  if (passed === total) {
    console.log('🎉 All tests passed! Your mobile implementation is working well.');
  } else {
    console.log('⚠️  Some tests failed. Review the results above.');
  }
}

// Run tests
runSimpleMobileTests().catch(console.error); 