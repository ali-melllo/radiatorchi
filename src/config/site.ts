import type { Locale } from "@/types";

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.radiatorchi.example").replace(/\/$/, ""),
  ogImage: "/images/logo/typography.png",
  ogLocale: { fa: "fa_IR", en: "en_US" } satisfies Record<Locale, string>,
  dir: { fa: "rtl", en: "ltr" } satisfies Record<Locale, "rtl" | "ltr">,
} as const;
