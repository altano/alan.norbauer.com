import { useEffect, useState } from "react";
import { findLargestUsableFontSize } from "@altano/satori-fit-text";
import { getInter } from "./font.js";

export default function App() {
  return (
    <TextBox
      width={300}
      height={150}
      text="Hello"
      lineHeight={1}
      weight={500}
    />
  );
}

function TextBox({ width, height, text, lineHeight, weight }) {
  const [fontSize, setFontSize] = useState(0);

  useEffect(() => {
    // Workaround sandbox hot-reload: don't do this in production code.
    //
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
