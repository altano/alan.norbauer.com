import { SvgLinkOptions } from "./SvgLinkOptions";
import { InlineSvgIcon } from "./inlineSvgIcon";
import rssSVG from "assets/images/icons/rss.svg";

export function FeedLink(options: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      {...options}
      src={rssSVG}
      alt="Subscribe to RSS Feed"
      href="/rss.xml"
    />
  );
}
