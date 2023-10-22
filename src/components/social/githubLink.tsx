import { InlineSvgIcon } from "./inlineSvgIcon";
import githubSVG from "assets/images/icons/github-mark-black.svg";
import pkg from "@root/package.json";
import { SvgLinkOptions } from "./SvgLinkOptions";

export function GithubLink(options: SvgLinkOptions) {
  return (
    <InlineSvgIcon
      {...options}
      src={githubSVG}
      alt="GitHub"
      href={`https://www.github.com/${pkg.author.social.github}`}
    />
  );
}
