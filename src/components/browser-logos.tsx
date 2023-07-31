import React from "react";
import Image from "next/image";
import { css } from "@styled-system/css";
import chromeIcon from "/assets/images/browser-logos/chrome.svg";
import firefoxIcon from "/assets/images/browser-logos/firefox.svg";
import edgeIcon from "/assets/images/browser-logos/edge.svg";

type ImageMinus<T extends string> = Omit<React.ComponentProps<typeof Image>, T>;
type BrowserLogoProps = ImageMinus<"alt" | "src" | "width" | "height">;

const logoStyles = css({
  display: "inline",
  marginRight: "2",
});

export function Chrome(props: BrowserLogoProps) {
  return (
    <Image
      data-no-style
      src={chromeIcon}
      className={logoStyles}
      width={40}
      height={40}
      alt="Chrome"
      {...props}
    />
  );
}

export function Firefox(props: BrowserLogoProps) {
  return (
    <Image
      data-no-style
      src={firefoxIcon}
      className={logoStyles}
      width={40}
      height={40}
      alt="Firefox"
      {...props}
    />
  );
}

export function Edge(props: BrowserLogoProps) {
  return (
    <Image
      data-no-style
      src={edgeIcon}
      className={logoStyles}
      width={40}
      height={40}
      alt="Edge"
      {...props}
    />
  );
}
