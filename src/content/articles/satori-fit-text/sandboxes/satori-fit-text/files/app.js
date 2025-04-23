import { useEffect, useState } from "react";
import { findLargestUsableFontSize } from "@altano/satori-fit-text";
import { getInter } from "./font.js";

export default function App() {
  const [fontSize, setFontSize] = useState(0);
  const width = 300;
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
  }, [text, width, height, lineHeight, weight]);

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
    return <div style={style}>Computing largest possible font size...</div>;
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
