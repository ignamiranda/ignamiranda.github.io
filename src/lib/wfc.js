import { SOCKET_TYPES, SOCKET_WEIGHTS, getTilesBySocket } from "../data/battle-map-tiles.js";

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function weightedPick(items, weights, rng) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function validSocketsForNeighbor(neighborSocket) {
  return neighborSocket === "O"
    ? SOCKET_TYPES.slice()
    : ["O", neighborSocket];
}

function intersect(a, b) {
  return a.filter((v) => b.includes(v));
}

/**
 * @param {number} [rows=20]
 * @param {number} [cols=20]
 * @param {number|null} [seed=null]
 * @returns {Array<Array<{tile: import("../data/battle-map-tiles.js").TileDef, socket: string, row: number, col: number}>>}
 */
export function generateMap(rows = 20, cols = 20, seed = null) {
  const rng = seed != null ? seededRandom(seed) : Math.random;

  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      let validSockets;

      if (r === 0 && c === 0) {
        validSockets = SOCKET_TYPES.slice();
      } else {
        const fromLeft = c > 0 ? grid[r][c - 1].socket : null;
        const fromUp = r > 0 ? grid[r - 1][c].socket : null;

        let candidates = SOCKET_TYPES.slice();
        if (fromLeft) {
          candidates = intersect(candidates, validSocketsForNeighbor(fromLeft));
        }
        if (fromUp) {
          candidates = intersect(candidates, validSocketsForNeighbor(fromUp));
        }

        if (candidates.length === 0) {
          candidates = ["O"];
        }

        validSockets = candidates;
      }

      const weights = validSockets.map((s) => SOCKET_WEIGHTS[s] || 0.01);
      const chosenSocket = weightedPick(validSockets, weights, rng);

      const tilePool = getTilesBySocket(chosenSocket);
      const tile = tilePool[Math.floor(rng() * tilePool.length)];

      grid[r][c] = {
        tile,
        socket: chosenSocket,
        row: r,
        col: c,
      };
    }
  }

  return grid;
}

/**
 * @param {Array<Array<{tile: import("../data/battle-map-tiles.js").TileDef}>>} grid
 * @returns {string}
 */
export function gridToEmoji(grid) {
  return grid
    .map((row) => row.map((cell) => cell.tile.emoji).join(""))
    .join("\n");
}
