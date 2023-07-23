import { InlineSvgIcon } from "./inlineSvgIcon";
import emailSVG from "assets/images/icons/email.svg";
import pkg from "@root/package.json";

export function EmailLink({ text }: { text?: string }) {
  const { email } = pkg.author;
  return (
    <InlineSvgIcon
      src={emailSVG}
      alt="Email"
      text={text}
      href={`mailto:${email}?subject=Hey%20Nerd`}
    />
  );
}
