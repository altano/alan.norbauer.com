import pkg from "@root/package.json";
import { css, cx } from "@styled-system/css";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { token } from "@styled-system/tokens";

const ColorSchemeToggle = dynamic(() => import("@/utility/colorSchemeToggle"), {
  ssr: false,
});

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ibm-plex-mono",
});

const bodyStyles = css({
  container: "body / normal",
  fontSize: "20px",
  fontFamily: "var(--font-inter)",
  backgroundColor: "var(--background-color)",

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
    <html lang="en" className="theme-basic">
      <body className={cx(inter.variable, ibmPlexMono.variable, bodyStyles)}>
        <ColorSchemeToggle />
        <script
          dangerouslySetInnerHTML={{
            /* TODO Can this be replaced with middleware? */
            /* https://github.com/vercel/next.js/discussions/50772 */
            __html: `
                try {
                  if (
                    localStorage.getItem("color-scheme") === "light" ||
                    (localStorage.getItem("color-scheme") == null &&
                      window.matchMedia("(prefers-color-scheme: light)").matches)
                  ) {
                    document.documentElement.classList.remove("dark")
                    document.documentElement.classList.add("light")
                  } else {
                    document.documentElement.classList.remove("light")
                    document.documentElement.classList.add("dark")
                  }
                } catch (_) {}
              `,
          }}
        ></script>
        {children}
      </body>
    </html>
  );
}
