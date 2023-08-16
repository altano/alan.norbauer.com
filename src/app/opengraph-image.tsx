import { host } from "@/components/homeLink";
import OpenGraphImage from "@/components/opengraph/image";
import pkg from "@root/package.json";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  // TODO When Satori supports it, switch to Inter Variable
  //
  // const interVariable = fetch(
  //   new URL(
  //     "../../public/fonts/Inter/Inter-VariableFont_slnt,wght.ttf",
  //     import.meta.url
  //   )
  // ).then((res) => res.arrayBuffer());
  const interBold = await readFile(
    path.join(
      fileURLToPath(import.meta.url),
      "../../../public/fonts/Inter/static/Inter-Bold.ttf"
    )
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
          data: interBold,
          style: "normal",
        },
      ],
    },
  });
}
