import { ImageResponse } from "next/server";
import fs from "node:fs";
import { getAbsolutePathFromProjectRoot } from "@/fs";

import OpenGraphCard, { OpenGraphCardProps } from "./card";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const fontData = fs.promises.readFile(
  getAbsolutePathFromProjectRoot("./assets/fonts/Inter/static/Inter-Bold.ttf")
);

export default async function OpenGraphImage(props: OpenGraphCardProps) {
  return new ImageResponse(<OpenGraphCard {...props} />, {
    ...size,
    fonts: [
      {
        name: "Inter",
        style: "normal",
        data: await fontData,
      },
    ],
  });
}
