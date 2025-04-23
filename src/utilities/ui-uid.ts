import ShortUniqueId from "short-unique-id";

const usedIds = new Set<string>();

function generate() {
  const generator = new ShortUniqueId({ length: 3 });
  const uid = generator.rnd();
  return `ui-id-${uid}`;
}

/**
 * @returns {string} A unique ID to be used in the DOM
 */
export function getUiUID(): string {
  let id = null;
  do {
    id = generate();
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}
