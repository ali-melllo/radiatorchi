"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { catalogQuery, SORTS, type CatalogParams, type SortKey } from "@/lib/products";
import { cn } from "@/lib/utils";

type Option = { id: string; name: string };
type Props = { categories: Option[]; makes: Option[]; values: CatalogParams };

export function CatalogControls({ categories, makes, values }: Props) {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(values.q);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const makeId = useId();
  const latest = useRef(values);
  latest.current = values;

  function navigate(next: Partial<CatalogParams>) {
    const merged = { ...latest.current, ...next, page: next.page ?? 1 };
    startTransition(() => router.replace(`${pathname}${catalogQuery(merged)}`, { scroll: false }));
  }

  // Debounced search: URL updates 300ms after typing stops.
  useEffect(() => {
    if (q === latest.current.q) return;
    const id = window.setTimeout(() => navigate({ q }), 300);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hasFilters = Boolean(values.q || values.category || values.make);
  const sortLabels: Record<SortKey, string> = { featured: t("sortFeatured"), name: t("sortName") };

  const fields = (
    <div className="space-y-6 lg:flex lg:flex-wrap lg:items-end lg:gap-8 lg:space-y-0">
      <fieldset>
        <legend className="mb-3 text-sm font-bold">{t("category")}</legend>
        <div className="flex flex-wrap gap-2">
          {[{ id: "", name: t("all") }, ...categories].map((c) => (
            <button
              key={c.id || "all"}
              type="button"
              aria-pressed={values.category === c.id}
              data-testid={`filter-category-${c.id || "all"}`}
              onClick={() => navigate({ category: c.id })}
              className={cn(
                "h-9 border px-3 text-sm transition-colors",
                values.category === c.id
                  ? "border-brand bg-brand text-on-brand"
                  : "border-border hover:border-metal",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>
      {makes.length > 0 && (
        <div>
          <label htmlFor={makeId} className="mb-3 block text-sm font-bold">{t("manufacturer")}</label>
          <select
            id={makeId}
            value={values.make}
            onChange={(e) => navigate({ make: e.target.value })}
            className="h-11 w-full border border-border bg-background px-3 lg:w-56"
          >
            <option value="">{t("all")}</option>
            {makes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      )}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => { setQ(""); navigate({ q: "", category: "", make: "" }); }}>
          {t("clear")}
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="catalog-search" className="sr-only">{t("searchLabel")}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="catalog-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-11 w-full border border-border bg-background ps-10 pe-3 placeholder:text-muted"
            />
          </div>
        </div>
        <div>
          <label htmlFor="catalog-sort" className="sr-only">{t("sort")}</label>
          <select
            id="catalog-sort"
            value={values.sort}
            onChange={(e) => navigate({ sort: e.target.value as SortKey })}
            className="h-11 border border-border bg-background px-3"
          >
            {SORTS.map((s) => <option key={s} value={s}>{sortLabels[s]}</option>)}
          </select>
        </div>
        <div className="lg:hidden">
          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title={t("filtersTitle")}
            closeLabel={tc("close")}
            trigger={
              <Button variant="secondary" size="md">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                {t("filters")}
              </Button>
            }
          >
            {fields}
          </Drawer>
        </div>
      </div>
      <div className="hidden lg:block">{fields}</div>
    </div>
  );
}
