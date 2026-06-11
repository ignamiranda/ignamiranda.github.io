import { describe, it, expect } from "vitest";
import { stripMarkdown, previewText } from "./markdown";

describe("stripMarkdown", () => {
  it("removes headings", () => {
    expect(stripMarkdown("# Hello\n## World")).toBe("Hello World");
  });

  it("removes bold and italic", () => {
    expect(stripMarkdown("**bold** and *italic*")).toBe("bold and italic");
  });

  it("removes inline code", () => {
    expect(stripMarkdown("text with `code`")).toBe("text with code");
  });

  it("extracts link text", () => {
    expect(stripMarkdown("a [link](https://example.com) here")).toBe("a link here");
  });

  it("extracts image alt text", () => {
    expect(stripMarkdown("![alt](image.png)")).toBe("alt");
  });

  it("removes blockquote markers", () => {
    expect(stripMarkdown("> quote\n> more")).toBe("quote more");
  });

  it("collapses newlines to spaces", () => {
    expect(stripMarkdown("line1\n\n\nline2")).toBe("line1 line2");
  });

  it("normalizes multiple spaces", () => {
    expect(stripMarkdown("a    b")).toBe("a b");
  });

  it("handles empty string", () => {
    expect(stripMarkdown("")).toBe("");
  });
});

describe("previewText", () => {
  it("returns text unchanged when within maxLength", () => {
    expect(previewText("short text", 200)).toBe("short text");
  });

  it("truncates with ellipsis when exceeding maxLength", () => {
    const long = "a".repeat(50);
    const result = previewText(long, 20);
    expect(result).toBe("a".repeat(20) + "\u2026");
  });

  it("breaks at word boundary before truncation", () => {
    const text = "hello world this is a long string";
    const result = previewText(text, 15);
    expect(result).toMatch(/\u2026$/);
    expect(result.length).toBeLessThanOrEqual(18);
  });

  it("handles whitespace in input", () => {
    expect(previewText("   hi   ", 200)).toBe("hi");
  });

  it("handles empty string", () => {
    expect(previewText("", 200)).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(previewText("   ", 200)).toBe("");
  });
});
