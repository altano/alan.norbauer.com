import { makeOpengraphEndpoint } from "@altano/astro-opengraph/endpoint";
import template from "./_opengraph.astro";
export { getStaticPaths } from "./index.astro";

export const GET = makeOpengraphEndpoint({ template });
