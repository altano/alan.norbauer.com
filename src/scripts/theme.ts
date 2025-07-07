import { z } from "astro/zod";

const ResolvedThemeSchema = z.union([z.literal("dark"), z.literal("light")]);
type ResolvedTheme = z.infer<typeof ResolvedThemeSchema>;

const ThemePreferenceSchema = z.union([ResolvedThemeSchema, z.literal("")]);
type ThemePreference = z.infer<typeof ThemePreferenceSchema>;

export function getResolvedTheme(): ResolvedTheme {
  const theme =
    document.documentElement.attributes.getNamedItem("data-theme")?.value;
  return ResolvedThemeSchema.parse(theme);
}

export function getThemePreference(): ThemePreference {
  const theme = document.documentElement.attributes.getNamedItem(
    "data-theme-preference",
  )?.value;
  return ThemePreferenceSchema.parse(theme);
}

export function toggleTheme() {
  updateTheme(getResolvedTheme() === "light" ? "dark" : "light");
}

export function updateTheme(theme: "system" | "dark" | "light") {
  switch (theme) {
    case "system":
      document.dispatchEvent(new CustomEvent("set-theme", { detail: null }));
      break;
    case "dark":
    case "light":
      document.dispatchEvent(new CustomEvent("set-theme", { detail: theme }));
      break;
    default:
      theme satisfies never;
  }
}
