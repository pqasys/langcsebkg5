import { test, expect } from '@playwright/test';

test.describe('Debug Homepage', () => {
  test('should debug homepage loading issues', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Log the page title
    const title = await page.title();
    // // // // // // // // // // // // // // // // // // // // console.log('Homepage title:', title);
    
    // Check if we're redirected
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check if body exists
    const bodyExists = await page.locator('body').count();
    console.log('Body count:', bodyExists);
    
    // Check body visibility
    const bodyVisible = await page.locator('body').isVisible();
    console.log('Body visible:', bodyVisible);
    
    // Check body computed style
    const bodyStyle = await page.locator('body').evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        height: style.height,
        overflow: style.overflow
      };
    });
    console.log('Body computed style:', bodyStyle);
    
    // Check if main content is visible
    const mainVisible = await page.locator('main').isVisible();
    console.log('Main visible:', mainVisible);
    
    // Check if any content is visible
    const anyContent = await page.locator('div').first().isVisible();
    console.log('Any div visible:', anyContent);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-homepage.png' });
    
    // Wait a bit more and try again
    await page.waitForTimeout(2000);
    
    const bodyVisibleAfterWait = await page.locator('body').isVisible();
    console.log('Body visible after wait:', bodyVisibleAfterWait);
    
    // If body is still not visible, check if it's a CSS issue
    if (!bodyVisibleAfterWait) {
      const bodyClass = await page.locator('body').getAttribute('class');
      console.log('Body class:', bodyClass);
      
      // Check if there are any loading overlays
      const loadingOverlays = await page.locator('[class*="loading"], [class*="spinner"], [class*="overlay"]').count();
      console.log('Loading overlays count:', loadingOverlays);
    }
  });
}); 