import { ImageResponse } from "next/og";
import { type Font, findLargestUsableFontSize } from "@altano/satori-fit-text";
import nullthrows from "nullthrows";

type ImageResponseOptions = ConstructorParameters<typeof ImageResponse>[1];
type Props = {
  cardProps: OpenGraphCardProps;
  imageOptions: ImageResponseOptions;
};

type OpenGraphCardProps = {
  title: string;
  subtitle?: string;
  fonts: Font[];
};

export default async function OpenGraphImage(props: Props) {
  const { cardProps, imageOptions } = props;
  const { fonts, title, subtitle } = cardProps;
  const opengraphDimensions = {
    width: 1200,
    height: 630,
  };
  const footerHeight = 137;
  const padding = 32;
  const lineHeight = 1;

  const titleFontWeight = 700; /* Bold */
  const titleFontSize = await findLargestUsableFontSize({
    text: title,
    font: nullthrows(fonts.find((f) => f.weight === titleFontWeight)),
    maxWidth: opengraphDimensions.width - padding - padding,
    maxHeight: opengraphDimensions.height - padding - padding - footerHeight,
    lineHeight,
  });

  const subtitleFontWeight = 600; /* SemiBold */
  const subtitleFontSize =
    subtitle == null
      ? 0
      : await findLargestUsableFontSize({
          text: subtitle,
          font: nullthrows(fonts.find((f) => f.weight === subtitleFontWeight)),
          maxWidth: opengraphDimensions.width - padding - padding,
          maxHeight: footerHeight - padding - padding,
          lineHeight,
        });

  const card = (
    <main
      style={{
        lineHeight,
        background: "white",
        color: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          lineHeight,
          flexGrow: 1,
          width: "100%",
          padding,
          boxSizing: "border-box",
          margin: 0,
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <footer
          style={{
            lineHeight,
            display: "flex",
            alignItems: "center",
            background: "#FCDED9",
            width: "100%",
            flexShrink: 0,
            padding,
            boxSizing: "border-box",
            margin: 0,
            height: footerHeight,
            fontSize: subtitleFontSize,
            fontWeight: subtitleFontWeight,
          }}
        >
          {subtitle}
        </footer>
      )}
    </main>
  );

  return new ImageResponse(card, imageOptions);
}
