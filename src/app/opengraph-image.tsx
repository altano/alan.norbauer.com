import { host } from "@/components/homeLink";
import OpenGraphImage from "@/components/opengraph/image";
import getFonts from "@/utility/getFonts";
import pkg from "@root/package.json";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return OpenGraphImage({
    cardProps: {
      title: pkg.description,
      subtitle: host,
    },
    imageOptions: {
      ...size,
      fonts: await getFonts(),
    },
  });
}
