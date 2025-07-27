import { test, expect } from '@playwright/test';

test.describe('Mobile Performance & Optimization Report', () => {
  test('should generate mobile optimization report', async ({ page }) => {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('🚀 Starting Mobile Performance & Optimization Report');
    console.log('=' .repeat(60));
    
    // Test homepage performance
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    console.log(`� Homepage Load Time: ${loadTime}ms`);
    console.log(` ${loadTime < 5000 ? 'EXCELLENT' : loadTime < 8000 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
    
    // Check viewport and responsive design
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    console.log(`� Viewport Meta: ${viewport}`);
    console.log(` ${viewport?.includes('width=device-width') ? 'MOBILE OPTIMIZED' : 'NEEDS FIX'}`);
    
    // Check touch targets
    const buttons = await page.locator('button, a[role="button"]').all();
    let touchTargetIssues = 0;
    for (const button of buttons.slice(0, 10)) {
      const box = await button.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        touchTargetIssues++;
      }
    }
    console.log(`� Touch Target Issues: ${touchTargetIssues} out of ${Math.min(buttons.length, 10)} buttons`);
    console.log(` ${touchTargetIssues === 0 ? 'EXCELLENT' : touchTargetIssues < 3 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
    
    // Check accessibility
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log(`♿ Accessibility Headings: ${headings.length} found`);
    console.log(` ${headings.length >= 5 ? 'EXCELLENT' : headings.length >= 3 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
    
    // Check images for alt text
    const images = await page.locator('img').all();
    let imagesWithAlt = 0;
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt) imagesWithAlt++;
    }
    console.log(`�️ Images with Alt Text: ${imagesWithAlt}/${images.length}`);
    console.log(` ${imagesWithAlt === images.length ? 'EXCELLENT' : imagesWithAlt >= images.length * 0.8 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
    
    // Check form functionality
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');
    const formVisible = await page.locator('form').isVisible();
    console.log(` Contact Form: ${formVisible ? 'VISIBLE' : 'NOT VISIBLE'}`);
    console.log(` ${formVisible ? 'EXCELLENT' : 'NEEDS FIX'}`);
    
    // Check navigation
    const navLinks = await page.locator('nav a').all();
    console.log(`🧭 Navigation Links: ${navLinks.length} found`);
    console.log(` ${navLinks.length >= 3 ? 'EXCELLENT' : navLinks.length >= 2 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
    
    // Performance summary
    console.log('\n📊 MOBILE OPTIMIZATION SUMMARY:');
    console.log('=' .repeat(40));
    console.log(`� Homepage Performance: ${loadTime < 5000 ? ' EXCELLENT' : loadTime < 8000 ? '⚠️ GOOD' : ' NEEDS IMPROVEMENT'}`);
    console.log(`� Mobile Responsiveness: ${viewport?.includes('width=device-width') ? ' EXCELLENT' : ' NEEDS FIX'}`);
    console.log(`� Touch Targets: ${touchTargetIssues === 0 ? ' EXCELLENT' : touchTargetIssues < 3 ? '⚠️ GOOD' : ' NEEDS IMPROVEMENT'}`);
    console.log(`♿ Accessibility: ${headings.length >= 5 ? ' EXCELLENT' : headings.length >= 3 ? '⚠️ GOOD' : ' NEEDS IMPROVEMENT'}`);
    console.log(`�️ Image Alt Text: ${imagesWithAlt === images.length ? ' EXCELLENT' : imagesWithAlt >= images.length * 0.8 ? '⚠️ GOOD' : ' NEEDS IMPROVEMENT'}`);
    console.log(` Form Functionality: ${formVisible ? ' EXCELLENT' : ' NEEDS FIX'}`);
    console.log(`🧭 Navigation: ${navLinks.length >= 3 ? ' EXCELLENT' : navLinks.length >= 2 ? '⚠️ GOOD' : ' NEEDS IMPROVEMENT'}`);
    
    // Overall score
    const scores = [
      loadTime < 5000 ? 1 : loadTime < 8000 ? 0.5 : 0,
      viewport?.includes('width=device-width') ? 1 : 0,
      touchTargetIssues === 0 ? 1 : touchTargetIssues < 3 ? 0.5 : 0,
      headings.length >= 5 ? 1 : headings.length >= 3 ? 0.5 : 0,
      imagesWithAlt === images.length ? 1 : imagesWithAlt >= images.length * 0.8 ? 0.5 : 0,
      formVisible ? 1 : 0,
      navLinks.length >= 3 ? 1 : navLinks.length >= 2 ? 0.5 : 0
    ];
    
    const overallScore = (scores.reduce((a, b) => a + b, 0) / scores.length) * 100;
    console.log(`\n OVERALL MOBILE SCORE: ${overallScore.toFixed(1)}%`);
    console.log(`� ${overallScore >= 90 ? 'EXCELLENT' : overallScore >= 70 ? 'GOOD' : overallScore >= 50 ? 'FAIR' : 'NEEDS WORK'}`);
    
    // Take screenshot for documentation
    await page.screenshot({ path: 'mobile-optimization-report.png' });
    
    // Assertions for test validation
    expect(loadTime).toBeLessThan(10000);
    expect(viewport).toContain('width=device-width');
    expect(headings.length).toBeGreaterThan(0);
    expect(formVisible).toBe(true);
  });
}); 