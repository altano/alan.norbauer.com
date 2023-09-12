import Image from "next/image";
import lightBunny from "assets/images/bunny-carrot-hole/bunny-light.svg";
import darkBunny from "assets/images/bunny-carrot-hole/bunny-dark.svg";
import { cva } from "@styled-system/css";

const bunnyStyles = cva({
  base: {
    marginBlockEnd: "2rem",
    lg: {
      marginBlockStart: "5rem",
    },
    flexGrow: "0",
  },
  variants: {
    theme: {
      light: {
        _dark: {
          display: "none",
        },
      },
      dark: {
        filter: "invert(100%)",
        display: "none",
        _dark: {
          display: "revert",
        },
      },
    },
  },
});

export function ThemedBunny() {
  return (
    <>
      <Image
        className={bunnyStyles({ theme: "light" })}
        src={lightBunny}
        alt="A stupid bunny"
        width={64}
        height={64}
      />
      <Image
        className={bunnyStyles({ theme: "dark" })}
        src={darkBunny}
        alt="A stupid, sleeping bunny"
        width={64}
        height={64}
      />
    </>
  );
}
