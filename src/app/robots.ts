import { MetadataRoute } from "next";
import { sitemapUrl } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/stuff/",
    },
    sitemap: sitemapUrl,
  };
}
