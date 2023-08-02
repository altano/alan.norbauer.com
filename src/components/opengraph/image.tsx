import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ImageResponse } from "next/server";
import OpenGraphCard, { OpenGraphCardProps } from "./card";
import { glob } from "glob";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage(props: OpenGraphCardProps) {
  console.log(`OpenGraphImage render`);
  // const fontPath = path.join(
  //   fileURLToPath(import.meta.url),
  //   "../../../../public/assets/fonts/Inter/static/Inter-Bold.ttf"
  // );
  const baseDir = path.join(fileURLToPath(import.meta.url), "../../../..");
  // const fontData = await fs.readFile(fontPath);
  // const fonts = await globby(["*.ttf"], {
  //   cwd: baseDir,
  // });
  const fonts = await glob("**/Inter-*.ttf", {
    cwd: baseDir,
    ignore: "node_modules/**",
  });
  const fontPath = fonts.find((f) => f.includes("Inter-Bold"));

  if (fontPath == null) {
    const publicFiles = await glob("**/*", {
      cwd: path.join(baseDir, "public"),
      ignore: "node_modules/**",
    });
    const taskFiles = await glob("**/*.ttf", {
      cwd: path.join("/var/task/.next"),
      ignore: "node_modules/**",
    });
    const globalInterSearch = await glob("**/Inter-*.ttf", {
      cwd: path.join("/"),
      ignore: "node_modules/**",
    });
    console.log({ publicFiles, taskFiles, globalInterSearch });
  }

  console.log({
    fonts: fonts.join(" / "),
    metaUrl: import.meta.url,
    fontPath,
    baseDir,
  });

  if (fontPath == null) {
    throw new Error(`Could not find font`);
  }
  const fontData = await fs.readFile(fontPath);

  return new ImageResponse(<OpenGraphCard {...props} />, {
    ...size,
    fonts: [
      {
        name: "Inter",
        style: "normal",
        data: fontData,
      },
    ],
  });
}
