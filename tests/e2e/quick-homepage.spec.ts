import { test, expect } from '@playwright/test';

test.describe('Quick Homepage Test', () => {
  test('should load homepage quickly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for DOM to be ready
    await page.waitForLoadState('domcontentloaded');
    
    // Log the page title
    const title = await page.title();
    // // // // // // // // // // // // // // console.log('Homepage title:', title);
    
    // Check if we're redirected
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check if body exists and is visible
    const bodyExists = await page.locator('body').count();
    console.log('Body count:', bodyExists);
    
    if (bodyExists > 0) {
      const bodyVisible = await page.locator('body').isVisible();
      console.log('Body visible:', bodyVisible);
      
      // Check if main content is visible
      const mainVisible = await page.locator('main').isVisible();
      console.log('Main visible:', mainVisible);
      
      // Check if any content is visible
      const anyContent = await page.locator('div').first().isVisible();
      console.log('Any div visible:', anyContent);
      
      // Take a screenshot
      await page.screenshot({ path: 'quick-homepage.png' });
      
      // If body is not visible, check CSS
      if (!bodyVisible) {
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
      }
    }
    
    // Basic assertion - just check if we can get the title
    expect(title).toBeTruthy();
  });
}); 