# ignamiranda.github.io — Agent guide

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Typecheck | `npm run typecheck` (uses `astro check`, not tsc) |
| Test | `npm run test` (vitest) |
| Preview build | `npm run preview` |

Run `typecheck` after making changes.

## Workflow

- **GH_TOKEN** stored in `.env` — run `/env` to source it into the shell.
- CI deploys to GitHub Pages on push to `main` (runs `npm ci` + `npm run build` on Node 22).

## Architecture

- **Framework:** Astro 5, static site, Content Collections (`src/content/notes/`)
- **Entrypoints:** `src/pages/index.astro` (home), `src/pages/notes/[...slug].astro` (notes + tools)
- **Content pipeline:** `.md` files → Astro content collections → remark wikilinks plugin → build-time backlink analysis (`src/lib/backlinks.ts`)
- **Tool pattern:** Note with `layout: tool` frontmatter → `[...slug].astro` routes to `ToolLayout` → injects component (e.g. `<NameGenerator />` or `<RumorsGenerator />`)
- **All current content notes are tool notes** — `name-generator.md` and `rumors-generator.md` both use `layout: tool`. No plain prose notes exist yet.

## Quirks & conventions

- **Language:** "notes", not "posts" or "blog". "content", not "articles". See `CONTEXT.md` for full vocabulary.
- **CSP is strict** (`astro.config.mjs`): no external images, no external scripts. `unsafe-eval` required for `force-graph`.
- **Wikilinks:** `[[Note Title]]` or `[[Note Title|alias]]` — unresolved links get dashed underline + `?`.
- **Frontmatter:** All fields optional. `title` falls back to first `#` heading. `date` falls back to git commit date. Draft notes (`draft: true`) are excluded from build and search.
- **Synchronous file I/O:** `backlinks.ts` reads `.md` files synchronously at build time with module-level caching.
- **Tool routing:** Tools are `.md` notes with `layout: tool` frontmatter, served at `/notes/{slug}`. No separate `.astro` page wrappers.
- **Search:** MiniSearch lazy-loaded on focus (`TopBar.astro`). Index generated at build time via `/search-index.json`.
- **Graph:** `force-graph` rendered client-side with IntersectionObserver lazy load (`ForceGraph.astro`). Build-time nodes/edges JSON.
- **Tests** at `src/**/*.test.ts` — currently `slugify.test.ts` and `markdown.test.ts`.
- **TSConfig:** Extends `astro/tsconfigs/strict`.
- **TODO.md** at root documents design decisions and build sequence.
- **Design docs** in `docs/agents/`: issue tracker workflow, triage labels, domain doc consumption.
