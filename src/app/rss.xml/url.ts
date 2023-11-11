import pkg from "@root/package.json";

export const feedUrl = new URL("rss.xml", pkg.homepage).toString();
