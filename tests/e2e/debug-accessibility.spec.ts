import { test, expect } from '@playwright/test';

test.describe('Debug Accessibility', () => {
  test('should debug accessibility elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit more for content to load
    await page.waitForTimeout(2000);
    
    // Check for headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    // // // // // // // // console.log('Number of headings found:', headings.length);
    
    // Log each heading
    for (let i = 0; i < headings.length; i++) {
      const text = await headings[i].textContent();
      const tagName = await headings[i].evaluate(el => el.tagName.toLowerCase());
      console.log(`Heading ${i + 1}: <${tagName}>${text}</${tagName}>`);
    }
    
    // Check for images
    const images = await page.locator('img').all();
    console.log('Number of images found:', images.length);
    
    // Check first few images for alt text
    for (let i = 0; i < Math.min(images.length, 3); i++) {
      const alt = await images[i].getAttribute('alt');
      const src = await images[i].getAttribute('src');
      console.log(`Image ${i + 1}: src="${src}", alt="${alt}"`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-accessibility.png' });
    
    // Basic assertions
    expect(headings.length).toBeGreaterThan(0);
    if (images.length > 0) {
      const firstImageAlt = await images[0].getAttribute('alt');
      expect(firstImageAlt).toBeDefined();
    }
  });
}); 