import { readdirSync } from "node:fs";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Slugify a wikilink target the same way Astro slugifies content collection
 * entries: lowercase, spaces to hyphens, strip non-alphanumeric characters.
 */
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

export function remarkWikilinks() {
  // Build slug → original filename map at setup time
  const slugMap = new Map<string, string>();

  try {
    const notesDir = process.cwd() + "/src/content/notes";
    const files = readdirSync(notesDir);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const name = file.slice(0, -3);
      const slug = slugify(name);
      slugMap.set(slug, name);
    }
  } catch {
    // Notes directory may not exist yet or be empty — empty map is fine
  }

  return (tree: Root) => {
    visit(tree, "text", (node, index, parent) => {
      if (parent === null || parent === undefined || index === undefined) return;

      const value = node.value;
      const matches = [...value.matchAll(WIKILINK_RE)];
      if (matches.length === 0) return;

      let lastIndex = 0;
      const children: Array<any> = [];

      for (const match of matches) {
        const fullMatch = match[0];
        const target = match[1].trim();
        const alias = match[2]?.trim();
        const matchIndex = match.index!;

        // Text before this wikilink
        if (matchIndex > lastIndex) {
          children.push({ type: "text", value: value.slice(lastIndex, matchIndex) });
        }

        const slug = slugify(target);
        const displayText = alias || target;
        const isKnown = slugMap.has(slug);

        const linkNode: any = {
          type: "link",
          url: "/notes/" + slug,
          children: [{ type: "text", value: displayText }],
        };

        if (!isKnown) {
          linkNode.data = {
            hProperties: {
              className: ["wikilink", "dead-link"],
              "data-slug": slug,
            },
          };
        }

        children.push(linkNode);
        lastIndex = matchIndex + fullMatch.length;
      }

      // Remaining text after the last wikilink
      if (lastIndex < value.length) {
        children.push({ type: "text", value: value.slice(lastIndex) });
      }

      // Replace the original text node with the split children
      parent.children.splice(index, 1, ...children);

      // Tell visit to skip the newly inserted nodes
      return index + children.length;
    });
  };
}
