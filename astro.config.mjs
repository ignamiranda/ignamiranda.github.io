import { defineConfig } from "astro/config";
import { remarkWikilinks } from "./src/lib/remark-wikilinks";

export default defineConfig({
  site: "https://ignamiranda.github.io",
  markdown: {
    remarkPlugins: [remarkWikilinks],
  },
  vite: {
    plugins: [{
      name: "csp-headers",
      transformIndexHtml() {
        return [{
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: [
              "default-src 'self'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "img-src 'self' data:",
              "connect-src 'self'",
            ].join("; "),
          },
          injectTo: "head",
        }];
      },
    }],
  },
});
