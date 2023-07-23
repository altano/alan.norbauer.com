import path from "node:path";
import { fileURLToPath } from "url";

export function getProjectRootPath(): string {
  const modulePath = fileURLToPath(import.meta.url);
  return path.join(modulePath, "..", "..", "..");
}

/**
 * Get the absolute path of a file
 */
export function getAbsolutePathFromProjectRoot(
  /**
   * The path of the file, relative to the root of the project
   */
  ...rootRelativePaths: string[]
): string {
  return path.join(getProjectRootPath(), ...rootRelativePaths);
}
