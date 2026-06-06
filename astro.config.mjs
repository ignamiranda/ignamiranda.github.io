import { defineConfig } from "astro/config";
import { remarkWikilinks } from "./src/lib/remark-wikilinks";

export default defineConfig({
  site: "https://ignamiranda.github.io",
  markdown: {
    remarkPlugins: [remarkWikilinks],
  },
});
