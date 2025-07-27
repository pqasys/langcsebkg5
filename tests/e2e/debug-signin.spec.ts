import { test, expect } from '@playwright/test';

test.describe('Debug Signin Page', () => {
  test('should debug signin page loading', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Log the page title
    const title = await page.title();
    // // // // // // // // // // // // // // console.log('Page title:', title);
    
    // Check if we're redirected
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check if body is visible
    const bodyVisible = await page.locator('body').isVisible();
    console.log('Body visible:', bodyVisible);
    
    // Check if form exists
    const formExists = await page.locator('form').count();
    console.log('Form count:', formExists);
    
    // Check if any inputs exist
    const inputCount = await page.locator('input').count();
    console.log('Input count:', inputCount);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-signin.png' });
    
    // Check if we're on the signin page by looking for signin-specific content
    const signinText = await page.locator('text=Sign in to your account').count();
    console.log('Signin text count:', signinText);
    
    // If we're on the signin page, the form should be visible
    if (signinText > 0) {
      await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
    } else {
      console.log('Not on signin page, current content:', await page.content());
    }
  });
}); 