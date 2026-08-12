import { defineConfig, devices } from "@playwright/test";
import nullthrows from "nullthrows";
import isCI from "is-ci";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  quiet: true,
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
      /**
       * Node-only unit tests — no browser is ever launched, because these tests
       * never touch the `page` fixture. Named `*.unit.ts` so the browser
       * projects below skip them via Playwright's default `*.spec.ts` matcher.
       */
      name: "unit",
      testMatch: "**/*.unit.ts",
      /**
       * Drop the default `{-projectName}{-snapshotSuffix}` from the snapshot
       * path. That suffix defaults to `process.platform`, which earns its keep
       * for the e2e screenshots below (font rendering is OS-specific) but is
       * just noise for rendered HTML, which is identical everywhere.
       */
      snapshotPathTemplate:
        "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}",
    },

    {
      /**
       * Layout tests: ones that set the viewport themselves to assert how a
       * given width is arranged, rather than how a given engine renders. One
       * browser is enough for that, so these run here instead of across every
       * project below.
       *
       * Reserve this for a *small* number of tests. Each one sweeps many more
       * viewports than the fixed-device projects below ever do, so a single
       * spec here can outweigh a whole browser project in screenshots and
       * runtime. If a test does not genuinely change behavior with width, it
       * belongs in a `*.spec.ts` instead.
       *
       * Named `*.layout.ts` so the browser projects' default `*.spec.ts`
       * matcher skips them.
       */
      name: "layout",
      testMatch: "**/*.layout.ts",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      /**
       * Simple snapshot tests: Chrome only, at the default desktop viewport.
       *
       * For assertions that do not vary by engine or by width — a syntax
       * token's color in light versus dark, say, which comes from our own
       * theme config and is the same everywhere. Running those across the
       * fixed-device projects below would multiply screenshots without
       * testing anything new, and they have no reason to sweep viewports the
       * way the `layout` project above does.
       *
       * Named `*.simple.ts` so the browser projects' default `*.spec.ts`
       * matcher skips them.
       */
      name: "simple",
      testMatch: "**/*.simple.ts",
      use: { ...devices["Desktop Chrome"] },
    },

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
