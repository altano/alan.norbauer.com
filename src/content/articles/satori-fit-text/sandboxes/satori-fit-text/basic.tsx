"use client";

import dynamic from "next/dynamic";

const SandpackReact = dynamic(
  () => import("@codesandbox/sandpack-react").then((mod) => mod.Sandpack),
  { ssr: false },
);

import { useTheme } from "next-themes";

export function SatoriFitTextBasicSandbox() {
  const { theme, systemTheme, resolvedTheme } = useTheme();
  console.log({ theme, systemTheme, resolvedTheme });

  return (
    <SandpackReact
      customSetup={{
        dependencies: {
          "@altano/satori-fit-text": "0.1.1",
        },
      }}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      template="react"
      options={{
        layout: "preview",
        editorHeight: 500,
      }}
      files={{
        "/App.js": `
import { useEffect, useState } from "react";
import { findLargestUsableFontSize } from "@altano/satori-fit-text";
import { getInter } from "./font.js";

export default function App() {
  const [fontSize, setFontSize] = useState(0);
  const width = 350;
  const height = 150;
  const text = "Hello";
  const lineHeight = 1;
  const weight = 500;

  useEffect(() => {
    setFontSize(0);
    
    async function compute() {
      const largestUsableFontSize = await findLargestUsableFontSize({
        lineHeight,
        font: await getInter(weight),
        text,
        maxWidth: width,
        maxHeight: height,
      });

      setFontSize(largestUsableFontSize);
    }

    compute();
  }, []);

  const style = {
    lineHeight, 
    width, 
    height, 
    fontWeight: weight,
    color: "white",
    backgroundColor: "black",
    position: "relative",
  };

  if (fontSize === 0) {
    return <div style={style}>Computing largest possible font size...</div>
  }

  return (
    <div style={{ ...style, fontSize }}>
      {text}
      <span
        style={{
          position: "absolute",
          fontSize: "16px",
          right: 5,
          bottom: 5,
          opacity: "50%",
        }}
      >
        {fontSize}px
      </span>
    </div>
  );
}
        `.trim(),
        "/font.js": `
const fontCache = new Map();

export async function getInter(weight) {
  {
    const font = fontCache.get(weight);
    if (font != null) {
      return font;
    }
  }

  const url = \`https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.17/files/inter-latin-$\{weight\}-normal.woff\`;
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  const font = {
    name: "Inter",
    data: buffer,
    weight,
  };

  fontCache.set(weight, font);

  return font;
}
        `.trim(),
      }}
    />
  );
}
