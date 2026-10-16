/**
 * Astro's sharp image service, except that it returns the source file
 * byte-for-byte when a transform asks for the source's own format at the
 * source's own size. Re-encoding in that case changes only the bytes, never
 * the dimensions or format, and Astro has no option to skip it.
 *
 * `imageFormat` (src/markdown/plugins/image-format.ts) relies on this to ship a
 * Markdown image's original file when it is smaller than the AVIF.
 */
import type { LocalImageService } from "astro";
import sharpService from "astro/assets/services/sharp";
import { imageMetadata } from "astro/assets/utils";

type Transform = Parameters<LocalImageService["transform"]>[1];

/** `image.service.config` in astro.config.ts, shared so the plugin encodes the same way. */
export const imageServiceConfig = {};

/** Astro accepts both spellings as an output format. */
const normalizeFormat = (format: string): string =>
  format === "jpg" ? "jpeg" : format;

/** The source's format when `transform` would only re-encode it, else undefined. */
async function unchangedSourceFormat(
  inputBuffer: Uint8Array,
  transform: Transform,
): Promise<string | undefined> {
  const { format, width, height, quality, background } = transform;
  if (typeof format !== "string" || quality != null || background != null) {
    return undefined;
  }
  const source = await imageMetadata(inputBuffer, transform.src);
  const unchanged =
    normalizeFormat(source.format) === normalizeFormat(format) &&
    // sharp would rotate the pixels to match the EXIF orientation
    (source.orientation ?? 1) === 1 &&
    (width == null || width === source.width) &&
    (height == null || height === source.height);
  return unchanged ? source.format : undefined;
}

const imageService: LocalImageService = {
  ...sharpService,
  async transform(inputBuffer, transform, imageConfig) {
    const sourceFormat = await unchangedSourceFormat(inputBuffer, transform);
    if (sourceFormat != null) {
      return { data: inputBuffer, format: sourceFormat };
    }
    return sharpService.transform(inputBuffer, transform, imageConfig);
  },
};

export default imageService;
