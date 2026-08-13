import { chromium, type FullConfig } from "@playwright/test";

/**
 * Warm the dev server before any test runs.
 *
 * On a cold Astro/Vite dev server the first request to a route triggers
 * on-demand compilation and Vite dependency optimization. The dependency
 * optimizer forces a one-time full-page reload once it finishes crawling. When
 * a screenshot test raced that reload it either lost its execution context
 * mid-`evaluate` ("Execution context was destroyed, most likely because of a
 * navigation") or had its scroll position reset to the top — both of which
 * showed up as flaky snapshot failures on whichever tests happened to run first
 * against the fresh server.
 *
 * Visiting the scroll-sensitive routes here (and waiting for the network to go
 * idle) makes that compilation + reload happen exactly once, up front, so no
 * test races it. The production preview server used in CI serves static files
 * and does none of this, so warming it is a cheap no-op there.
 */
export default async function setup(config: FullConfig) {
  const baseURL =
    config.projects[0]?.use.baseURL ?? process.env["WEBSERVER_URL"];
  if (!baseURL) {
    console.log("global setup: no baseURL, skipping warm-up");
    return;
  }

  // Routes our screenshot tests scroll within. Warming these settles the dep
  // graph shared by the rest of the site too.
  const routes = [
    "/",
    "/articles/devbox-intro",
    "/articles/astro-vs-nextjs-page-size",
    "/articles/stacks-in-jujutsu",
    // The article-navigation snapshots scroll their `<nav>` into view on these.
    "/articles/github-stacks-with-jujutsu",
    "/articles/relay-style-graphql",
  ];

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const route of routes) {
      const url = new URL(route, baseURL).toString();
      await page.goto(url, { waitUntil: "load" });
      // Let Vite's dep-optimization reload (if any) fire and fully settle. A
      // second visit guarantees we observe the post-optimization, no-reload
      // steady state before tests begin.
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.goto(url, { waitUntil: "networkidle" }).catch(() => {});
    }
    console.log(`global setup: warmed ${routes.join(", ")}`);
  } finally {
    await browser.close();
  }
}
