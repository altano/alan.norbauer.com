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
  display: "inline-flex",
  alignItems: "center",
});

type ChildOrSrc =
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
  height,
  width,
  rel,
  ...otherProps
}: ChildOrSrc) {
  return (
    <Link className={linkStyle} href={href} rel={rel}>
      {text ? <styled.span mr="5px">{text}</styled.span> : null}
      {"children" in otherProps ? (
        otherProps.children
      ) : "src" in otherProps ? (
        <Image
          width={height ?? 18}
          height={width ?? 18}
          className={svgImgStyle}
          src={otherProps.src}
          alt={otherProps.alt}
        />
      ) : null}
    </Link>
  );
}
