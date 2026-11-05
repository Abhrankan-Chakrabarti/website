// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Determine report folder dynamically based on project argument or environment variable
const reportDir = process.env.PLAYWRIGHT_REPORT_DIR || (
  process.argv.includes('--project=live') ? 'playwright-live-report' :
  process.argv.includes('--project=local') ? 'playwright-local-report' :
  'playwright-report'
);

/**
 * Playwright configuration for testing the Lab at https://abhrankan.duckdns.org
 * Supports both live cloud deployment and local static preview.
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1, // serial execution to prevent concurrent clipboard/URL race conditions
  retries: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: reportDir, open: 'never' }],
  ],
  use: {
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'live',
      use: {
        baseURL: process.env.LIVE_URL || 'https://abhrankan.duckdns.org',
      },
    },
    {
      name: 'local',
      use: {
        baseURL: 'http://127.0.0.1:8000',
      },
    },
  ],
  webServer: {
    command: 'python -m http.server 8000',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
