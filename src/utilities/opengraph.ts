import { getResolvedConfig } from "@altano/astro-opengraph/config";
import { findLargestUsableFontSize } from "@altano/satori-fit-text";

export async function getOpenGraphConfig() {
  return getResolvedConfig();
}

type FitTextFindOptions = Parameters<typeof findLargestUsableFontSize>[0];
type FindOptions = { interWeight: number } & Omit<FitTextFindOptions, "font">;

export async function findLargestUsableInterSize({
  interWeight,
  ...options
}: FindOptions) {
  return findLargestUsableFontSize({
    ...options,
    font: await getInterFromWeight(interWeight),
  });
}

async function getInterFromWeight(weight: number) {
  const openGraphConfig = await getOpenGraphConfig();
  const font = openGraphConfig.imageOptions.fonts.find(
    (f) => f.weight === weight,
  );
  if (font == null) {
    throw new Error(
      `Could not find weight ${weight} in configured fonts. Add to the astro-opengraph integration in astro.config.ts`,
    );
  }
  if (!font.name.toLowerCase().includes("inter")) {
    throw new Error(`Found a font with name ${font.name} when expecting Inter`);
  }
  return font;
}
