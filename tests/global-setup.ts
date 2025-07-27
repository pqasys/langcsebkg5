import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set up test environment
  // // // // // // // // // // // // // // // // console.log('Setting up test environment...');

  // Navigate to the app and set up initial state
  await page.goto('http://localhost:3000');

  // Wait for the app to load
  await page.waitForLoadState('networkidle');

  // Set up test data if needed
  await setupTestData(page);

  // Take a screenshot of the initial state
  await page.screenshot({ path: 'test-results/initial-state.png' });

  await browser.close();
}

async function setupTestData(page: unknown) {
  try {
    // Create test user if needed
    await createTestUser(page);
    
    // Create test courses if needed
    await createTestCourses(page);
    
    // Set up test categories
    await createTestCategories(page);
    
    console.log('Test data setup completed');
  } catch (error) {
    console.error('Error setting up test data:', error);
  }
}

async function createTestUser(page: unknown) {
  try {
    // Navigate to registration page
    await page.goto('http://localhost:3000/auth/register');
    
    // Fill registration form for admin user
    await page.fill('input[name="name"]', 'Test Admin');
    await page.fill('input[name="email"]', 'integration.test.admin@example.com');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirmPassword"]', 'testpassword123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for registration to complete
    await page.waitForTimeout(2000);
    
    console.log('Test admin user created');
  } catch (error) {
    console.log('Test admin user creation failed or user already exists');
  }
}

async function createTestCourses(page: unknown) {
  try {
    // Navigate to admin courses page
    await page.goto('http://localhost:3000/admin/courses');
    
    // Check if courses exist
    const courseCount = await page.locator('[data-testid="course-card"]').count();
    
    if (courseCount === 0) {
      // Create test course
      await page.click('button[data-testid="create-course"]');
      
      await page.fill('input[name="title"]', 'Test Course');
      await page.fill('textarea[name="description"]', 'This is a test course for automated testing');
      await page.selectOption('select[name="category"]', '1');
      await page.fill('input[name="price"]', '99.99');
      
      await page.click('button[type="submit"]');
      
      console.log('Test course created');
    }
  } catch (error) {
    console.log('Test course creation failed or courses already exist');
  }
}

async function createTestCategories(page: unknown) {
  try {
    // Navigate to admin categories page
    await page.goto('http://localhost:3000/admin/categories');
    
    // Check if categories exist
    const categoryCount = await page.locator('[data-testid="category-card"]').count();
    
    if (categoryCount === 0) {
      // Create test category
      await page.click('button[data-testid="create-category"]');
      
      await page.fill('input[name="name"]', 'Test Category');
      await page.fill('textarea[name="description"]', 'This is a test category for automated testing');
      
      await page.click('button[type="submit"]');
      
      console.log('Test category created');
    }
  } catch (error) {
    console.log('Test category creation failed or categories already exist');
  }
}

export default globalSetup; 