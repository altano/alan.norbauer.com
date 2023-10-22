import { SvgLinkOptions } from "./SvgLinkOptions";
import { InlineSvgIcon } from "./inlineSvgIcon";
import twitterSVG from "assets/images/icons/twitter.svg";
import pkg from "@root/package.json";

export function TwitterLink(options: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      {...options}
      src={twitterSVG}
      alt="Twitter"
      href={`https://twitter.com/${pkg.author.social.twitter}`}
    />
  );
}
