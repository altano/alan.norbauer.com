/**
 * Picks the output format of each Markdown/MDX image that Astro optimizes:
 * `format` when that encodes smaller than the source file, and otherwise the
 * source's own format, which src/image-service.ts then serves untouched.
 * Without this, Astro encodes every image as webp; it has no option to change
 * the default.
 *
 * Sets a `format` property on the `<img>`. This runs before Astro's own image
 * plugin, which copies the element's properties onto the `<Image />` it
 * renders (MDX) or the props it passes to `getImage()` (.md). Images in
 * `public/` are left alone, since Astro serves those unprocessed and the
 * property would end up as a stray HTML attribute.
 */
import { readFile, stat } from "node:fs/promises";
import type { ImageOutputFormat } from "astro";
import { imageMetadata } from "astro/assets/utils";
import { defineHastPlugin } from "satteri";
import imageService, { imageServiceConfig } from "../../image-service";

/** Source formats Astro can also output, so the original can be asked for by format. */
const PASSTHROUGH_FORMATS = new Set(["avif", "jpeg", "jpg", "png", "webp"]);

/**
 * The image config Astro resolves from astro.config.ts. Of these fields, a
 * sharp encode reads only `service.config` and `dangerouslyProcessSVG`, so
 * measuring with it gives the same bytes the build ships.
 */
const imageConfig = {
  service: { entrypoint: "./src/image-service.ts", config: imageServiceConfig },
  endpoint: { route: "/_image" },
  dangerouslyProcessSVG: false,
  domains: [],
  remotePatterns: [],
  responsiveStyles: false,
};

/** Keyed by format, file and modification time, so dev picks up edited images. */
const choices = new Map<string, Promise<ImageOutputFormat>>();

async function smallerFormat(
  file: URL,
  format: ImageOutputFormat,
): Promise<ImageOutputFormat> {
  const source = await readFile(file);
  const { format: sourceFormat, width, height } = await imageMetadata(
    source,
    file.pathname,
  );
  // A source already in `format` is served untouched by the image service.
  if (sourceFormat === format || !PASSTHROUGH_FORMATS.has(sourceFormat)) {
    return format;
  }
  const encoded = await imageService.transform(
    source,
    { src: file.pathname, format, width, height },
    imageConfig,
  );
  return encoded.data.byteLength < source.byteLength ? format : sourceFormat;
}

async function chooseFormat(
  file: URL,
  format: ImageOutputFormat,
): Promise<ImageOutputFormat> {
  const { mtimeMs } = await stat(file);
  const key = `${format} ${file.href} ${mtimeMs}`;
  let choice = choices.get(key);
  if (choice == null) {
    choice = smallerFormat(file, format);
    choices.set(key, choice);
  }
  return choice;
}

export const imageFormat = (format: ImageOutputFormat) =>
  defineHastPlugin({
    name: "image-format",
    element: {
      filter: ["img"],
      async visit(node, ctx) {
        const src = node.properties?.src;
        if (typeof src !== "string" || node.properties?.format != null) return;
        const decodedSrc = decodeURI(src);
        const astro = ctx.data.astro;
        if (astro?.remoteImagePaths.has(decodedSrc)) {
          ctx.setProperty(node, "format", format);
        } else if (astro?.localImagePaths.has(decodedSrc)) {
          // Only relative paths can be resolved here; aliases get `format`.
          const file =
            decodedSrc.startsWith(".") && ctx.fileURL != null
              ? new URL(decodedSrc, ctx.fileURL)
              : undefined;
          ctx.setProperty(
            node,
            "format",
            file == null ? format : await chooseFormat(file, format),
          );
        }
      },
    },
  });
