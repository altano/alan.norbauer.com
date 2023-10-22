import { SvgLinkOptions } from "./SvgLinkOptions";
import { InlineSvgIcon } from "./inlineSvgIcon";
import { GrFacebook } from "react-icons/gr";
import pkg from "@root/package.json";
import { token } from "@styled-system/tokens/index.mjs";

export function FacebookLink({
  width = 19,
  height = 19,
  ...otherOptions
}: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      width={width}
      height={height}
      {...otherOptions}
      alt="Facebook"
      href={`https://facebook.com/${pkg.author.social.facebook}`}
    >
      <GrFacebook size={width} color={token("colors.text")} />
    </InlineSvgIcon>
  );
}
