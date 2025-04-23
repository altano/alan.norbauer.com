import type { PlaywrightTestConfig } from "@playwright/test";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export default async function teardown(_config: PlaywrightTestConfig) {
  console.log("global teardown");
  return execAsync("pnpm astro preferences reset devToolbar.enabled");
}
