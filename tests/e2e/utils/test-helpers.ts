import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Login as a specific user type with better error handling and session verification
   */
  async loginAs(email: string, password: string = 'testpassword123') {
    await this.page.goto('/auth/signin');
    
    // Wait for the form to be ready
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    
    // Clear any existing values and fill the form
    await this.page.fill('input[name="email"]', '');
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', '');
    await this.page.fill('input[name="password"]', password);
    
    // Submit the form
    await this.page.click('button[type="submit"]');
    
    // Wait for either redirect or error
    try {
      // Wait for the page to reload (if authentication was successful)
      await this.page.waitForLoadState('networkidle');
      
      // Wait for session to be established
      await this.waitForSessionEstablishment(15000);
      
      // Wait for redirect to happen - be more flexible with the URL patterns
      await this.page.waitForURL(/\/dashboard|\/admin|\/institution|\/student|\/auth\/signin/, { timeout: 15000 });
      
      // If we're still on signin page, wait a bit more for the redirect
      const currentUrl = this.page.url();
      if (currentUrl.includes('/auth/signin')) {
        await this.page.waitForURL(/\/dashboard|\/admin|\/institution|\/student/, { timeout: 10000 });
      }
      
      // Wait for page to load
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
      
    } catch (error) {
      // Check if we got an error message
      const errorElement = this.page.locator('text=Invalid email or password');
      if (await errorElement.isVisible()) {
        throw new Error(`Login failed for ${email} - invalid credentials - Context: throw new Error(`Login failed for ${email} - inval...`);
      }
      
      // Check if we're still on login page
      const currentUrl = this.page.url();
      if (currentUrl.includes('/auth/signin')) {
        throw new Error(`Login failed for ${email} - still on login page - Context: const currentUrl = this.page.url();...`);
      }
      
      throw error;
    }
  }

  /**
   * Wait for session to be properly established
   */
  async waitForSessionEstablishment(timeout: number = 10000) {
    // Wait for session to be established by checking the session API
    await this.page.waitForFunction(async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const sessionData = await response.json();
        return sessionData && sessionData.user && sessionData.user.email;
      } catch {
        return false;
      }
    }, { timeout });
  }

  /**
   * Verify that the session is active by checking for user-specific content
   */
  async verifySessionActive() {
    // Wait for any user-specific content to appear
    await this.page.waitForFunction(() => {
      // Check if there's any user-specific content on the page
      const hasUserContent = document.body.textContent?.includes('Welcome') || 
                           document.body.textContent?.includes('Dashboard') ||
                           document.body.textContent?.includes('Test Student') ||
                           document.body.textContent?.includes('integration.test.student@example.com') ||
                           document.body.textContent?.includes('Test Admin') ||
                           document.body.textContent?.includes('integration.test.admin@example.com');
      return hasUserContent;
    }, { timeout: 10000 });
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin() {
    await this.loginAs('integration.test.admin@example.com');
  }

  /**
   * Login as student user
   */
  async loginAsStudent() {
    await this.loginAs('integration.test.student@example.com');
  }

  /**
   * Login as institution user
   */
  async loginAsInstitution() {
    await this.loginAs('test@institution.com');
  }

  /**
   * Create test student if needed
   */
  private async createTestStudentIfNeeded() {
    try {
      // Navigate to registration page
      await this.page.goto('/auth/register');
      
      // Check if student already exists by trying to register
      await this.page.fill('input[name="name"]', 'Test Student');
      await this.page.fill('input[name="email"]', 'integration.test.student@example.com');
      await this.page.fill('input[name="password"]', 'testpassword123');
      await this.page.fill('input[name="confirmPassword"]', 'testpassword123');
      
      // Submit form
      await this.page.click('button[type="submit"]');
      
      // Wait for registration to complete
      await this.page.waitForTimeout(2000);
      
      // // // // console.log('Test student created');
    } catch (error) {
      console.log('Test student creation failed or user already exists');
    }
  }

  /**
   * Logout from current session
   */
  async logout() {
    // Try to find logout button/link
    const logoutButton = this.page.locator('text=Logout').or(this.page.locator('text=Sign Out')).or(this.page.locator('[data-testid="logout-button"]')).first();
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.page.waitForURL(/\/auth\/signin|\//);
    } else {
      // If no logout button found, navigate to logout endpoint
      await this.page.goto('/api/auth/signout');
    }
  }

  /**
   * Wait for page to be fully loaded with enhanced checks
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000); // Additional wait for any animations and client-side rendering
    
    // Wait for any loading spinners to disappear
    try {
      await this.page.waitForSelector('.animate-spin, [role="progressbar"]', { state: 'hidden', timeout: 5000 });
    } catch {
      // If no spinner found, that's fine
    }
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Fill a form with data
   */
  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await this.page.fill(`[name="${field}"]`, value);
    }
  }

  /**
   * Submit a form
   */
  async submitForm() {
    await this.page.click('button[type="submit"]');
  }

  /**
   * Wait for success message with flexible selectors
   */
  async waitForSuccessMessage() {
    await this.page.waitForSelector('[data-testid="success-message"], .toast-success, .alert-success, text=Success', {
      timeout: 10000
    });
  }

  /**
   * Wait for error message with flexible selectors
   */
  async waitForErrorMessage() {
    await this.page.waitForSelector('[data-testid="error-message"], .toast-error, .alert-error, text=Error, text=Invalid', {
      timeout: 10000
    });
  }

  /**
   * Navigate to a specific page
   */
  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * Check if element exists and is visible with enhanced error handling
   */
  async expectElementVisible(selector: string, timeout: number = 10000) {
    try {
      await expect(this.page.locator(selector)).toBeVisible({ timeout });
    } catch (error) {
      // Take a screenshot for debugging
      await this.takeScreenshot(`element-not-found-${selector.replace(/[^a-zA-Z0-9]/g, '-')}`);
      throw error;
    }
  }

  /**
   * Check if text is present on page with multiple fallback options
   */
  async expectTextVisible(text: string, timeout: number = 10000) {
    // Try multiple variations of the text
    const textVariations = [
      text,
      text.toLowerCase(),
      text.toUpperCase(),
      text.replace(/\s+/g, ' ').trim()
    ];
    
    for (const variation of textVariations) {
      try {
        await expect(this.page.locator(`text=${variation}`)).toBeVisible({ timeout: 3000 });
        return; // If any variation is found, we're good
      } catch {
        continue;
      }
    }
    
    // If none of the variations work, take a screenshot and throw error
    await this.takeScreenshot(`text-not-found-${text.replace(/[^a-zA-Z0-9]/g, '-')}`);
    throw new Error(`Text "${text}" not found on page`);
  }

  /**
   * Get text content of an element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  /**
   * Click on an element with retry logic
   */
  async clickWithRetry(selector: string, maxRetries: number = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.click(selector);
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Wait for API response
   */
  async waitForAPIResponse(urlPattern: string) {
    await this.page.waitForResponse(response => 
      response.url().includes(urlPattern) && response.status() === 200
    );
  }

  /**
   * Wait for any element to be visible from a list of selectors
   */
  async waitForAnyElement(selectors: string[], timeout: number = 10000) {
    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 2000 });
        return selector;
      } catch {
        continue;
      }
    }
    throw new Error(`None of the selectors were found: ${selectors.join(', ')}`);
  }

  /**
   * Check if user is properly authenticated by looking for session indicators
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check for common authenticated user indicators
      const indicators = [
        'Welcome',
        'Dashboard',
        'Logout',
        'Sign Out',
        'Profile',
        'Settings'
      ];
      
      for (const indicator of indicators) {
        const element = this.page.locator(`text=${indicator}`);
        if (await element.isVisible()) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Wait for authentication to be established
   */
  async waitForAuthentication(timeout: number = 15000) {
    await this.page.waitForFunction(() => {
      // Check if there's any indication of authentication
      const hasAuth = document.body.textContent?.includes('Welcome') || 
                     document.body.textContent?.includes('Dashboard') ||
                     document.body.textContent?.includes('Logout') ||
                     document.body.textContent?.includes('Sign Out');
      return hasAuth;
    }, { timeout });
  }
}

/**
 * Common test data
 */
export const testData = {
  admin: {
    email: 'test.admin@example.com',
    password: 'testpassword123',
    name: 'Test Admin'
  },
  student: {
    email: 'test.student@example.com',
    password: 'testpassword123',
    name: 'Test Student'
  },
  institution: {
    email: 'test.institution@example.com',
    password: 'testpassword123',
    name: 'Test Institution User'
  }
};

/**
 * Common selectors with fallbacks
 */
export const selectors = {
  // Navigation
  sidebar: '[data-testid="sidebar"], nav, .sidebar, [role="navigation"]',
  userMenu: '[data-testid="user-menu"], .user-menu, .profile-menu',
  logoutButton: '[data-testid="logout-button"], text=Logout, text=Sign Out',
  
  // Forms
  submitButton: 'button[type="submit"]',
  cancelButton: 'button[type="button"]',
  
  // Messages
  successMessage: '[data-testid="success-message"], .toast-success, .alert-success',
  errorMessage: '[data-testid="error-message"], .toast-error, .alert-error',
  loadingSpinner: '[data-testid="loading-spinner"], .spinner, .loading',
  
  // Tables
  dataTable: '[data-testid="data-table"], table',
  tableRow: '[data-testid="table-row"], tr',
  
  // Modals
  modal: '[data-testid="modal"], .modal, [role="dialog"]',
  modalClose: '[data-testid="modal-close"], .modal-close, .close',
  
  // Cards
  card: '[data-testid="card"], .card',
  cardTitle: '[data-testid="card-title"], .card-title',
  cardContent: '[data-testid="card-content"], .card-content'
}; 