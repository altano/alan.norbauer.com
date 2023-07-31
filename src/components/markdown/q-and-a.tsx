import { css } from "@styled-system/css";
import React from "react";

export function QuestionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={css({
        "& h3": { marginBottom: 0 },
      })}
    >
      {children}
    </div>
  );
}

function unwrapElement(el: React.ReactNode): React.ReactNode {
  if (el != null && typeof el === "object" && "type" in el) {
    return el.props.children;
  } else {
    return el;
  }
}

export function QuestionBody({ children }: { children: React.ReactNode }) {
  const text = unwrapElement(children);
  return <p className={css({ marginTop: 0 })}>&hellip; {text}</p>;
}

export function Answer({ children }: { children: React.ReactNode }) {
  const text = unwrapElement(children);
  return (
    <p>
      <strong>A:</strong> {text}
    </p>
  );
}
