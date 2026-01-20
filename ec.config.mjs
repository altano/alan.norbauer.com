import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import firefoxLightTheme from "./src/styles/code-themes/firefox-light-customized.json" with { type: "json" };

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
  plugins: [pluginLineNumbers()],
  cascadeLayer: "code",
  themes: [firefoxLightTheme, "dracula"],
  customizeTheme(theme) {
    if (theme.name.toLocaleLowerCase().includes("light")) {
      theme.name = "light";
    } else if (theme.name.toLocaleLowerCase().includes("dracula")) {
      theme.name = "dark";
    }
  },
  defaultProps: {
    // code blocks look better with scrolling rather than wrapping, I think
    wrap: false,
    showLineNumbers: true,
    overridesByLang: {
      // turn off line numbers by default for a few languages, plus
      // everything documented as being in a terminal frame at
      // https://expressive-code.com/key-features/frames/#terminal-frames
      "ascii,text,ansi,bash,bat,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,zsh":
        { showLineNumbers: false },
    },
  },
  styleOverrides: {
    // borderWidth: "0", // This hides the active tab bottom border, can't use
    borderColor: "transparent", // make the border transparent instead
    focusBorder: "transparent",
    uiFontFamily: "var(--font-ibm-plex-mono)",
    uiFontSize: "16px",
    codeFontFamily: "var(--font-ibm-plex-mono)",
    codeFontSize: "16px", // don't use rem, it looks like it gets applied twice (so 0.8rem is computed as 20*.8*.8=12.8 instead of 16)
    frames: {
      frameBoxShadowCssValue: "none",
      tooltipSuccessForeground: "var(--text)",
      tooltipSuccessBackground: "var(--bg)",
    },
  },
  shiki: {
    langAlias: {
      ascii: "text",
    },
  },
};
