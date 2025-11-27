import { $, chalk, fs, glob, os, path, spinner } from "zx";
import { doWork } from "@altano/tiny-async-pool";
import nullthrows from "nullthrows";

const SUPPORTED_FORMATS = ["gif", "mp4", "mov"];
const MAX_SIZE = {
  width: 768, // how wide my articles are
  height: 600, // arbitrary. iphone videos are really tall.
};
const OUTPUT_FORMAT = "avif";

const animations = await glob(
  `./assets/animations/**/*.{${SUPPORTED_FORMATS.join(",")}}`,
);

function isPathInside(childPath: string, parentPath: string): boolean {
  // Normalize paths to handle separators and relative segments (e.g., ./, ../)
  const normalizedChild = path.resolve(childPath);
  const normalizedParent = path.resolve(parentPath);

  // Ensure the parent path is a directory by normalizing it
  // (path.resolve handles cases where parentPath might not end with a separator)
  if (normalizedChild === normalizedParent) {
    return false; // A path is not considered inside itself
  }

  // Compute the relative path from parent to child
  const relative = path.relative(normalizedParent, normalizedChild);

  // If the relative path is empty or starts with '..', the child is not inside the parent
  return (
    relative != null &&
    relative !== "" &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  );
}

function assertPathInPublicDir(childPath: string): void {
  if (!isPathInside(childPath, "./public/")) {
    throw new Error(`Expected ${childPath} to be inside public directory`);
  }
}

function getOutputFilenameFromInput(input: string): string {
  // Normalize path to handle different separators
  const normalized = path.normalize(input);

  // Split into segments
  const segments = normalized.split(path.sep);

  // Check if path starts with ./assets/animations/
  if (
    segments[0] === "." &&
    segments[1] === "assets" &&
    segments[2] === "animations"
  ) {
    // Replace first two segments with './public'
    segments.splice(0, 3, ".", "public");
  } else if (segments[0] === "assets" && segments[1] === "animations") {
    // Replace first two segments with './public'
    segments.splice(0, 2, ".", "public");
  } else {
    throw new Error(
      `Expected input to be in ./assets/animations and wasn't: ${segments.join(" - ")}`,
    );
  }
  const lastSegment = nullthrows(segments[segments.length - 1]);

  // Get the file extension with dot (e.g., '.mp4')
  const fileExtensionWithDot = path.extname(lastSegment).toLowerCase();

  // Remove the leading dot for comparison (e.g., 'mp4')
  const fileExtension = fileExtensionWithDot.slice(1);

  // Check if the extension is in the allowed extensions
  if (!SUPPORTED_FORMATS.includes(fileExtension)) {
    throw new Error(
      `Input file extension '${fileExtension}' is not allowed. Allowed extensions: ${SUPPORTED_FORMATS.join(", ")}`,
    );
  }

  // Join segments back, excluding the file name
  const dirPath = segments.slice(0, -1).join(path.sep);
  // Get the base file name without extension
  const fileName = path.basename(lastSegment, path.extname(lastSegment));

  // Combine directory path with new file name and .avif extension
  return path.join(dirPath, `${fileName}.${OUTPUT_FORMAT}`);
}

async function convertVideoToAvif(source: string, dest: string): Promise<void> {
  await $`ffmpeg -y -i "${source}" -vf "scale='min(${MAX_SIZE.width},iw)':'min(${MAX_SIZE.height},ih)':force_original_aspect_ratio=decrease" "${dest}"`;
}

async function convertGifToAvif(source: string, dest: string): Promise<void> {
  // ffmpeg -> yuv4 + avifenc seems to produce smaller files. the gifs already
  // look terrible and I don't see any further degradation so let's just use it.
  await $`ffmpeg -i "${source}" -vf "scale='min(${MAX_SIZE.width},iw)':'min(${MAX_SIZE.height},ih)':force_original_aspect_ratio=decrease" -strict -1 -f yuv4mpegpipe -pix_fmt yuva444p - | avifenc --stdin ${dest}`;
}

async function doConversion(source: string, dest: string): Promise<void> {
  // Create output directory if it doesn't exist
  const outputDir = path.dirname(dest);
  await fs.mkdir(outputDir, { recursive: true });

  const ext = path.extname(source).toLowerCase().slice(1);

  switch (ext) {
    case "mp4":
    case "mov":
      await convertVideoToAvif(source, dest);
      break;
    case "gif":
      await convertGifToAvif(source, dest);
      break;
    default:
      throw new Error(`Unknown input file format: ${source}`);
  }

  console.log(chalk.green(`Finished converting ${source} to ${dest}`));
}

async function needsConversion(source: string, dest: string): Promise<boolean> {
  try {
    const [sourceStat, destStat] = await Promise.all([
      fs.stat(source),
      fs.stat(dest),
    ]);
    // Only convert if source is newer than dest
    return sourceStat.mtime > destStat.mtime;
  } catch {
    // If dest doesn't exist or any error, we need to convert
    return true;
  }
}

await spinner("Converting images...", async () => {
  await doWork(os.cpus().length, animations, async (animation) => {
    const source = animation;
    const dest = getOutputFilenameFromInput(animation);
    assertPathInPublicDir(dest);

    if (!(await needsConversion(source, dest))) {
      console.log(chalk.gray(`Skipping ${source} (already up-to-date)`));
      return;
    }

    console.log(chalk.blue(`Converting ${source} to ${dest}`));
    await doConversion(source, dest);
  });
});

console.log(chalk.green(`Finished converting all images`));
