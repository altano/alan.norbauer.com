import pkg from "@root/package.json";
import { css, cx } from "@styled-system/css";
import { token } from "@styled-system/tokens";
import { fontClassName } from "@/styles/fonts";
import { Providers } from "@/components/providers";
import { ThemeSwitch } from "@/components/theme/themeSwitcher";

import "./global.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | ${pkg.author.name}`,
    default: pkg.author.name,
  },
  description: pkg.description,
  openGraph: {
    title: pkg.author.name,
    description: pkg.description,
    type: "website",
  },
  metadataBase: new URL(pkg.homepage),
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: token("colors.light") },
    { media: "(prefers-color-scheme: dark)", color: token("colors.dark") },
  ],
};

const bodyStyles = css({
  container: "body / normal",
  minWidth: "320px",

  fontSize: "20px",
  fontFamily: "var(--font-inter)",
  bg: "bg",
  color: "text",

  transition:
    "color var(--durations-color-scheme), background var(--durations-color-scheme)",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // We're going to run our script that adds the theme to the <html> class.
      // There is no other way to avoid hydration warnings (Accept-CH isn't
      // widely supported and doesn't work on first request)
      suppressHydrationWarning={true}
    >
      <body className={cx(fontClassName, bodyStyles)}>
        <Providers>
          {children}
          <ThemeSwitch
            className={css({
              position: "fixed",
              right: "10px",
              bottom: "10px",
            })}
          />
        </Providers>
      </body>
    </html>
  );
}
