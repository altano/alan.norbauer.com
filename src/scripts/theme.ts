type ResolvedTheme = "dark" | "light";
// https://github.com/alex-grover/astro-themes/issues/41
// type UnderlyingTheme = "system" | ResolvedTheme;

export function getResolvedTheme(): ResolvedTheme {
  const theme =
    document.documentElement.attributes.getNamedItem("data-theme")?.value;

  if (theme !== "light" && theme !== "dark") {
    throw new Error(`Unexpected theme: ${theme}`);
  }
  return theme;
}

export function toggleTheme() {
  updateTheme(getResolvedTheme() === "light" ? "dark" : "light");
}

function updateTheme(theme: string) {
  switch (theme) {
    case "system":
      document.dispatchEvent(new CustomEvent("set-theme", { detail: null }));
      break;
    case "dark":
    case "light":
      document.dispatchEvent(new CustomEvent("set-theme", { detail: theme }));
      break;
    default:
      throw new Error(`Unexpected theme value: ${theme}`);
  }
}
