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

/** Return a map of all backlinks (slug → Backlink[]). */
export function getAllBacklinks(): Map<string, Backlink[]> {
  return buildBacklinkMap();
}
