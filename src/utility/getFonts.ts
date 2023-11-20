import type { Font } from "satori";

export default async function getFonts(): Promise<Font[]> {
  // This is unfortunate but I can't figure out how to load local font files
  // when deployed to vercel.
  const [interRegular, interMedium, interSemiBold, interBold] =
    await Promise.all([
      fetch(`https://alan.norbauer.com/fonts/inter/otf/Inter-Regular.otf`).then(
        (res) => res.arrayBuffer()
      ),
      fetch(`https://alan.norbauer.com/fonts/inter/otf/Inter-Medium.otf`).then(
        (res) => res.arrayBuffer()
      ),
      fetch(
        `https://alan.norbauer.com/fonts/inter/otf/Inter-SemiBold.otf`
      ).then((res) => res.arrayBuffer()),
      fetch(`https://alan.norbauer.com/fonts/inter/otf/Inter-Bold.otf`).then(
        (res) => res.arrayBuffer()
      ),
    ]);

  return [
    {
      name: "Inter",
      data: interRegular,
      style: "normal",
      weight: 400,
    },
    {
      name: "Inter",
      data: interMedium,
      style: "normal",
      weight: 500,
    },
    {
      name: "Inter",
      data: interSemiBold,
      style: "normal",
      weight: 600,
    },
    {
      name: "Inter",
      data: interBold,
      style: "normal",
      weight: 700,
    },
  ];
}
