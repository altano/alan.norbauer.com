import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import packageJson from "eslint-plugin-package-json";
import eslint from "@eslint/js";
import astroEslintParser from "astro-eslint-parser";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  globalIgnores([
    "src/content/articles/browser-debugging-tricks/_scratch/",
    "postcss.config.cjs",
  ]),
  eslint.configs.recommended,

  // astro
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    files: ["**/*.astro"],
    rules: {
      // override/add rules settings here, such as:
      "astro/no-set-html-directive": "error",
    },
  },

  // React hooks
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },

  // .ts/tsx typescript
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // projectService: true,
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
    },
  },

  // Package.json
  packageJson.configs.recommended,

  // Prettier
  {
    ...prettier,
    rules: {
      ...prettier.rules,
      "prettier/prettier": "off",
    },
  },

  // // TODO: Remove
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   languageOptions: {
  //     // Allows Astro components to be parsed.
  //     parser: astroEslintParser,
  //     // Parse the script in `.astro` as TypeScript by adding the following configuration.
  //     // It's the setting you need when using TypeScript.
  //     parserOptions: {
  //       parser: "@typescript-eslint/parser",
  //       extraFileExtensions: [".astro"],
  //       // The script of Astro components uses ESM.
  //       sourceType: "module",
  //     },
  //   },
  // },

  // .astro typescript
  {
    files: ["**/*.astro"],
    // ...

    languageOptions: {
      // Allows Astro components to be parsed.
      parser: astroEslintParser,
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
        // The script of Astro components uses ESM.
        sourceType: "module",
      },
    },
    processor: "astro/client-side-ts", // <- Uses the "client-side-ts" processor.
  },

  // Allow triple-slash references in `*.d.ts` files.
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // Disable typechecked in .js files
  {
    // in js files ...
    files: ["**/*.{js,mjs,json}"],
    ...tseslint.configs.disableTypeChecked,
    // ... disable type-aware linting
    // ... disable type-syntax-requiring rules
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      // https://github.com/typescript-eslint/typescript-eslint/issues/8955
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/parameter-properties": "off",
    },
  },

  // Disable irrelevant rules in .json files
  {
    files: ["*.json", "**/*.json"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // Files that can assume a node environment
  {
    files: [
      "src/content/articles/satori-fit-text/sandboxes/satori-fit-text/**/*",
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
);
