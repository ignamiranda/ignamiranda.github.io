import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import yaml from "js-yaml";

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function parseFrontmatter(
  content: string,
): { data: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: content };
  }
  const data = (yaml.load(match[1]) as Record<string, unknown>) || {};
  return { data, body: match[2] };
}

function extractTitle(body: string): string | null {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

interface NoteInfo {
  slug: string;
  title: string;
  links: string[];
}

export interface Backlink {
  slug: string;
  title: string;
}

let cachedBacklinks: Map<string, Backlink[]> | null = null;

function buildBacklinkMap(): Map<string, Backlink[]> {
  if (cachedBacklinks) return cachedBacklinks;

  const notesDir = process.cwd() + "/src/content/notes";
  const notes: NoteInfo[] = [];

  try {
    const files = readdirSync(notesDir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const name = file.slice(0, -3);
      const slug = slugify(name);
      const content = readFileSync(`${notesDir}/${file}`, "utf-8");
      const { data, body } = parseFrontmatter(content);
      const title =
        (data.title as string | undefined) || extractTitle(body) || slug;

      const links: string[] = [];
      for (const match of body.matchAll(WIKILINK_RE)) {
        const targetSlug = slugify(match[1].trim());
        // Don't count self-links
        if (targetSlug !== slug) {
          links.push(targetSlug);
        }
      }

      notes.push({ slug, title, links });
    }
  } catch {
    // Notes directory may not exist or be empty
  }

  // Build incoming links map
  const backlinks = new Map<string, Backlink[]>();
  for (const note of notes) {
    backlinks.set(note.slug, []);
  }

  for (const note of notes) {
    for (const target of note.links) {
      const existing = backlinks.get(target);
      if (existing) {
        existing.push({ slug: note.slug, title: note.title });
      }
    }
  }

  cachedBacklinks = backlinks;
  return backlinks;
}

/** Return all notes that link to the given slug. */
export function getBacklinks(slug: string): Backlink[] {
  return buildBacklinkMap().get(slug) || [];
}

interface NoteEntry {
  slug: string;
  title: string;
}

let noteCache: NoteEntry[] | null = null;

/** Return a list of all notes (slug + title). */
export function getAllNotes(): NoteEntry[] {
  if (noteCache) return noteCache;

  const notesDir = process.cwd() + "/src/content/notes";
  const notes: NoteEntry[] = [];

  try {
    const files = readdirSync(notesDir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const slug = slugify(file.slice(0, -3));
      const content = readFileSync(`${notesDir}/${file}`, "utf-8");
      const { data, body } = parseFrontmatter(content);
      const title = (data.title as string | undefined) || extractTitle(body) || slug;
      notes.push({ slug, title });
    }
  } catch {
    // Directory may not exist
  }

  noteCache = notes;
  return notes;
}

/** Return a map of all backlinks (slug → Backlink[]). */
export function getAllBacklinks(): Map<string, Backlink[]> {
  return buildBacklinkMap();
}

export interface SearchEntry {
  slug: string;
  title: string;
  preview: string;
  tags: string[];
}

function stripMarkdown(body: string): string {
  return body
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/>\s*/g, "")
    .replace(/---+/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPreview(body: string): string {
  const stripped = stripMarkdown(body);
  if (stripped.length <= 200) return stripped;
  return stripped.substring(0, 200).replace(/\s+\S*$/, "") + "\u2026";
}

let searchCache: SearchEntry[] | null = null;

/** Build search index data: slug, title, preview, tags for every note. */
export function generateSearchIndex(): SearchEntry[] {
  if (searchCache) return searchCache;

  const notesDir = process.cwd() + "/src/content/notes";
  const entries: SearchEntry[] = [];

  try {
    const files = readdirSync(notesDir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const slug = slugify(file.slice(0, -3));
      const content = readFileSync(`${notesDir}/${file}`, "utf-8");
      const { data, body } = parseFrontmatter(content);
      const title = (data.title as string | undefined) || extractTitle(body) || slug;
      const tags = (data.tags as string[]) || [];
      const preview =
        (data.description as string | undefined) || extractPreview(body);

      entries.push({ slug, title, preview, tags });
    }
  } catch {
    // Directory may not exist
  }

  searchCache = entries;
  return entries;
}

export interface TagEntry {
  tag: string;
  count: number;
}

let tagCache: TagEntry[] | null = null;

/** Return all tags with note counts, sorted by frequency. */
export function getAllTags(): TagEntry[] {
  if (tagCache) return tagCache;

  const tagCounts = new Map<string, number>();
  const notesDir = process.cwd() + "/src/content/notes";

  try {
    const files = readdirSync(notesDir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const content = readFileSync(`${notesDir}/${file}`, "utf-8");
      const { data } = parseFrontmatter(content);
      const tags = (data.tags as string[]) || [];
      for (const tag of tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
  } catch {
    // Directory may not exist
  }

  const sorted = [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  tagCache = sorted;
  return sorted;
}

const dateCache = new Map<string, string | null>();

/** Get the date for a note: frontmatter date > git commit date > null. */
export function getNoteDate(slug: string, frontmatterDate?: string): string | null {
  if (frontmatterDate) return frontmatterDate;

  const cached = dateCache.get(slug);
  if (cached !== undefined) return cached;

  const notesDir = process.cwd() + "/src/content/notes";
  try {
    const files = readdirSync(notesDir);
    const file = files.find(
      (f) => f.endsWith(".md") && slugify(f.slice(0, -3)) === slug,
    );
    if (!file) {
      dateCache.set(slug, null);
      return null;
    }

    const result = execSync(
      `git log -1 --format=%ad --date=short -- "${notesDir}/${file}"`,
      { encoding: "utf-8", cwd: process.cwd() },
    ).trim();

    const date = result || null;
    dateCache.set(slug, date);
    return date;
  } catch {
    dateCache.set(slug, null);
    return null;
  }
}
