import { InlineSvgIcon } from "./inlineSvgIcon";
import { FaMastodon } from "react-icons/fa6";
import { token } from "@styled-system/tokens";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function MastodonLink({
  width = 19,
  height = 19,
  ...otherOptions
}: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      width={width}
      height={height}
      {...otherOptions}
      alt="Mastodon"
      href="https://indieweb.social/@alannorbauer"
      rel="me"
    >
      <FaMastodon size={width} color={token("colors.text")} />
    </InlineSvgIcon>
  );
}
