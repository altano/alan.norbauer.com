import { InlineSvgIcon } from "./inlineSvgIcon";
import instagramSVG from "assets/images/icons/instagram.svg";
import pkg from "@root/package.json";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function InstagramLink({
  width = 17, // Looks slightly too large at 18x18 relative to the other icons
  height = 17,
  ...otherOptions
}: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      width={width}
      height={height}
      {...otherOptions}
      src={instagramSVG}
      alt="Instagram"
      href={`https://www.instagram.com/${pkg.author.social.instagram}`}
    />
  );
}
