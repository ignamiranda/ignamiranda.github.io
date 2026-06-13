import { getCollection } from "astro:content";
import { getAllTags } from "../lib/backlinks";
import { tagSlug } from "../lib/slugify";

const SITE = "https://ignamiranda.github.io";

export async function GET() {
  const notes = (await getCollection("notes")).filter((n) => !n.data.draft);
  const tags = getAllTags();

  const urls: string[] = [
    SITE,
    `${SITE}/notes/name-generator/`,
    `${SITE}/notes/rumors-generator/`,
    `${SITE}/tags/`,
  ];

  for (const note of notes) {
    urls.push(`${SITE}/notes/${note.slug}/`);
  }

  for (const t of tags) {
    urls.push(`${SITE}/tags/${tagSlug(t.tag)}/`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
