import { css } from "@styled-system/css";
import Image from "next/image";

type Props = React.ComponentProps<typeof Image>;

export function MermaidDiagram(props: Props) {
  return (
    <p
      className={css({
        layerStyle: "card",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      })}
    >
      <Image data-invertible {...props} alt={props.alt} />
    </p>
  );
}
