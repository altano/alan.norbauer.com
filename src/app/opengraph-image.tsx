import { host } from "@/components/homeLink";
import OpenGraphImage from "@/components/opengraph/image";
import pkg from "@root/package.json";
import { readFile } from "fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  const interRegular = readFile(
    path.join(fileURLToPath(import.meta.url), "../../../og/Inter-Regular.ttf")
  );
  const interSemiBold = readFile(
    path.join(fileURLToPath(import.meta.url), "../../../og/Inter-SemiBold.ttf")
  );
  const interBold = readFile(
    path.join(fileURLToPath(import.meta.url), "../../../og/Inter-Bold.ttf")
  );

  return OpenGraphImage({
    cardProps: {
      title: pkg.description,
      subtitle: host,
    },
    imageOptions: {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 600,
        },
        {
          name: "Inter",
          data: await interBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  });
}
