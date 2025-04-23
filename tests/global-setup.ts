import type { PlaywrightTestConfig } from "@playwright/test";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export default async function setup(_config: PlaywrightTestConfig) {
  console.log("global setup");
  await execAsync("pnpm astro preferences set devToolbar.enabled false");
}
