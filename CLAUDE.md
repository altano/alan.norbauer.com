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

## Version Control

- This repository uses **Jujutsu (`jj`)**, not `git`. Use `jj` commands (e.g.
  `jj restore <path>` to discard working-copy changes, `jj diff`, `jj status`,
  `jj log`). Do not run `git` commands here.

## Commands

- Build: Standard Astro build commands
- Package manager: pnpm (see package.json for scripts)
- `devbox search <command>` - find a command to install
- `devbox install <command>` - install command
