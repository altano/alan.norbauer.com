import { InlineSvgIcon } from "./inlineSvgIcon";
import githubSVG from "assets/images/icons/github-mark-black.svg";
import pkg from "@root/package.json";

export function GithubLink({ text }: { text?: string }) {
  const handle = pkg.author.social.github;
  return (
    <InlineSvgIcon
      src={githubSVG}
      alt="GitHub"
      text={text}
      href={`https://www.github.com/${handle}`}
    />
  );
}
