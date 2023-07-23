import { InlineSvgIcon } from "./inlineSvgIcon";
import instagramSVG from "assets/images/icons/instagram.svg";
import pkg from "@root/package.json";

export function InstagramLink({ text }: { text?: string }) {
  const handle = pkg.author.social.instagram;
  return (
    <InlineSvgIcon
      src={instagramSVG}
      height={17} // Looks slightly too large at 18x18 relative to the other icons
      width={17}
      alt="Instagram"
      text={text}
      href={`https://www.instagram.com/${handle}`}
    />
  );
}
