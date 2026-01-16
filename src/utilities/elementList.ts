import nullthrows from "nullthrows";

const formatterCanadian = new Intl.ListFormat("en-US", {
  style: "long",
  type: "conjunction",
});

export function elementList<Element>(array: Element[]): (string | Element)[] {
  // Use placeholder strings (indices) for formatToParts
  const placeholders = array.map((_, i) => String(i));
  const parts = formatterCanadian.formatToParts(placeholders);

  // Map parts back to JSX elements
  return parts.map((part) => {
    if (part.type === "element") {
      // Replace placeholder with actual element
      return nullthrows(array[parseInt(part.value)]);
    }
    // Return the separator string as-is
    return part.value;
  });
}
