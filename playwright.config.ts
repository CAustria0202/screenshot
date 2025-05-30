import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/tests',
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: './e2e/test-results',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list']],
  timeout: 80000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://preview.toyotacarrental-alpha.pages.dev/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    launchOptions: {
      slowMo: 1000,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions'
      ]
    }
  },



  /* Configure projects for major browsers */
  projects: [
    {
      name: 'default',
      testMatch: /.*\.spec\.ts/,
      testIgnore: [
        /.*test-customer-registration-form\.spec\.ts/,
        /.*test-self-drive-user\.spec\.ts/,
        /.*test-reset-password\.spec\.ts/
      ],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup-registration',
      testMatch: /.*register\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'customer-registration',
      testMatch: /.*test-customer-registration-form\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/register.json'
      },
      dependencies: ['setup-registration']
    },
    {
      name: 'setup-login',
      testMatch: /.*login\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'logged-in-user',
      testMatch: /.*test-self-drive-user\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/login.json'
      },
      dependencies: ['setup-login']
    },
    {
      name: 'setup-reset',
      testMatch: /.*reset-password\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'reset-password',
      testMatch: /.*test-reset-password\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/reset-password.json'
      },
      dependencies: ['setup-reset']
    }
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'bun run dev',
  //   url: 'http://localhost:5555/',
  //   reuseExistingServer: !process.env.CI,
  // },
});
