import { styled } from "@styled-system/jsx";

type LanguageCode = "en-US" | "ko";

function Language({ language }: { language: LanguageCode }): string {
  switch (language) {
    case "en-US":
      return "🇺🇸 English";
    case "ko":
      return "🇰🇷 한국인 (Korean)";
  }
}

const Link = styled("a", {
  base: {
    fontWeight: 700,
  },
});

const SmallCard = styled("p", {
  base: {
    layerStyle: "card",
    fontSize: "md",
  },
});

export function Translation({
  language,
  link,
  attributionName,
  attributionLink,
}: {
  language: LanguageCode;
  link: string;
  attributionName: string;
  attributionLink: string;
}) {
  return (
    <SmallCard>
      <Link href={link}>
        <Language language={language} />
      </Link>{" "}
      translation available (courtesy of{" "}
      <a href={attributionLink}>{attributionName}</a>)
    </SmallCard>
  );
}
