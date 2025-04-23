import { makeOpengraphEndpoint } from "@altano/astro-opengraph/endpoint";
import template from "./_opengraph.astro";

export const GET = makeOpengraphEndpoint({ template });
