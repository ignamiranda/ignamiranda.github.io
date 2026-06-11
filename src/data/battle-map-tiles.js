export const SOCKET_TYPES = ["O", "W", "V", "F", "R", "E"];

export const BIOMES = {
  forest: { label: "Forest", color: "#4a8c5c" },
  dungeon: { label: "Dungeon", color: "#6a5a4a" },
  mountain: { label: "Mountain", color: "#8a8a8a" },
  river: { label: "River", color: "#5a8aaa" },
  cave: { label: "Cave", color: "#4a4a4a" },
  campsite: { label: "Campsite", color: "#8a7a5a" },
};

export const BIOME_ORDER = ["forest", "dungeon", "mountain", "river", "cave", "campsite"];

export const TILES = [
  { id: "floor-grass", name: "Floor (Grass)", socket: "O", biome: "forest", emoji: "\uD83C\uDF3F", weight: 3 },
  { id: "tree-pine", name: "Pine Tree", socket: "V", biome: "forest", emoji: "\uD83C\uDF32", weight: 1 },
  { id: "tree-oak", name: "Oak Tree", socket: "V", biome: "forest", emoji: "\uD83C\uDF33", weight: 1 },
  { id: "bush", name: "Bush", socket: "V", biome: "forest", emoji: "\uD83C\uDF31", weight: 1 },
  { id: "flower", name: "Flower", socket: "F", biome: "forest", emoji: "\uD83C\uDF38", weight: 1 },
  { id: "mushroom", name: "Mushroom", socket: "F", biome: "forest", emoji: "\uD83C\uDF44", weight: 1 },
  { id: "stump", name: "Stump", socket: "W", biome: "forest", emoji: "\uD83E\uDEB5", weight: 1 },
  { id: "log", name: "Log", socket: "W", biome: "forest", emoji: "\uD83C\uDF30", weight: 1 },
  { id: "dense-underbrush", name: "Underbrush", socket: "V", biome: "forest", emoji: "\uD83C\uDF40", weight: 1 },

  { id: "floor-stone", name: "Floor (Stone)", socket: "O", biome: "dungeon", emoji: "\u2B1C", weight: 3 },
  { id: "wall-brick", name: "Brick Wall", socket: "W", biome: "dungeon", emoji: "\uD83E\uDDF1", weight: 1 },
  { id: "wall-torch", name: "Torch", socket: "W", biome: "dungeon", emoji: "\uD83D\uDD25", weight: 1 },
  { id: "pillar", name: "Pillar", socket: "W", biome: "dungeon", emoji: "\uD83D\uDDFF", weight: 1 },
  { id: "chest", name: "Chest", socket: "F", biome: "dungeon", emoji: "\uD83C\uDF81", weight: 1 },
  { id: "trap", name: "Trap", socket: "F", biome: "dungeon", emoji: "\u26A0", weight: 1 },
  { id: "stairs", name: "Stairs", socket: "O", biome: "dungeon", emoji: "\uD83E\uDE9C", weight: 1 },
  { id: "door", name: "Door", socket: "O", biome: "dungeon", emoji: "\uD83D\uDEAA", weight: 1 },
  { id: "bones", name: "Bones", socket: "F", biome: "dungeon", emoji: "\uD83E\uDDB4", weight: 1 },

  { id: "floor-dirt", name: "Floor (Dirt)", socket: "O", biome: "mountain", emoji: "\uD83D\uDFEB", weight: 3 },
  { id: "wall-rock", name: "Rock Wall", socket: "W", biome: "mountain", emoji: "\uD83E\uDEA8", weight: 1 },
  { id: "peak", name: "Peak", socket: "V", biome: "mountain", emoji: "\u26F0", weight: 1 },
  { id: "cliff", name: "Cliff", socket: "E", biome: "mountain", emoji: "\uD83E\uDDD7", weight: 1 },
  { id: "snow", name: "Snow", socket: "O", biome: "mountain", emoji: "\u2744", weight: 1 },
  { id: "cave-entrance", name: "Cave Entrance", socket: "O", biome: "mountain", emoji: "\uD83D\uDD73", weight: 1 },
  { id: "scree", name: "Scree", socket: "W", biome: "mountain", emoji: "\uD83E\uDEA8", weight: 1 },
  { id: "ridge", name: "Ridge", socket: "E", biome: "mountain", emoji: "\uD83C\uDFD4", weight: 1 },

  { id: "water", name: "Water", socket: "R", biome: "river", emoji: "\uD83C\uDF0A", weight: 3 },
  { id: "deep-water", name: "Deep Water", socket: "R", biome: "river", emoji: "\uD83C\uDF0A", weight: 1 },
  { id: "shore", name: "Shore", socket: "O", biome: "river", emoji: "\uD83C\uDFD6", weight: 2 },
  { id: "bridge", name: "Bridge", socket: "O", biome: "river", emoji: "\uD83C\uDF09", weight: 1 },
  { id: "waterfall", name: "Waterfall", socket: "R", biome: "river", emoji: "\uD83D\uDCA7", weight: 1 },
  { id: "lily-pad", name: "Lily Pad", socket: "F", biome: "river", emoji: "\uD83E\uDEB7", weight: 1 },
  { id: "rock-water", name: "Rock (Water)", socket: "R", biome: "river", emoji: "\uD83E\uDEA8", weight: 1 },
  { id: "riverbank", name: "Riverbank", socket: "W", biome: "river", emoji: "\uD83C\uDFD6", weight: 1 },

  { id: "floor-cave", name: "Floor (Cave)", socket: "O", biome: "cave", emoji: "\uD83D\uDFEB", weight: 3 },
  { id: "wall-cave", name: "Cave Wall", socket: "W", biome: "cave", emoji: "\uD83E\uDEA8", weight: 1 },
  { id: "stalactite", name: "Stalactite", socket: "V", biome: "cave", emoji: "\uD83E\uDEA8", weight: 1 },
  { id: "crystal", name: "Crystal", socket: "F", biome: "cave", emoji: "\uD83D\uDC8E", weight: 1 },
  { id: "lava", name: "Lava", socket: "R", biome: "cave", emoji: "\uD83C\uDF0B", weight: 1 },
  { id: "underground-lake", name: "Underground Lake", socket: "R", biome: "cave", emoji: "\uD83C\uDF0A", weight: 1 },
  { id: "chasm", name: "Chasm", socket: "E", biome: "cave", emoji: "\uD83D\uDD73", weight: 1 },
  { id: "fossil", name: "Fossil", socket: "F", biome: "cave", emoji: "\uD83E\uDDB4", weight: 1 },

  { id: "floor-campsite", name: "Floor (Campsite)", socket: "O", biome: "campsite", emoji: "\uD83D\uDFEB", weight: 3 },
  { id: "tent", name: "Tent", socket: "F", biome: "campsite", emoji: "\u26FA", weight: 1 },
  { id: "campfire", name: "Campfire", socket: "F", biome: "campsite", emoji: "\uD83D\uDD25", weight: 1 },
  { id: "fence", name: "Fence", socket: "W", biome: "campsite", emoji: "\u26D4", weight: 1 },
  { id: "barrel", name: "Barrel", socket: "F", biome: "campsite", emoji: "\uD83D\uDCE6", weight: 1 },
  { id: "path", name: "Path", socket: "O", biome: "campsite", emoji: "\uD83D\uDEB6", weight: 1 },
  { id: "signpost", name: "Signpost", socket: "F", biome: "campsite", emoji: "\uD83D\uDCCD", weight: 1 },
];

export function getTilesBySocket(socket) {
  return TILES.filter((t) => t.socket === socket);
}

export function getTilesByBiome(biome) {
  return TILES.filter((t) => t.biome === biome);
}

export function getTile(id) {
  return TILES.find((t) => t.id === id);
}

export const SOCKET_WEIGHTS = {
  O: 0.6,
  W: 0.15,
  V: 0.08,
  F: 0.10,
  R: 0.05,
  E: 0.02,
};

/**
 * @typedef {{ id: string, name: string, socket: string, biome: string, emoji: string, weight: number }} TileDef
 */
