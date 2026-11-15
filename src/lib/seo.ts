import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types";

export const localizedPath = (locale: Locale, path: string) => `/${locale}${path === "/" ? "" : path}`;
export const absoluteUrl = (path: string) => `${siteConfig.url}${path}`;
export const samePath = (path: string): Record<Locale, string> => ({ fa: path, en: path });

type BuildArgs = {
  locale: Locale;
  title: string;
  description: string;
  /** Locale-less path for each locale (slugs can differ between languages). */
  paths: Record<Locale, string>;
  image?: string;
  noindex?: boolean;
  /** Use the title as-is instead of the "%s | Brand" template. */
  absoluteTitle?: boolean;
};

export function buildMetadata({ locale, title, description, paths, image, noindex, absoluteTitle }: BuildArgs): Metadata {
  const canonical = localizedPath(locale, paths[locale]);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedPath(l, paths[l]);
  languages["x-default"] = localizedPath(routing.defaultLocale, paths[routing.defaultLocale]);
  const ogImage = absoluteUrl(image ?? siteConfig.ogImage);
  const other = routing.locales.filter((l) => l !== locale).map((l) => siteConfig.ogLocale[l]);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: brand.name[locale],
      locale: siteConfig.ogLocale[locale],
      alternateLocale: other,
      images: [{ url: ogImage }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}
