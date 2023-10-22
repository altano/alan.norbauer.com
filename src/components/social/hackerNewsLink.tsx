import { InlineSvgIcon } from "./inlineSvgIcon";
import hackerNewsSVG from "assets/images/icons/hacker-news.svg";
import pkg from "@root/package.json";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function HackerNewsLink(options: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      {...options}
      src={hackerNewsSVG}
      alt="Hacker News"
      href={`https://news.ycombinator.com/user?id=${pkg.author.social.hackernews}`}
    />
  );
}
