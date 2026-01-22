import { z } from "astro/zod";

const ResolvedThemeSchema = z.union([z.literal("dark"), z.literal("light")]);
type ResolvedTheme = z.infer<typeof ResolvedThemeSchema>;

function getResolvedTheme(): ResolvedTheme {
  const theme =
    document.documentElement.attributes.getNamedItem("data-theme")?.value;

  // support old versions of the site, e.g. (data-theme=eighties)
  const resolved = ResolvedThemeSchema.safeParse(theme);
  return resolved.success ? resolved.data : "light";
}

// support old versions of the site, e.g. (data-theme=eighties), by unsetting the bad theme
export function ensureValidTheme() {
  const actualTheme =
    document.documentElement.attributes.getNamedItem("data-theme")?.value;
  const resolvedTheme = getResolvedTheme();

  if (actualTheme !== resolvedTheme) {
    localStorage.removeItem("theme");
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }
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
