import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { catalogQuery, type CatalogParams } from "@/lib/products";
import { cn } from "@/lib/utils";

/** First, last, current and its neighbours; "…" fills the gaps. */
function pageItems(page: number, total: number): (number | "gap-start" | "gap-end")[] {
  const keep = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | "gap-start" | "gap-end")[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) out.push(i < sorted.length / 2 ? "gap-start" : "gap-end");
    out.push(p);
  });
  return out;
}

const edge =
  "inline-flex h-11 items-center gap-2 border px-3 text-sm font-semibold transition-colors sm:px-4";
const edgeActive = "border-border bg-background hover:border-metal hover:bg-surface";
const edgeDisabled = "cursor-not-allowed border-border/60 text-muted opacity-50";

/** Server-rendered links, so every page of the catalog is crawlable. */
export async function Pagination({ params, page, totalPages }: { params: CatalogParams; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const t = await getTranslations("catalog");
  const locale = await getLocale();
  const nf = new Intl.NumberFormat(locale);
  const href = (p: number) => `/products${catalogQuery({ ...params, page: p })}`;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label={t("pagination")}
      className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-border pt-6"
    >
      {/* Start slot */}
      <div className="justify-self-start">
        {hasPrev ? (
          <Link href={href(page - 1)} rel="prev" className={cn(edge, edgeActive , "rounded-xl")}>
            <ChevronRight className="size-4 ltr:rotate-180" aria-hidden="true" />
            <span className="hidden sm:inline">{t("prev")}</span>
            <span className="sr-only sm:hidden">{t("prev")}</span>
          </Link>
        ) : (
          <span aria-disabled="true" className={cn(edge, edgeDisabled, "rounded-xl")}>
            <ChevronRight className="size-4 ltr:rotate-180" aria-hidden="true" />
            <span className="hidden sm:inline">{t("prev")}</span>
          </span>
        )}
      </div>

      {/* Center slot: numbers on sm+, compact "page x of y" on phones */}
      <div>
        <p className="text-sm text-muted sm:hidden rounded-xl" aria-current="page">
          {t("page", { page: nf.format(page), total: nf.format(totalPages) })}
        </p>
        <ul className="hidden items-center gap-1.5 sm:flex">
          {pageItems(page, totalPages).map((item) =>
            typeof item === "number" ? (
              <li key={item}>
                {item === page ? (
                  <span
                    aria-current="page"
                    aria-label={t("page", { page: nf.format(item), total: nf.format(totalPages) })}
                    className="grid size-11 place-items-center border rounded-xl border-brand bg-brand text-sm font-bold text-on-brand"
                  >
                    {nf.format(item)}
                  </span>
                ) : (
                  <Link
                    href={href(item)}
                    aria-label={t("page", { page: nf.format(item), total: nf.format(totalPages) })}
                    className="grid size-11 place-items-center border border-border rounded-xl text-sm font-semibold transition-colors hover:border-metal hover:bg-surface"
                  >
                    {nf.format(item)}
                  </Link>
                )}
              </li>
            ) : (
              <li key={item} aria-hidden="true" className="grid size-11 place-items-center text-muted">
                …
              </li>
            ),
          )}
        </ul>
      </div>

      {/* End slot */}
      <div className="justify-self-end">
        {hasNext ? (
          <Link href={href(page + 1)} rel="next" className={cn(edge, edgeActive, "rounded-xl")}>
            <span className="hidden sm:inline">{t("next")}</span>
            <span className="sr-only sm:hidden">{t("next")}</span>
            <ChevronLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
          </Link>
        ) : (
          <span aria-disabled="true" className={cn(edge, edgeDisabled, "rounded-xl")}>
            <span className="hidden sm:inline">{t("next")}</span>
            <ChevronLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}