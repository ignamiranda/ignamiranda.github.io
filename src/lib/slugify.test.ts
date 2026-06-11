import { describe, it, expect } from "vitest";
import { slugify, tagSlug } from "./slugify";

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("a b c")).toBe("a-b-c");
  });

  it("strips special characters", () => {
    expect(slugify("hello! world?")).toBe("hello-world");
  });

  it("collapses multiple spaces", () => {
    expect(slugify("a    b")).toBe("a-b");
  });

  it("removes leading hyphens", () => {
    expect(slugify("---hello")).toBe("hello");
  });

  it("removes trailing hyphens", () => {
    expect(slugify("hello---")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("trims whitespace", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("handles mixed case with numbers", () => {
    expect(slugify("Hello 123 World")).toBe("hello-123-world");
  });
});

describe("tagSlug", () => {
  it("delegates to slugify", () => {
    expect(tagSlug("My Tag")).toBe("my-tag");
  });

  it("handles special characters", () => {
    expect(tagSlug("C#")).toBe("c");
  });

  it("handles empty string", () => {
    expect(tagSlug("")).toBe("");
  });
});
