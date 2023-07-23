import { InlineSvgIcon } from "./inlineSvgIcon";
import threadsSVG from "assets/images/icons/threads.svg";
import pkg from "@root/package.json";

export function ThreadsLink({ text }: { text?: string }) {
  const handle = pkg.author.social.threads;
  return (
    <InlineSvgIcon
      src={threadsSVG}
      alt="Threads.net"
      text={text}
      href={`https://www.threads.net/${handle}`}
    />
  );
}
