/**
 * Strip Markdown formatting from a string, returning plain text.
 */
export function stripMarkdown(body: string): string {
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

/**
 * Extract a preview string from markdown body, truncated with ellipsis.
 * @param body - markdown body
 * @param maxLength - maximum character length (default 200)
 */
export function previewText(body: string, maxLength = 200): string {
  const stripped = stripMarkdown(body);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).replace(/\s+\S*$/, "") + "\u2026";
}
