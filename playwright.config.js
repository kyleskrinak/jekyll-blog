// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: { toHaveScreenshot: { threshold: 0.02 } },
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:4000',
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    ignoreHTTPSErrors: true
  },
  webServer: {
    command: 'npx http-server _site -p 4000',
    url: 'http://127.0.0.1:4000',
    timeout: 60_000,
    reuseExistingServer: true
  }
});
