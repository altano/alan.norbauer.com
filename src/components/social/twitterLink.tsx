import { InlineSvgIcon } from "./inlineSvgIcon";
import twitterSVG from "assets/images/icons/twitter.svg";

export function TwitterLink({ text }: { text?: string }) {
  return (
    <InlineSvgIcon
      src={twitterSVG}
      alt="Twitter"
      text={text}
      href="https://twitter.com/alannorbauer"
    />
  );
}
