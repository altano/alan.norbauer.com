import { host } from "@/components/homeLink";
import OpenGraphImage from "@/components/opengraph/image";
import pkg from "@root/package.json";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  const interSemiBold = fetch(
    new URL(
      "../../assets/fonts/Inter/static/Inter-SemiBold.ttf",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());
  const interBold = fetch(
    new URL("../../assets/fonts/Inter/static/Inter-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

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
