import { Sandpack } from "@codesandbox/sandpack-react";
import appJSText from "./files/app.js?raw";
import fontJSText from "./files/font.js?raw";

function useResolvedTheme() {
  const resolvedTheme =
    document.documentElement.attributes.getNamedItem("data-theme")?.value;
  return resolvedTheme;
}

export function SatoriFitTextBasicSandbox() {
  const resolvedTheme = useResolvedTheme();

  return (
    <Sandpack
      customSetup={{
        dependencies: {
          "@altano/satori-fit-text": "1.0.2",
        },
      }}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      template="react"
      options={{
        layout: "preview",
        editorHeight: 500,
      }}
      files={{
        "/App.js": appJSText,
        "/font.js": fontJSText,
      }}
    />
  );
}
