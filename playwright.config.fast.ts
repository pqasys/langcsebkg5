import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for speed
  workers: 2, // Limited workers
  reporter: 'line', // Simple reporter
  timeout: 15000, // Shorter timeout
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off', // Disable tracing for speed
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'iPhone SE',
      use: { ...devices['iPhone SE'] },
    },
  ],
  // Remove webServer config to use existing server
}); 