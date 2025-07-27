import { test, expect } from '@playwright/test';

test.describe('Auth Debug', () => {
  test('should test authentication API directly', async ({ page }) => {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Starting auth debug test...');
    
    // Navigate to signin page
    await page.goto('/auth/signin');
    console.log('Navigated to signin page');
    
    // Wait for the form
    await page.waitForSelector('input[name="email"]');
    console.log('Form is ready');
    
    // Fill the form
    await page.fill('input[name="email"]', 'integration.test.admin@example.com');
    await page.fill('input[name="password"]', 'testpassword123');
    console.log('Form filled');
    
    // Listen for network requests
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/auth')) {
        requests.push(`${request.method()} ${request.url()}`);
        console.log(`Request: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', async response => {
      if (response.url().includes('/api/auth/callback/credentials')) {
        console.log(`Response: ${response.status()} ${response.url()}`);
        try {
          const responseText = await response.text();
          console.log('Credentials callback response:', responseText);
        } catch (error) {
          console.log('Could not read response body:', error);
        }
      } else if (response.url().includes('/api/auth')) {
        console.log(`Response: ${response.status()} ${response.url()}`);
      }
    });
    
    // Submit the form
    await page.click('button[type="submit"]');
    console.log('Form submitted');
    
    // Wait for network requests to complete
    await page.waitForLoadState('networkidle');
    console.log('Network idle');
    
    // Wait a bit more
    await page.waitForTimeout(5000);
    
    // Check current URL
    console.log('Current URL:', page.url());
    
    // Check if we're still on signin page
    if (page.url().includes('/auth/signin')) {
      console.log('Still on signin page');
      
      // Check for error message
      const errorElement = page.locator('text=Invalid email or password');
      if (await errorElement.isVisible()) {
        console.log('Error message found');
      } else {
        console.log('No error message');
      }
      
      // Check for loading state
      const loadingElement = page.locator('.animate-spin, [role="progressbar"]');
      if (await loadingElement.isVisible()) {
        console.log('Loading spinner is visible');
      } else {
        console.log('No loading spinner');
      }
      
      // Check session API directly
      const sessionResponse = await page.request.get('/api/auth/session');
      console.log('Session response status:', sessionResponse.status());
      const sessionData = await sessionResponse.json();
      console.log('Session data:', sessionData);
      
    } else {
      console.log('Successfully redirected to:', page.url());
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/auth-debug-detailed.png' });
  });
}); 