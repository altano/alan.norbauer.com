# Project Overview

Personal website built with Astro.

## Key Locations

- **Articles**: `src/content/articles/`
- **Content schema**: `src/content/config.ts`
- **Collections**: `authors`, `articles`, `articleSeries`

## Article Schema

- `author`: reference to authors (default: "alan")
- `date_created`: ISO 8601 date (e.g., `2006-01-01T00:00:00Z`)
- `date_updated`: optional ISO 8601 date
- `description`: string (min 5 chars)
- `draft`: boolean
- `series`: optional reference to articleSeries
- `tags`: string array
- `title`: string (min 5 chars)

## Commands

- Build: Standard Astro build commands
- Package manager: pnpm (see package.json for scripts)
- `devbox search <command>` - find a command to install
- `devbox install <command>` - install command
