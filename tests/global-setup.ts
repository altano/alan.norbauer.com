import type { PlaywrightTestConfig } from "@playwright/test";

export default async function setup(_config: PlaywrightTestConfig) {
  console.log("global setup");
  return Promise.resolve();
}
