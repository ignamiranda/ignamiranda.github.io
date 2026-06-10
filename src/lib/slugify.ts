/**
 * Slugify a string the same way Astro slugifies content collection entries:
 * lowercase, spaces to hyphens, strip non-alphanumeric characters.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Slugify a tag name for use in URL paths.
 */
export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}
