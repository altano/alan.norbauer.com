import { cx } from "@styled-system/css";
import { Inter, IBM_Plex_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ibm-plex-mono",
});

export const fontClassName = cx(inter.variable, ibmPlexMono.variable);
