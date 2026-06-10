import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { slugify } from "./slugify";
import { stripMarkdown, previewText as extractPreview } from "./markdown";

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

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

export interface Backlink {
  slug: string;
  title: string;
}

interface ReadNoteResult {
  slug: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  links: string[];
  tags: string[];
}

let readAllCache: ReadNoteResult[] | null = null;

function readAllNotes(): ReadNoteResult[] {
  if (readAllCache) return readAllCache;

  const notesDir = path.join(process.cwd(), "src", "content", "notes");
  const results: ReadNoteResult[] = [];

  try {
    const files = readdirSync(notesDir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const name = file.slice(0, -3);
      const slug = slugify(name);
      const content = readFileSync(path.join(notesDir, file), "utf-8");
      const { data, body } = parseFrontmatter(content);
      const title =
        (data.title as string | undefined) || extractTitle(body) || slug;

      const links: string[] = [];
      for (const match of body.matchAll(WIKILINK_RE)) {
        const targetSlug = slugify(match[1].trim());
        if (targetSlug !== slug) {
          links.push(targetSlug);
        }
      }

      const tags = (data.tags as string[]) || [];

      results.push({ slug, title, body, data, links, tags });
    }
  } catch (err) {
    console.warn("backlinks: could not read notes directory", err);
  }

  readAllCache = results;
  return results;
}

let cachedBacklinks: Map<string, Backlink[]> | null = null;

function buildBacklinkMap(): Map<string, Backlink[]> {
  if (cachedBacklinks) return cachedBacklinks;

  const notes = readAllNotes();

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
  noteCache = readAllNotes().map((n) => ({ slug: n.slug, title: n.title }));
  return noteCache;
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

let searchCache: SearchEntry[] | null = null;

/** Build search index data: slug, title, preview, tags for every note. */
export function generateSearchIndex(): SearchEntry[] {
  if (searchCache) return searchCache;

  searchCache = readAllNotes().map((n) => ({
    slug: n.slug,
    title: n.title,
    preview: (n.data.description as string | undefined) || extractPreview(n.body),
    tags: n.tags,
  }));
  return searchCache;
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
  for (const note of readAllNotes()) {
    for (const tag of note.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
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

  const notesDir = path.join(process.cwd(), "src", "content", "notes");

  // Find the actual filename from the notes directory
  let fileName: string | undefined;
  try {
    const files = readdirSync(notesDir);
    fileName = files.find(
      (f) => f.endsWith(".md") && slugify(f.slice(0, -3)) === slug,
    );
  } catch (err) {
    console.warn("backlinks: could not read notes directory for getNoteDate", err);
    dateCache.set(slug, null);
    return null;
  }

  if (!fileName) {
    dateCache.set(slug, null);
    return null;
  }

  try {
    const filePath = path.join(notesDir, fileName);
    const result = execSync(
      `git log -1 --format=%ad --date=short -- "${filePath}"`,
      { encoding: "utf-8", cwd: process.cwd() },
    ).trim();

    const date = result || null;
    dateCache.set(slug, date);
    return date;
  } catch (err) {
    console.warn("backlinks: git log failed for getNoteDate", err);
    dateCache.set(slug, null);
    return null;
  }
}
