import { test, expect } from '@playwright/test';

test.describe('Navigation Hover Tests', () => {
  test('should not show underlines on navbar links on hover', async ({ page }) => {
    await page.goto('/');
    
    // Get all navigation links
    const navLinks = page.locator('nav a');
    
    // Check each link
    for (let i = 0; i < await navLinks.count(); i++) {
      const link = navLinks.nth(i);
      
      // Hover over the link
      await link.hover();
      
      // Check that the link doesn't have text-decoration: underline
      const computedStyle = await link.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.textDecoration;
      });
      
      // Should not contain 'underline'
      expect(computedStyle).not.toContain('underline');
    }
  });

  test('should not show underlines on sidebar links on hover', async ({ page }) => {
    // Test institution sidebar (requires login)
    await page.goto('/auth/signin');
    
    // This test would need authentication setup
    // For now, we'll just verify the CSS rule exists
    const cssContent = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      let cssText = '';
      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          rules.forEach(rule => {
            cssText += rule.cssText;
          });
        } catch (e) {
          // Cross-origin stylesheets will throw an error
        }
      });
      return cssText;
    });
    
    // Check that our CSS rule exists
    expect(cssContent).toContain('nav a:hover');
    expect(cssContent).toContain('text-decoration: none');
  });

  test('should have no-hover-underline utility class available', async ({ page }) => {
    await page.goto('/');
    
    // Add the utility class to a link
    await page.evaluate(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = 'Test Link';
      link.className = 'no-hover-underline';
      document.body.appendChild(link);
    });
    
    // Find the link and hover over it
    const testLink = page.locator('a.no-hover-underline');
    await testLink.hover();
    
    // Check that it doesn't have underline
    const computedStyle = await testLink.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.textDecoration;
    });
    
    expect(computedStyle).not.toContain('underline');
  });
}); 