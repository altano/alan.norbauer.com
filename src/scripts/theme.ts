const RESOLVED_THEMES = ["dark", "light"] as const;
type ResolvedTheme = (typeof RESOLVED_THEMES)[number];

function isResolvedTheme(value: unknown): value is ResolvedTheme {
  return RESOLVED_THEMES.some((theme) => theme === value);
}

function getResolvedTheme(): ResolvedTheme {
  const theme =
    document.documentElement.attributes.getNamedItem("data-theme")?.value;

  // support old versions of the site, e.g. (data-theme=eighties)
  return isResolvedTheme(theme) ? theme : "light";
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
