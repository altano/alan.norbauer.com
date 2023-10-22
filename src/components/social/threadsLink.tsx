import { InlineSvgIcon } from "./inlineSvgIcon";
import threadsSVG from "assets/images/icons/threads.svg";
import pkg from "@root/package.json";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function ThreadsLink(options: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      {...options}
      src={threadsSVG}
      alt="Threads.net"
      href={`https://www.threads.net/${pkg.author.social.threads}`}
    />
  );
}
