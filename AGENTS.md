# ignamiranda.github.io — Agent guide

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Typecheck | `npm run typecheck` (uses `astro check`, not tsc) |
| Test | `npm run test` (vitest; no tests exist yet) |
| Preview build | `npm run preview` |

Always run `typecheck` after making changes.

## Workflow

- **Branch protection:** `main` is protected — PR required, no direct pushes. Self-merge OK (no review needed).
- **Push workflow:** Create branch → push → `gh pr create` → user merges.
- **GH_TOKEN** stored in `.env` — source it in each shell: `Get-Content .env | ForEach-Object { $k,$v = $_ -split '=',2; Set-Item "env:$k" -Value $v.Trim('"') }`
- CI deploys to GitHub Pages on push to `main`.

## Architecture

- **Framework:** Astro 5, static site, Content Collections (`src/content/notes/`)
- **Entrypoints:** `src/pages/index.astro` (home), `src/pages/notes/[...slug].astro` (notes + tools)
- **Content pipeline:** `.md` files → Astro content collections → remark wikilinks plugin → build-time backlink analysis (`src/lib/backlinks.ts`)
- **Tool pattern:** Note with `layout: tool` frontmatter → `[...slug].astro` routes to `ToolLayout` → injects component (e.g. `<NameGenerator />`)

## Quirks & conventions

- **Language:** "notes", not "posts" or "blog". "content", not "articles". See `CONTEXT.md` for full vocabulary.
- **CSP is strict** (`astro.config.mjs`): no external images, no external scripts. Unsafe-eval is required for `force-graph`.
- **Wikilinks:** `[[Note Title]]` or `[[Note Title|alias]]` — unresolved links get dashed underline + `?`.
- **Frontmatter:** All fields optional. `title` falls back to first `#` heading. `date` falls back to git commit date.
- **Synchronous file I/O:** `backlinks.ts` reads `.md` files synchronously at build time with module-level caching.
- **Dual Name Generator routing:** Both `name-generator.md` (content collection) and `name-generator.astro` (route) exist.
- **Search:** MiniSearch lazy-loaded on focus. Index generated at build time via `/search-index.json`.
- **Graph:** `force-graph` rendered client-side with IntersectionObserver lazy load. Build-time nodes/edges JSON.
- **Tests:** Vitest configured, no tests exist yet. Create tests at `src/**/*.test.ts` or `*.spec.ts`.
- **TSConfig:** Extends `astro/tsconfigs/strict`.
