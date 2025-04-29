import { defineConfig, devices } from "@playwright/test";
import nullthrows from "nullthrows";

const isCI = process.env.ci;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(
    import.meta.dirname,
    isCI ? ".env.test-ci" : ".env.test-dev",
  ),
});

const env = {
  webServer: {
    command: nullthrows(process.env.WEBSERVER_COMMAND),
    url: nullthrows(process.env.WEBSERVER_URL),
  },
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/global-setup.ts",
  globalTeardown: "./tests/global-teardown.ts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  ...(isCI ? { workers: 1 } : undefined),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  webServer: {
    command: env.webServer.command,
    url: env.webServer.url,
    timeout: 120 * 1000,
    reuseExistingServer: !isCI,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: env.webServer.url,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Desktop Firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Desktop Safari" /* HiDPI testing (deviceScaleFactor=2)  */,
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome - Pixel 5",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari - iPhone SE" /* Tiny, 320px wide */,
      use: { ...devices["iPhone SE"] },
    },
    {
      name: "Mobile Safari - iPhone 15 Pro Max",
      use: { ...devices["iPhone 15 Pro Max"] },
    },

    /* Throw in some tablets */
    {
      name: "Webkit - Kindle Fire HDX",
      use: { ...devices["Kindle Fire HDX"] },
    },
    {
      name: "Mobile Safari - iPad Mini",
      use: { ...devices["iPad Mini"] },
    },
    {
      /* Has 1024px width which will test the low end of lg viewport */
      name: "Mobile Safari - PlayBook landscape",
      use: { ...devices["Blackberry PlayBook landscape"] },
    },

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
});
