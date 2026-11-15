import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { catalogQuery, filterProducts, normalizeText, paginate, parseCatalogParams } from "@/lib/products";
import { buildSlugMap, translatePath } from "@/lib/routes";

describe("product data integrity", () => {
  it("has unique ids and unique slugs per locale", () => {
    for (const key of ["id"] as const) expect(new Set(products.map((p) => p[key])).size).toBe(products.length);
    for (const l of ["fa", "en"] as const) expect(new Set(products.map((p) => p.slug[l])).size).toBe(products.length);
  });
  it("references existing categories", () => {
    const ids = new Set(categories.map((c) => c.id));
    expect(products.every((p) => ids.has(p.categoryId))).toBe(true);
  });
  it("uses url-safe slugs", () => {
    for (const p of products) for (const l of ["fa", "en"] as const) expect(p.slug[l]).toMatch(/^[a-z0-9-]+$/);
  });
});

describe("catalog filtering", () => {
  it("normalizes Arabic letter variants and digits", () => {
    expect(normalizeText("كيا ۱۲")).toBe("کیا 12");
  });
  it("filters by category", () => {
    const out = filterProducts(products, { q: "", category: "cooling-fans", make: "", sort: "featured" }, "en");
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((p) => p.categoryId === "cooling-fans")).toBe(true);
  });
  it("searches across both languages", () => {
    const fa = filterProducts(products, { q: "رادیاتور", category: "", make: "", sort: "featured" }, "fa");
    const en = filterProducts(products, { q: "radiator", category: "", make: "", sort: "featured" }, "en");
    expect(fa.length).toBeGreaterThan(0);
    expect(en.length).toBe(fa.length);
  });
  it("returns nothing for an unknown query", () => {
    expect(filterProducts(products, { q: "zzzz", category: "", make: "", sort: "name" }, "en")).toEqual([]);
  });
  it("rejects invalid URL params", () => {
    expect(parseCatalogParams({ category: "nope", sort: "x", page: "-3" })).toMatchObject({ category: "", sort: "featured", page: 1 });
  });
  it("round-trips query strings and paginates", () => {
    expect(catalogQuery({ q: "a", page: 2 })).toBe("?q=a&page=2");
    expect(paginate([1, 2, 3, 4, 5, 6, 7], 2).items).toEqual([7]);
  });
});

describe("language switching", () => {
  it("maps localized product slugs", () => {
    const map = buildSlugMap();
    expect(translatePath("/products/radiator-nemune-alef", "fa", map)).toBe("/products/radiator-sample-a");
    expect(translatePath("/about", "fa", map)).toBe("/about");
  });
});
