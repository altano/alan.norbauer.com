import { Chrome, Edge, Firefox } from "@/components/browser-logos";
import { Code } from "bright";
import firefoxLightCustomized from "./src/styles/code-themes/firefox-light-customized.json";
import Image from "next/image";
import { focus } from "@/utility/bright-extensions/focus";
import { tabs } from "@/utility/bright-extensions/tabs";
import { title } from "@/utility/bright-extensions/title";
import { Answer, QuestionBody, QuestionHeading } from "@/components/markdown";

import type { MDXComponents } from "mdx/types";

Code.theme = {
  dark: "dracula",
  light: firefoxLightCustomized,
  lightSelector: `:root.light`,
  darkSelector: `:root.dark`,
};

Code.extensions = (Code.extensions ?? []).concat([tabs, title, focus]);

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
    QuestionHeading: QuestionHeading,
    QuestionBody: QuestionBody,
    Answer: Answer,
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
    Code: Code,
    // @ts-expect-error
    img: Image,
    Image,
    Chrome,
    Firefox,
    Edge,
  };
}
