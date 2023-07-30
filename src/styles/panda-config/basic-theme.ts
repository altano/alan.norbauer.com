import {
  defineLayerStyles,
  defineSemanticTokens,
  defineTokens,
} from "@pandacss/dev";

import type { Theme } from "@pandacss/types";

const theme: Theme = {
  tokens: {
    durations: defineTokens.durations({
      colorScheme: { value: "{durations.fastest}" },
    }),
    colors: defineTokens.colors({
      seafoam: { value: "#00FFCC" },
      lavender: { value: "#e2d9fc" },
      light: { value: "white" },
      dark: { value: "#111111" },
      lightGray: { value: "#FAFAFA" },
      fuchsiaish: { value: "#ff006a" },
      rhodamine: { value: "#E10098" },
      sunsetBlvd: { value: "#FCDED9" },
      draculaBackground: { value: "#282A36" },
      electricBlue: { value: "#2de1fc" },
      offWhite: { value: "#EAEAEA" },
    }),
  },
  semanticTokens: {
    spacing: defineSemanticTokens.spacing({}),
    // TODO Factor all semantic colors out into color definitions for
    // readability
    colors: defineSemanticTokens.colors({
      bg: {
        DEFAULT: {
          value: {
            base: "{colors.light}",
            _dark: "{colors.dark}",
          },
          description: "Main Background",
        },
        highlight: {
          value: {
            base: "#fff8dc",
            _dark: "#FCEAA8",
          },
          description: "A highlighted section or text",
        },
        card: {
          value: {
            base: "{colors.lightGray}",
            _dark: "{colors.draculaBackground}",
          },
          description: "Card Background",
        },
        tag: {
          value: {
            base: "{colors.gray.100}",
            _dark: "{colors.draculaBackground}",
          },
        },
        selection: {
          value: {
            base: "{colors.electricBlue}",
            _dark: "{colors.seafoam}",
          },
        },
        footer: {
          value: {
            base: "{colors.sunsetBlvd}",
            _dark: "{colors.draculaBackground}",
          },
        },
      },
      text: {
        DEFAULT: {
          value: {
            base: "{colors.dark}",
            _dark: "{colors.offWhite}",
          },
          description: "Main text color (e.g. body)",
        },
        highlight: {
          value: {
            base: "{colors.dark}",
            _dark: "{colors.dark}",
          },
          description: "A highlighted section or text",
        },
        button: {
          value: {
            base: "{colors.dark}",
            _dark: "{colors.dark}",
          },
        },
        card: {
          value: {
            base: "black",
            _dark: "{colors.offWhite}",
          },
        },
        faded: {
          value: {
            base: "{colors.gray.400}",
            _dark: {
              color: "{colors.gray.600}",
            },
          },
        },
        selection: {
          value: {
            base: "black",
            _dark: "black",
          },
        },
        footer: {
          value: {
            base: "black",
            _dark: "{colors.offWhite}",
          },
        },
      },
      accent: {
        primary: {
          value: {
            base: "{colors.fuchsiaish}",
            _dark: "{colors.seafoam}",
          },
        },
      },
    }),
  },
  layerStyles: defineLayerStyles({
    card: {
      description: "A card holding some stand-out content",
      value: {
        background: "bg.card",
        borderRadius: "md",
        padding: "5",
        // TODO Revisit after discussing in  https://github.com/chakra-ui/panda/discussions/1081
        // transition:
        //   "color {durations.colorScheme}, background {durations.colorScheme}",
      },
    },
  }),
};

export default theme;
