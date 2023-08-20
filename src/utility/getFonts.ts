import type { Font } from "satori";

export default async function getFonts(): Promise<Font[]> {
  const [interRegular, interSemiBold, interBold] = await Promise.all([
    fetch(`https://rsms.me/inter/font-files/Inter-Regular.woff`).then((res) =>
      res.arrayBuffer()
    ),
    fetch(`https://rsms.me/inter/font-files/Inter-SemiBold.woff`).then((res) =>
      res.arrayBuffer()
    ),
    fetch(`https://rsms.me/inter/font-files/Inter-Bold.woff`).then((res) =>
      res.arrayBuffer()
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
