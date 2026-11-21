
import type { Locale } from "@/types";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://radiatorchi.vercel.app"
).replace(/\/+$/, "");

export const siteConfig = {
  url: siteUrl,

  ogImage: "/images/banners/ogImage.jpg",

  ogLocale: {
    fa: "fa_IR",
    en: "en_US",
  } satisfies Record<Locale, string>,

  dir: {
    fa: "rtl",
    en: "ltr",
  } satisfies Record<Locale, "rtl" | "ltr">,
} as const;
