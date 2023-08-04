import { InlineSvgIcon } from "./inlineSvgIcon";
import rssSVG from "assets/images/icons/rss.svg";

export function FeedLink({ text }: { text?: string }) {
  return (
    <InlineSvgIcon
      src={rssSVG}
      alt="Subscribe to RSS Feed"
      text={text}
      href="/rss.xml"
    />
  );
}
