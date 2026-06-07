# TODO — Digital Garden

## Design Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Garden type | Wiki-garden, link-driven |
| 2 | URL model | Flat `/notes/{slug}` |
| 3 | Content format | Astro Content Collections + remark wikilink plugin |
| 4 | Home page | Recent + random + link-graph |
| 5 | Graph rendering | Interactive Canvas/WebGL (`force-graph`) |
| 6 | Graph edges | Explicit `[[wikilinks]]` only |
| 7 | Dead links | Styled dead-link, clickable to 404 |
| 8 | Navigation | Top bar (home, random, search) + backlinks in note footer |
| 9 | Frontmatter | Override-only — title from first `#` heading, date from git, `description`, `tags`, `draft` optional |
| 10 | Title source | First `#` heading in note body |
| 11 | Tags | Frontmatter `tags:` only (no inline `#tag` syntax) |
| 12 | Tag pages | Per-tag pages (`/tags/{tag}`) + tag cloud on home page |
| 13 | Theme | Dark-only, less neon |
| 14 | Note layout | Full prose width, metadata header, backlinks footer |
| 15 | Tool integration | Everything is a note — `layout: tool` frontmatter field |
| 16 | Tool mechanism | Layout-driven injection (`.md` files, `layout` field selects layout) |
| 17 | Search | Client-side lazy-loaded index, dropdown in top bar (`minisearch`) |
| 18 | Graph placement | Home page, full section below hero |
| 19 | Graph on mobile | Renders, shorter, auto-zoom-to-fill |
| 20 | Note cards | Recent + random, title + preview text |
| 21 | Note previews | Frontmatter `description` with auto-extract fallback (first paragraph after heading) |
| 22 | Graph click | Hover shows title tooltip, click navigates to note |
| 23 | Build sequence | Content → Graph → Search → Tags → Tool → Polish |

---

## Build Sequence (priority order)

### 1 — Content Pipeline

- [x] Set up `src/content/notes/` content collection with override-only frontmatter schema
- [x] Write remark plugin to parse `[[wikilinks]]`:
  - Resolve to `/notes/{slug}` for existing notes
  - Render as styled dead-link for unresolved targets
- [x] Compute backlinks at build time from parsed link graph
- [x] Build note page layout:
  - Full prose width (~38-42rem centered) — done
  - Metadata line: date + tags — done
  - Backlinks section at bottom — done
  - Dead-link styling (dashed underline, muted color, `?` affordance) — done
  - Minimal rendering page at `src/pages/notes/[...slug].astro`
- [x] Build top bar:
  - Site name (links to `/`)
  - "Random note" link
  - Search box (placeholder — non-functional until priority 3)
- [x] Update home page:
  - Compact hero (name + tagline + GitHub/Email links)
  - Below hero: list of all notes (placeholder — replaced by graph in priority 2)
  - No note cards yet (added in priority 2)

### 2 — Home Page + Graph

- [x] Integrate `force-graph` as a client-side Astro component
- [x] Build-time processing: read all notes, extract wikilinks, build nodes + edges JSON
- [x] Home page graph section:
  - Full width below hero
  - Interactive Canvas (pan, zoom, drag, click-to-navigate)
  - Nodes sized by connection count
  - Hover shows title tooltip
  - Mobile: auto-zoom-to-fill, shorter height (~40vh)
- [x] Recent note + random note preview cards:
  - Show title + auto-extracted preview text
  - Link to the note
  - Random note changes on each page load (client-side pick from props)

### 3 — Search

- [x] Generate search index JSON at build time (title, slug, preview, tags)
- [x] Lazy-load index when user clicks search box (not on every page load)
- [x] `minisearch` (or similar lightweight library) for client-side full-text search
- [x] Dropdown results panel in top bar — click result navigates to note
- [x] Handle keyboard: `/` to focus, `Escape` to close, arrow keys to navigate

### 4 — Tag Infrastructure

- [x] Auto-generate per-tag pages at build time (`/tags/{tag}`)
- [x] Each tag page lists notes with that tag, sorted by date, with preview cards
- [x] Single `/tags` index page listing all tags with note count
- [x] Tag cloud component on home page (below or beside graph)
- [x] Display tags on note pages (badges above or below metadata line)

### 5 — Name Generator Re-integration

- [ ] Create `src/content/notes/name-generator.md` with `layout: tool` frontmatter
- [ ] Build `ToolLayout.astro` — renders note prose followed by `<NameGenerator />`
- [ ] Convert existing `/name-generator.astro` page to the new layout-driven model
- [ ] Re-route `/name-generator` to serve from content collection
- [ ] Add Name Generator as a synthetic node in the graph dataset
- [ ] Notes can link to it via `[[Name Generator]]`

### 6 — Polish

- [ ] Refine dark palette — reduce neon, dial in muted tones
- [ ] Mobile fine-tuning: top bar, note layout, graph, tag UI
- [ ] Edge cases: note with no backlinks, note with no tags, note with no date
- [ ] Accessibility: keyboard navigation, focus states, screen reader labels
- [ ] 404 page (stylized with garden metaphor: "This note hasn't been planted yet")
- [ ] Performance audit: bundle size (force-graph + minisearch), note page load time

---

## Notes

- No time commitments. Each priority is shippable independently.
- Content collection + wikilink plugin unblocks writing. Everything else is additive.
- The Name Generator is re-integrated last because it involves moving working code. No urgency — it works as-is.
