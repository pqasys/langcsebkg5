import { test, expect } from '@playwright/test';

test.describe('Public Pages Mobile Test', () => {
  test('should load homepage on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Check if we can see the main content
    const title = await page.title();
    // // // // // // console.log('Homepage title:', title);
    
    // Check if navigation is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-mobile.png' });
  });

  test('should load courses page on mobile', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Check if we can see the courses content
    const title = await page.title();
    console.log('Courses page title:', title);
    
    // Take screenshot
    await page.screenshot({ path: 'courses-mobile.png' });
  });

  test('should load contact page on mobile', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Check if we can see the contact form
    const title = await page.title();
    console.log('Contact page title:', title);
    
    // Check if form is visible
    await expect(page.locator('form')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'contact-mobile.png' });
  });
}); 