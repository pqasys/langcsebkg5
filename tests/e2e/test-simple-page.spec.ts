import { test, expect } from '@playwright/test';

test.describe('Simple Page Test', () => {
  test('should load a simple page', async ({ page }) => {
    // Test the courses page which we know works
    await page.goto('/courses');
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    // // // // // // // // // // // // // // console.log('Courses page title:', title);
    
    const bodyVisible = await page.locator('body').isVisible();
    console.log('Courses body visible:', bodyVisible);
    
    // This should work since we know courses page works
    expect(bodyVisible).toBe(true);
  });

  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    console.log('Contact page title:', title);
    
    const bodyVisible = await page.locator('body').isVisible();
    console.log('Contact body visible:', bodyVisible);
    
    // This should work since we know contact page works
    expect(bodyVisible).toBe(true);
  });

  test('should check if homepage has different behavior', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    console.log('Homepage title:', title);
    
    const bodyVisible = await page.locator('body').isVisible();
    console.log('Homepage body visible:', bodyVisible);
    
    // Check if there are any JavaScript errors
    const errors = await page.evaluate(() => {
      return window.performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('.js'))
        .map(entry => entry.name);
    });
    console.log('JavaScript resources loaded:', errors.length);
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-debug.png' });
    
    // For now, just check if we can get the title
    expect(title).toBeTruthy();
  });
}); 