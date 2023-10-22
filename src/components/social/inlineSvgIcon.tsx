import Image from "next/image";
import Link from "next/link";
import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import type { Url } from "next/dist/shared/lib/router/router";

export const svgImgStyle = css({
  lineHeight: "none",
  transitionProperty: "filter",
  transitionDuration: "var(--durations-color-scheme)",

  _dark: {
    filter: "invert(100%)",
  },
});

export const linkStyle = css({
  wordBreak: "break-all",
  filter: "grayscale(1)",
  display: "inline-flex",
  alignItems: "center",
});

export type ChildOrSrc =
  | {
      src: StaticImport;
      alt: string;
      href: Url;
      rel?: string;
      text?: string;
      height?: number;
      width?: number;
    }
  | {
      href: Url;
      rel?: string;
      text?: string;
      height?: number;
      width?: number;
      children?: React.ReactNode;
    };

export function InlineSvgIcon({
  text,
  href,
  height = 18,
  width = 18,
  rel,
  ...otherProps
}: ChildOrSrc) {
  // const textFontSize = height < 50 ? undefined : height / 2;
  return (
    <Link
      className={linkStyle}
      href={href}
      rel={rel}
      style={{ gap: width / 3 }}
    >
      {"children" in otherProps ? (
        <span style={{ width, height }}>{otherProps.children}</span>
      ) : "src" in otherProps ? (
        <Image
          width={height}
          height={width}
          className={svgImgStyle}
          src={otherProps.src}
          alt={otherProps.alt}
        />
      ) : null}
      {text ? <styled.span style={{}}>{text}</styled.span> : null}
    </Link>
  );
}
