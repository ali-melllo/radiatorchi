import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";

/** Every crumb needs its path (the last one is rendered as the current page, not a link). */
export type Crumb = { label: string; href: string };

export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = await getTranslations("common");
  const locale = (await getLocale()) as "fa" | "en";
  const all: Crumb[] = [{ label: t("home"), href: "/" }, ...items];
  const ld = breadcrumbJsonLd(
    locale,
    all.map((c) => ({ name: c.label, path: c.href })),
  );
  return (
    <nav aria-label={t("breadcrumb")} className="text-sm text-muted">
      <JsonLd data={ld} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {!last ? (
                <Link href={c.href} className="hover:text-foreground hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-foreground" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
