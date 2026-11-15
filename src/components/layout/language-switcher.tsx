"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { translatePath, type SlugMap } from "@/lib/routes";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ slugMap, className }: { slugMap: SlugMap; className?: string }) {
  const locale = useLocale();
  const t = useTranslations("lang");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const target: Locale = locale === "fa" ? "en" : "fa";
  const href = translatePath(pathname, locale, slugMap);
  const qs = searchParams.toString();

  return (
    <Link
      href={qs ? `${href}?${qs}` : href}
      locale={target}
      lang={target}
      hrefLang={target}
      aria-label={`${t("switchLabel")}: ${t(target)}`}
      className={cn(
        "inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-semibold hover:bg-surface-2",
        className,
      )}
    >
      {t(target)}
    </Link>
  );
}
