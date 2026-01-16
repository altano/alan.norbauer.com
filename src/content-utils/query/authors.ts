import { getCollection, type CollectionEntry } from "astro:content";
import nullthrows from "nullthrows";

export async function getAlan(): Promise<CollectionEntry<"authors">> {
  const authors = await getCollection("authors");
  const alanAuthor = authors.find((a) =>
    a.data.name.toLowerCase().includes("alan"),
  );
  return nullthrows(alanAuthor);
}
