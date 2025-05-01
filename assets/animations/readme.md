# Animations

## What is this

These are videos (all mp4 atm) that I use as animations on the site. They are usually from screen grabs.

I convert them to avif locally and then just commit the converted file to my /public directory (mirroring the directory structure here), where Astro will use them unprocessed.

See `scripts/convert-images.ts` for more details.

## How to use

1. Drop a .mp4-or-whatever file in here, e.g. `./assets/animations/articles/face/coolthing.mp4`
1. Run `pnpm convert:images` (or just `pnpm build`). Verify output, e.g. `./public/articles/face/coolthing.mp4`
1. Add `<img />` tag to Astro content (not processed by Astro!), e.g. `<img src="/articles/face/coolthing.mp4" />` (make sure to include dimensions and alt)

## And then what

Would be best to convert this to a custom Astro image service that handles gif and mp4 input but defers to Astro for the rest. Then it can be automatic and part of the build (assuming my solution can run in the Cloudflare Pages build env).

## Why?

Why use avif instead of mp4 or webp? Because it's awesome I guess?

Why convert gifs to avif if they aren't small and still look like shit? Because most devices will have more efficient decoders, so I see no downside and potential future upside.

Why don't we let Astro convert gifs to webp animations? https://github.com/withastro/astro/issues/13683
