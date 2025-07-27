import { test, expect } from '@playwright/test';

test.describe('Server Connectivity', () => {
  test('should connect to development server', async ({ page }) => {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Testing server connectivity...');
    
    // Capture console logs and errors
    page.on('console', msg => {
      console.log(`Browser console [${msg.type()}]: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`Browser page error: ${error.message}`);
    });
    
    // Test basic connectivity to homepage
    try {
      await page.goto('/');
      console.log('Successfully connected to homepage');
      
      // Wait a bit for any JavaScript to load
      await page.waitForTimeout(2000);
      
      // Check if we got a proper page or an error
      const title = await page.title();
      console.log('Page title:', title);
      
      // Check for common error indicators
      const bodyText = await page.textContent('body');
      console.log('Homepage body text (first 200 chars):', bodyText?.substring(0, 200));
      
      if (bodyText?.includes('404') || bodyText?.includes('not found')) {
        console.log('Warning: Homepage returned 404 or error page');
      }
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/homepage-debug.png' });
    } catch (error) {
      console.log('Error accessing homepage:', error);
    }
    
    // Test multiple auth routes to see which ones work
    const authRoutes = ['/auth/signin', '/auth/login', '/auth/signup', '/auth/register'];
    
    for (const route of authRoutes) {
      try {
        console.log(`\n=== Testing route: ${route} ===`);
        await page.goto(route);
        
        // Wait for page to load and any JavaScript to execute
        await page.waitForTimeout(3000);
        
        // Check if page loaded successfully
        const title = await page.title();
        console.log(`Route ${route} - Title: ${title}`);
        
        // Get page content for debugging
        const bodyText = await page.textContent('body');
        console.log(`Route ${route} - Body text (first 300 chars):`, bodyText?.substring(0, 300));
        
        // Take a screenshot for debugging
        await page.screenshot({ path: `test-results/${route.replace(/\//g, '-')}-debug.png` });
        
        // Check for form elements with more detailed logging
        const emailInput = page.locator('input[name="email"]');
        const passwordInput = page.locator('input[name="password"]');
        const form = page.locator('form');
        
        console.log(`Checking for form elements on ${route}:`);
        
        // Check if form exists
        const formCount = await form.count();
        console.log(`- Forms found: ${formCount}`);
        
        // Check if email input exists
        const emailCount = await emailInput.count();
        console.log(`- Email inputs found: ${emailCount}`);
        
        // Check if password input exists
        const passwordCount = await passwordInput.count();
        console.log(`- Password inputs found: ${passwordCount}`);
        
        // List all input elements for debugging
        const allInputs = await page.locator('input').all();
        console.log(`- Total inputs found: ${allInputs.length}`);
        for (let i = 0; i < Math.min(allInputs.length, 5); i++) {
          const input = allInputs[i];
          const name = await input.getAttribute('name');
          const type = await input.getAttribute('type');
          const id = await input.getAttribute('id');
          console.log(`  Input ${i + 1}: name="${name}", type="${type}", id="${id}"`);
        }
        
        // Check for any React root or app container
        const reactRoot = page.locator('#__next, [data-reactroot], [id*="root"]');
        const reactRootCount = await reactRoot.count();
        console.log(`- React root elements found: ${reactRootCount}`);
        
        const emailVisible = await emailInput.isVisible().catch(() => false);
        const passwordVisible = await passwordInput.isVisible().catch(() => false);
        
        if (emailVisible && passwordVisible) {
          console.log(` Found working auth form at ${route}`);
          
          // Test the form elements
          await expect(emailInput).toBeVisible({ timeout: 5000 });
          await expect(passwordInput).toBeVisible({ timeout: 5000 });
          
          console.log('✅ Auth form elements are visible and accessible');
          return; // Success - we found a working auth page
        } else {
          console.log(` No auth form found at ${route}`);
          console.log(`  - Email input visible: ${emailVisible}`);
          console.log(`  - Password input visible: ${passwordVisible}`);
        }
      } catch (error) {
        console.log(`Error testing route ${route}:`, error);
      }
    }
    
    // If we get here, no auth routes worked
    console.log('\n=== SUMMARY ===');
    console.log('No working authentication routes found. Check if the development server is running correctly.');
    console.log('Screenshots have been saved to test-results/ for debugging.');
    
    throw new Error(`No working authentication routes found. Check if the development server is running correctly. - Context: throw new Error('No working authentication routes ...`);
  });
}); 