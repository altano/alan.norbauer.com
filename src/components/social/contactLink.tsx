import { InlineSvgIcon } from "./inlineSvgIcon";
import { IoIosContact } from "react-icons/io";
import { token } from "@styled-system/tokens";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function ContactLink({
  width = 21,
  height = 21,
  ...otherOptions
}: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      width={width}
      height={height}
      {...otherOptions}
      alt="Other Contact Methods"
      href="/contact"
    >
      <IoIosContact size={width} color={token("colors.text")} />
    </InlineSvgIcon>
  );
}
