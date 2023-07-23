import Image from "next/image";
import Link from "next/link";
import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import type { Url } from "next/dist/shared/lib/router/router";

export const svgImgStyle = css({
  lineHeight: "1rem",
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

export function InlineSvgIcon({
  src,
  alt,
  text,
  href,
  height,
  width,
}: {
  src: StaticImport;
  alt: string;
  href: Url;
  text?: string;
  height?: number;
  width?: number;
}) {
  return (
    <Link className={linkStyle} href={href}>
      {text ? <styled.span mr="5px">{text}</styled.span> : null}
      <Image
        width={height ?? 18}
        height={width ?? 18}
        className={svgImgStyle}
        src={src}
        alt={alt}
      />
    </Link>
  );
}
