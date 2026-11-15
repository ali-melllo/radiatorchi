import { brand } from "@/config/brand";
import { getSocialLinks } from "@/lib/contact";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import type { FaqItem, Locale, Product } from "@/types";

export function organizationJsonLd(locale: Locale) {
  const sameAs = getSocialLinks().map((s) => s.href);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name[locale],
    alternateName: locale === "fa" ? brand.name.en : brand.name.fa,
    url: absoluteUrl(localizedPath(locale, "/")),
    logo: absoluteUrl(brand.logo.icon.src),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name[locale],
    url: absoluteUrl(localizedPath(locale, "/")),
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

/** No offers, prices, ratings or availability: none exist in the data, so none are emitted. */
export function productJsonLd(locale: Locale, product: Product, categoryName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    description: product.description[locale],
    image: product.images.map((i) => absoluteUrl(i.src)),
    category: categoryName,
    url: absoluteUrl(localizedPath(locale, `/products/${product.slug[locale]}`)),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
  };
}

export function faqJsonLd(locale: Locale, items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question[locale],
      acceptedAnswer: { "@type": "Answer", text: f.answer[locale] },
    })),
  };
}
