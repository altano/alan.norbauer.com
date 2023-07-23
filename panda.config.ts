import { defineConfig } from "@pandacss/dev";
import { globalCss } from "./src/styles/panda-config/globalCss";
import basicTheme from "@/styles/panda-config/basic-theme";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      ...basicTheme,
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  jsxFramework: "react",

  globalCss: globalCss,
});
