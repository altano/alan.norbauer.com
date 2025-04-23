const fontCache = new Map();

export async function getInter(weight) {
  {
    const font = fontCache.get(weight);
    if (font != null) {
      return font;
    }
  }

  const url = `https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.17/files/inter-latin-${weight}-normal.woff`;
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  const font = {
    name: "Inter",
    data: buffer,
    weight,
  };

  fontCache.set(weight, font);

  return font;
}
