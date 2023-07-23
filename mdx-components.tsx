import { Chrome, Edge, Firefox } from "@/components/browser-logos";
import { Code } from "bright";
import firefoxLightCustomized from "./src/styles/code-themes/firefox-light-customized.json";
import Image from "next/image";

import type { MDXComponents } from "mdx/types";

Code.theme = {
  dark: "dracula",
  light: firefoxLightCustomized,
  lightSelector: `:root.light`,
  darkSelector: `:root.dark`,
};

function getLanguage(codeProps: any) {
  // Mostly copied-and-pasted out of bright (https://github.com/code-hike/bright) itself
  const className = codeProps.children?.props?.className ?? "";
  const metastring = className.replace("language-", "");
  const lang = metastring.split(".").pop();
  return lang == null || lang === "" ? null : lang;
}

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    ...components,
    pre: (props) => {
      // const { children, ...rest } = props;
      // const { children: childchild, ...restChildProps } = children?.props ?? {};
      // console.log("PRE", { rest, restChildProps });
      const lang = getLanguage(props);
      return (
        <Code
          {...props}
          lineNumbers={lang != null && lang !== "text" && lang !== "binary"}
          codeClassName={lang ? `language-${lang}` : undefined}
        />
      );
    },
    // @ts-expect-error
    img: Image,
    // @ts-expect-error
    Image,
    Chrome,
    Firefox,
    Edge,
  };
}
