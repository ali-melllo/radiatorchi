import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types";

export type SlugMap = Record<"products" | "categories", Record<Locale, Record<string, string>>>;

/** For each locale: its slug -> the other locale's slug. Used by the language switcher. */
export function buildSlugMap(): SlugMap {
  const build = (items: { slug: Record<Locale, string> }[]) => {
    const out = {} as Record<Locale, Record<string, string>>;
    for (const from of routing.locales) {
      out[from] = {};
      for (const to of routing.locales) {
        if (to === from) continue;
        for (const item of items) out[from][item.slug[from]] = item.slug[to];
      }
    }
    return out;
  };
  return { products: build(products), categories: build(categories) };
}

/** Translates a locale-less pathname (e.g. /products/slug) between locales. */
export function translatePath(pathname: string, from: Locale, map: SlugMap): string {
  const seg = pathname.split("/").filter(Boolean);
  const section = seg[0];
  if (seg.length === 2 && (section === "products" || section === "categories")) {
    const target = map[section][from][seg[1] ?? ""];
    if (target) return `/${section}/${target}`;
  }
  return pathname;
}

export const productPath = (slug: string) => `/products/${slug}`;
export const categoryPath = (slug: string) => `/categories/${slug}`;
