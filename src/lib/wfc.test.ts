import { describe, it, expect } from "vitest";
import { generateMap, gridToEmoji } from "./wfc";

describe("generateMap", () => {
  it("returns a grid of the requested size", () => {
    const grid = generateMap(20, 20, 42);
    expect(grid.length).toBe(20);
    expect(grid[0].length).toBe(20);
  });

  it("returns 10x10 grid for smaller size", () => {
    const grid = generateMap(10, 10, 1);
    expect(grid.length).toBe(10);
    grid.forEach((row) => expect(row.length).toBe(10));
  });

  it("all cells have a tile with id, socket, emoji", () => {
    const grid = generateMap(5, 5, 99);
    for (const row of grid) {
      for (const cell of row) {
        expect(cell.tile).toBeDefined();
        expect(cell.tile.id).toBeTruthy();
        expect(cell.tile.socket).toBeTruthy();
        expect(cell.tile.emoji).toBeTruthy();
        expect(cell.socket).toBeTruthy();
        expect(cell.row).toBeGreaterThanOrEqual(0);
        expect(cell.col).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("is deterministic with same seed", () => {
    const a = generateMap(10, 10, 42);
    const b = generateMap(10, 10, 42);
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        expect(a[r][c].tile.id).toBe(b[r][c].tile.id);
      }
    }
  });

  it("produces different output with different seed", () => {
    const a = generateMap(10, 10, 42);
    const b = generateMap(10, 10, 99);
    const same = a.every((row, r) =>
      row.every((cell, c) => cell.tile.id === b[r][c].tile.id),
    );
    expect(same).toBe(false);
  });

  it("defaults to 20x20 when no args given", () => {
    const grid = generateMap();
    expect(grid.length).toBe(20);
    expect(grid[0].length).toBe(20);
  });

  it("O socket dominates (~40%+ of cells)", () => {
    const grid = generateMap(20, 20, 7);
    let oCount = 0;
    let total = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell.socket === "O") oCount++;
        total++;
      }
    }
    expect(oCount / total).toBeGreaterThan(0.3);
  });
});

describe("gridToEmoji", () => {
  it("returns a string with newlines", () => {
    const grid = generateMap(5, 5, 42);
    const result = gridToEmoji(grid);
    expect(result.split("\n").length).toBe(5);
    expect(result.length).toBeGreaterThan(25);
  });

  it("each row has the correct number of graphemes", () => {
    const grid = generateMap(8, 8, 1);
    const rows = gridToEmoji(grid).split("\n");
    expect(rows.length).toBe(8);
    for (const row of rows) {
      expect([...row].length).toBe(8);
    }
  });
});
