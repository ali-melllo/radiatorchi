import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCategories, getProducts } from "@/lib/products";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import type { Locale } from "@/types";

type Entry = { paths: Record<Locale, string>; priority: number };

export default function sitemap(): MetadataRoute.Sitemap {
  const same = (p: string, priority: number): Entry => ({ paths: { fa: p, en: p }, priority });
  const entries: Entry[] = [
    same("/", 1),
    same("/products", 0.9),
    same("/categories", 0.8),
    same("/about", 0.6),
    same("/contact", 0.6),
    same("/faq", 0.6),
    same("/ordering-guide", 0.5),
    same("/privacy-policy", 0.3),
    same("/terms", 0.3),
    ...getCategories().map((c) => ({
      paths: { fa: `/categories/${c.slug.fa}`, en: `/categories/${c.slug.en}` },
      priority: 0.7,
    })),
    // Demo products are noindex, so they stay out of the sitemap until replaced with real data.
    ...getProducts().filter((p) => !p.isSample).map((p) => ({
      paths: { fa: `/products/${p.slug.fa}`, en: `/products/${p.slug.en}` },
      priority: 0.8,
    })),
  ];

  return entries.flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, entry.paths[locale])),
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, absoluteUrl(localizedPath(l, entry.paths[l]))]),
        ),
      },
    })),
  );
}
