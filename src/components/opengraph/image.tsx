import { ImageResponse } from "next/server";
import OpenGraphCard, { OpenGraphCardProps } from "./card";

type ImageResponseOptions = ConstructorParameters<typeof ImageResponse>[1];
type Props = {
  cardProps: OpenGraphCardProps;
  imageOptions: ImageResponseOptions;
};

export default async function OpenGraphImage(props: Props) {
  const { cardProps, imageOptions } = props;
  return new ImageResponse(<OpenGraphCard {...cardProps} />, imageOptions);
}
