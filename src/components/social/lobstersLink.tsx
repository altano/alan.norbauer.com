import { InlineSvgIcon } from "./inlineSvgIcon";
import lobstersPNG from "assets/images/icons/lobsters.png";
import pkg from "@root/package.json";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function LobstersLink(options: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      {...options}
      src={lobstersPNG}
      alt="Lobste.rs"
      href={`https://lobste.rs/~${pkg.author.social.lobsters}`}
    />
  );
}
