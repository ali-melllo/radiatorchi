import { categories } from "@/data/categories";
import { manufacturers } from "@/data/manufacturers";
import { products } from "@/data/products";
import type { Category, Locale, Manufacturer, Product } from "@/types";

export const PAGE_SIZE = 6;
export const SORTS = ["featured", "name"] as const;
export type SortKey = (typeof SORTS)[number];

export function getProducts(): Product[] {
  return products;
}
export function getCategories(): Category[] {
  return categories;
}
export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
export function getCategoryBySlug(locale: Locale, slug: string): Category | undefined {
  return categories.find((c) => c.slug[locale] === slug);
}
export function getProductBySlug(locale: Locale, slug: string): Product | undefined {
  return products.find((p) => p.slug[locale] === slug);
}
export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}
/** Only manufacturers that actually appear in product data. */
export function getAvailableManufacturers(): Manufacturer[] {
  const used = new Set(products.flatMap((p) => p.vehicleManufacturers ?? []));
  return manufacturers.filter((m) => used.has(m.id));
}
export function getManufacturerName(id: string, locale: Locale): string | undefined {
  return manufacturers.find((m) => m.id === id)?.name[locale];
}
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const explicit = (product.relatedProductIds ?? [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const sameCategory = products.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id,
  );
  const merged = [...explicit, ...sameCategory, ...products.filter((p) => p.id !== product.id)];
  const seen = new Set<string>();
  return merged.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true))).slice(0, limit);
}

/** Normalises Arabic/Persian letter variants and digits so searches match either keyboard. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200f\u064b-\u065f]/g, "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .trim();
}

export type CatalogParams = { q: string; category: string; make: string; sort: SortKey; page: number };

type RawParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

/** Parses and validates URL search params so unknown values never reach the filter logic. */
export function parseCatalogParams(raw: RawParams): CatalogParams {
  const category = first(raw.category);
  const make = first(raw.make);
  const sort = first(raw.sort);
  const page = Number.parseInt(first(raw.page), 10);
  return {
    q: first(raw.q).slice(0, 80),
    category: categories.some((c) => c.id === category) ? category : "",
    make: manufacturers.some((m) => m.id === make) ? make : "",
    sort: (SORTS as readonly string[]).includes(sort) ? (sort as SortKey) : "featured",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function catalogQuery(params: Partial<CatalogParams>): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.make) sp.set("make", params.make);
  if (params.sort && params.sort !== "featured") sp.set("sort", params.sort);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

function searchHaystack(p: Product): string {
  const cat = getCategory(p.categoryId);
  const makes = (p.vehicleManufacturers ?? []).flatMap((id) => {
    const m = manufacturers.find((x) => x.id === id);
    return m ? [m.name.fa, m.name.en] : [];
  });
  return normalizeText(
    [
      p.name.fa,
      p.name.en,
      p.shortDescription.fa,
      p.shortDescription.en,
      cat?.name.fa,
      cat?.name.en,
      p.sku,
      p.brand,
      ...makes,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function filterProducts(
  list: Product[],
  params: Pick<CatalogParams, "q" | "category" | "make" | "sort">,
  locale: Locale,
): Product[] {
  const q = normalizeText(params.q);
  const result = list.filter((p) => {
    if (params.category && p.categoryId !== params.category) return false;
    if (params.make && !(p.vehicleManufacturers ?? []).includes(params.make)) return false;
    if (q && !searchHaystack(p).includes(q)) return false;
    return true;
  });
  if (params.sort === "name") {
    return [...result].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
  }
  return [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, totalPages);
  return { items: items.slice((current - 1) * size, current * size), page: current, totalPages };
}
