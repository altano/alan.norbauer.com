import { ChildOrSrc } from "./inlineSvgIcon";

export type SvgLinkOptions = Omit<ChildOrSrc, "src" | "alt" | "href">;
