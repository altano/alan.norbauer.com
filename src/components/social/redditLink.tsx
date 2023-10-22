import { InlineSvgIcon } from "./inlineSvgIcon";
import { AiOutlineReddit } from "react-icons/ai";
import { token } from "@styled-system/tokens";
import { SvgLinkOptions } from "./SvgLinkOptions";
import pkg from "@root/package.json";

export function RedditLink({
  width = 21,
  height = 21,
  ...otherOptions
}: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      width={width}
      height={height}
      {...otherOptions}
      alt="Reddit"
      href={`https://www.reddit.com/user/${pkg.author.social.reddit}`}
    >
      <AiOutlineReddit size={width} color={token("colors.text")} />
    </InlineSvgIcon>
  );
}
