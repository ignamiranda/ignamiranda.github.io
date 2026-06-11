import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TILES_DIR = join(__dirname, "..", "public", "tiles");
mkdirSync(TILES_DIR, { recursive: true });

const BIOME_COLORS = {
  forest: { bg: "#4a8c5c", fg: "#2d5a3a", accent: "#6abe7a" },
  dungeon: { bg: "#6a5a4a", fg: "#4a3a2a", accent: "#8a7a6a" },
  mountain: { bg: "#8a8a8a", fg: "#6a6a6a", accent: "#aaa" },
  river: { bg: "#5a8aaa", fg: "#3a6a8a", accent: "#7abaca" },
  cave: { bg: "#4a4a4a", fg: "#3a3a3a", accent: "#6a6a6a" },
  campsite: { bg: "#8a7a5a", fg: "#6a5a3a", accent: "#aa9a7a" },
};

function svg(w, h, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${content}</svg>`;
}

function rect(x, y, w, h, fill, rx = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${rx ? ` rx="${rx}"` : ""}/>`;
}

function circle(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

function poly(points, fill) {
  return `<polygon points="${points}" fill="${fill}"/>`;
}

function path(d, fill, stroke) {
  const attr = fill != null ? ` fill="${fill}"` : ' fill="none"';
  const s = stroke != null ? ` stroke="${stroke}"` : "";
  return `<path d="${d}"${attr}${s}/>`;
}

function line(x1, y1, x2, y2, stroke, w = 2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`;
}

const tiles = [
  // Forest
  { id: "floor-grass", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(2,2,28,28,"color-mix(in srgb, "+c.fg+" 30%, transparent)",1)) },
  { id: "tree-pine", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + poly("16,4 8,22 24,22", c.fg) + rect(12,22,8,8,c.fg)) },
  { id: "tree-oak", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(16,13,10,c.fg) + rect(13,22,6,8,c.fg)) },
  { id: "bush", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(12,16,7,c.fg) + circle(20,16,7,c.fg) + circle(16,12,7,c.fg)) },
  { id: "flower", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(16,12,4,c.accent) + circle(16,12,2,"#fff") + line(16,16,16,24,c.fg)) },
  { id: "mushroom", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(14,20,4,8,c.fg) + path("M10,20 Q16,8 22,20 Z", c.accent)) },
  { id: "stump", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(12,16,8,12,c.fg) + circle(16,16,6,c.fg) + circle(16,16,3,c.accent)) },
  { id: "log", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(6,16,20,6,c.fg,3) + circle(8,19,3,c.accent)) },
  { id: "dense-underbrush", biome: "forest", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(8,16,5,c.fg) + circle(16,18,5,c.fg) + circle(24,16,5,c.fg) + circle(16,10,4,c.fg)) },

  // Dungeon
  { id: "floor-stone", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(1,1,14,14,c.fg,1) + rect(17,1,14,14,c.fg,1) + rect(1,17,14,14,c.fg,1) + rect(17,17,14,14,c.fg,1)) },
  { id: "wall-brick", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.fg,2) + rect(0,0,32,14,c.bg,0) + line(0,7,32,7,c.fg) + line(10,0,10,7,c.fg) + line(22,0,22,7,c.fg)) },
  { id: "wall-torch", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.fg,2) + rect(13,8,6,16,c.bg) + path("M14,6 Q16,2 18,6 Z", c.accent) + circle(16,4,3,"#ff6") ) },
  { id: "pillar", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(12,2,8,28,c.fg) + rect(8,2,16,4,c.fg) + rect(8,26,16,4,c.fg)) },
  { id: "chest", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(8,14,16,10,c.fg) + rect(10,12,12,3,c.accent) + circle(16,17,2,"#ffd700")) },
  { id: "trap", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(16,16,10,c.fg) + line(10,10,22,22,c.accent,3) + line(22,10,10,22,c.accent,3)) },
  { id: "stairs", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(4,4,24,3,c.fg) + rect(4,10,24,3,c.fg) + rect(4,16,24,3,c.fg) + rect(4,22,24,3,c.fg)) },
  { id: "door", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(8,4,16,24,c.fg) + circle(20,16,2,c.accent)) },
  { id: "bones", biome: "dungeon", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + line(8,10,16,20,c.fg,3) + line(16,20,24,10,c.fg,3) + circle(10,8,4,c.fg) + circle(22,8,4,c.fg)) },

  // Mountain
  { id: "floor-dirt", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(8,8,2,c.fg) + circle(20,12,2,c.fg) + circle(14,24,2,c.fg)) },
  { id: "wall-rock", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.fg,2) + circle(8,8,6,c.bg) + circle(24,10,5,c.bg) + circle(16,24,7,c.bg)) },
  { id: "peak", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + poly("16,2 4,26 28,26", c.fg) + poly("16,6 8,22 24,22", c.accent)) },
  { id: "cliff", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(14,0,4,32,c.fg) + poly("0,0 14,16 0,32", c.accent)) },
  { id: "snow", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(8,8,5,"#fff") + circle(24,10,5,"#fff") + circle(16,24,5,"#fff") + circle(10,18,3,"#fff")) },
  { id: "cave-entrance", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + path("M8,24 Q16,6 24,24 Z", c.fg) + rect(12,14,8,10,c.accent)) },
  { id: "scree", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(6,10,4,c.fg) + circle(26,8,3,c.fg) + circle(14,20,4,c.fg) + circle(22,24,3,c.fg)) },
  { id: "ridge", biome: "mountain", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + poly("0,32 16,0 32,32", c.fg) + poly("4,32 16,6 28,32", c.accent)) },

  // River
  { id: "water", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + path("M4,10 Q12,6 20,10 T36,10", null, c.accent) + path("M4,18 Q12,14 20,18 T36,18", null, c.accent) + path("M4,26 Q12,22 20,26 T36,26", null, c.accent)) },
  { id: "deep-water", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.fg,2) + path("M4,10 Q12,6 20,10 T36,10", null, c.bg) + path("M4,18 Q12,14 20,18 T36,18", null, c.bg) + path("M4,26 Q12,22 20,26 T36,26", null, c.bg)) },
  { id: "shore", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + path("M0,28 Q16,20 32,28", c.accent) + rect(0,28,32,4,c.accent)) },
  { id: "bridge", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(0,12,32,8,c.fg) + line(4,12,4,20,c.accent,2) + line(28,12,28,20,c.accent,2)) },
  { id: "waterfall", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(12,2,8,24,c.accent) + line(8,24,12,28,c.accent,2) + line(24,24,20,28,c.accent,2)) },
  { id: "lily-pad", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(16,22,8,c.accent) + line(16,22,16,14,c.accent,2) + path("M16,14 Q20,8 16,6", c.accent)) },
  { id: "rock-water", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(16,18,8,c.fg) + circle(16,18,6,c.bg) + path("M4,10 Q12,6 20,10 T36,10", c.accent, 0)) },
  { id: "riverbank", biome: "river", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.fg,2) + rect(0,18,32,14,c.bg,0) + path("M0,18 Q16,14 32,18", c.accent)) },

  // Cave
  { id: "floor-cave", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(8,8,2,c.accent) + circle(24,22,2,c.accent) + circle(14,14,1,c.accent)) },
  { id: "wall-cave", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.fg,2) + circle(6,6,5,c.bg) + circle(26,8,4,c.bg) + circle(16,26,6,c.bg)) },
  { id: "stalactite", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + poly("8,0 12,20 16,0", c.fg) + poly("16,0 20,16 24,0", c.fg) + poly("20,0 23,12 26,0", c.fg)) },
  { id: "crystal", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + poly("16,4 8,16 16,28 24,16", c.accent) + poly("16,8 12,16 16,24 20,16", c.bg)) },
  { id: "lava", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + path("M0,8 Q8,4 16,8 T32,8", null, "#ff4500") + path("M0,16 Q8,12 16,16 T32,16", null, "#ff4500") + path("M0,24 Q8,20 16,24 T32,24", null, "#ff4500")) },
  { id: "underground-lake", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + circle(16,16,10,c.fg) + circle(16,16,8,c.bg) + path("M10,16 Q16,13 22,16", c.accent)) },
  { id: "chasm", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.fg,2) + path("M8,0 Q16,16 8,32", c.bg) + path("M24,0 Q16,16 24,32", c.bg)) },
  { id: "fossil", biome: "cave", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + path("M8,16 Q12,10 16,16 Q20,22 24,16", null, c.accent) + circle(7,16,3,c.fg) + circle(25,16,3,c.fg)) },

  // Campsite
  { id: "floor-campsite", biome: "campsite", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(2,2,6,6,c.fg,1) + rect(22,22,8,8,c.fg,1)) },
  { id: "tent", biome: "campsite", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + poly("16,4 4,26 28,26", c.accent) + line(16,4,16,26,c.fg,1) + rect(12,18,8,8,c.fg)) },
  { id: "campfire", biome: "campsite", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(14,22,4,8,c.fg) + path("M10,18 Q16,6 22,18 Z", "#ff6") + path("M12,20 Q16,12 20,20 Z", "#ff4500")) },
  { id: "fence", biome: "campsite", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(4,8,24,4,c.fg) + rect(4,18,24,4,c.fg) + rect(8,4,4,24,c.fg) + rect(18,4,4,24,c.fg)) },
  { id: "barrel", biome: "campsite", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(10,8,12,18,c.fg,4) + line(10,14,22,14,c.accent,2) + line(10,20,22,20,c.accent,2) + path("M10,8 Q16,6 22,8", null, c.fg)) },
  { id: "path", biome: "campsite", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(0,14,32,4,c.fg) + circle(8,8,3,c.fg) + circle(24,24,3,c.fg)) },
  { id: "signpost", biome: "campsite", render: (c) =>
    svg(32, 32, rect(0,0,32,32,c.bg,2) + rect(14,6,4,24,c.fg) + rect(6,6,20,6,c.accent) + circle(16,4,4,c.fg)) },
];

for (const tile of tiles) {
  const colors = BIOME_COLORS[tile.biome];
  const content = tile.render(colors);
  const filePath = join(TILES_DIR, tile.id + ".svg");
  writeFileSync(filePath, content, "utf-8");
  console.log(`Created ${tile.id}.svg`);
}

console.log(`\nDone! Generated ${tiles.length} tile SVGs in ${TILES_DIR}`);
