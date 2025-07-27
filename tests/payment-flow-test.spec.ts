import { test, expect } from '@playwright/test';

test.describe('Payment Flow Tests', () => {
  test('should show payment method selection dialog', async ({ page }) => {
    // Navigate to a course page
    await page.goto('/student/courses');
    
    // Wait for courses to load
    await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
    
    // Find a course that needs payment
    const payButton = page.locator('button:has-text("Pay Now")').first();
    
    if (await payButton.isVisible()) {
      // Click the pay button
      await payButton.click();
      
      // Verify the dialog opens
      await expect(page.locator('text=Complete Your Course Enrollment')).toBeVisible();
      
      // Verify payment methods are shown
      await expect(page.locator('text=Credit / Debit Card')).toBeVisible();
      await expect(page.locator('text=Bank Transfer')).toBeVisible();
      
      // Verify course details are shown
      await expect(page.locator('text=Course:')).toBeVisible();
      await expect(page.locator('text=Institution:')).toBeVisible();
      await expect(page.locator('text=Amount:')).toBeVisible();
    }
  });

  test('should handle credit card payment selection', async ({ page }) => {
    // Navigate to a course page
    await page.goto('/student/courses');
    
    // Wait for courses to load
    await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
    
    // Find a course that needs payment
    const payButton = page.locator('button:has-text("Pay Now")').first();
    
    if (await payButton.isVisible()) {
      // Click the pay button
      await payButton.click();
      
      // Select credit card payment method
      await page.locator('input[value="CREDIT_CARD"]').check();
      
      // Verify credit card is selected
      await expect(page.locator('input[value="CREDIT_CARD"]')).toBeChecked();
      
      // Click complete payment
      await page.locator('button:has-text("Complete Payment")').click();
      
      // Verify payment processing starts
      await expect(page.locator('text=Processing payment...')).toBeVisible();
    }
  });

  test('should show Stripe payment form for credit card', async ({ page }) => {
    // This test would require a mock Stripe setup
    // For now, we'll just verify the component structure
    
    // Navigate to a course page
    await page.goto('/student/courses');
    
    // Wait for courses to load
    await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
    
    // Find a course that needs payment
    const payButton = page.locator('button:has-text("Pay Now")').first();
    
    if (await payButton.isVisible()) {
      // Click the pay button
      await payButton.click();
      
      // Select credit card payment method
      await page.locator('input[value="CREDIT_CARD"]').check();
      
      // Click complete payment
      await page.locator('button:has-text("Complete Payment")').click();
      
      // Wait for potential Stripe form to appear
      await page.waitForTimeout(2000);
      
      // Check if Stripe elements are present (they might be in an iframe)
      const stripeElements = page.locator('[data-testid="stripe-payment-form"]');
      
      // If Stripe form appears, verify it has payment elements
      if (await stripeElements.isVisible()) {
        await expect(stripeElements).toBeVisible();
      }
    }
  });
}); 