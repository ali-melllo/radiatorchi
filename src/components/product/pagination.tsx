import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { catalogQuery, type CatalogParams } from "@/lib/products";

/** Server-rendered links, so every page of the catalog is crawlable. */
export async function Pagination({ params, page, totalPages }: { params: CatalogParams; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const t = await getTranslations("catalog");
  const href = (p: number) => `/products${catalogQuery({ ...params, page: p })}`;
  return (
    <nav aria-label={t("pagination")} className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} className={buttonStyles({ variant: "secondary" })}>
          <ChevronRight className="size-4 ltr:rotate-180" aria-hidden="true" />
          {t("prev")}
        </Link>
      ) : <span />}
      <p className="text-sm text-muted" aria-current="page">{t("page", { page, total: totalPages })}</p>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={buttonStyles({ variant: "secondary" })}>
          {t("next")}
          <ChevronLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
        </Link>
      ) : <span />}
    </nav>
  );
}
