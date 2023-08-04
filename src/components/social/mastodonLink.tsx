import { InlineSvgIcon } from "./inlineSvgIcon";
import rssSVG from "assets/images/icons/rss.svg";
import { FaMastodon } from "react-icons/fa6";
import { token } from "@styled-system/tokens";

export function MastodonLink({ text }: { text?: string }) {
  return (
    <InlineSvgIcon
      src={rssSVG}
      alt="Subscribe to RSS Feed"
      text={text}
      href="https://indieweb.social/@alannorbauer"
      rel="me"
    >
      <FaMastodon size={19} color={token("colors.text")} />
    </InlineSvgIcon>
  );
}
