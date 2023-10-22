import { InlineSvgIcon } from "./inlineSvgIcon";
import emailSVG from "assets/images/icons/email.svg";
import pkg from "@root/package.json";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function EmailLink(options: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      {...options}
      src={emailSVG}
      alt="Email"
      href={`mailto:${pkg.author.email}?subject=Hey%20Nerd`}
    />
  );
}
