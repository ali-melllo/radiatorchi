"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { normalizeText } from "@/lib/products";
import { cn } from "@/lib/utils";
import { FaqAccordion, type FaqEntry } from "./faq-accordion";

type Group = { id: string; label: string };
type Entry = FaqEntry & { category: string };

export function FaqExplorer({ groups, items }: { groups: Group[]; items: Entry[] }) {
  const t = useTranslations("faq");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("");

  const visible = useMemo(() => {
    const q = normalizeText(query);
    return items.filter(
      (i) => (!active || i.category === active) && (!q || normalizeText(`${i.question} ${i.answer}`).includes(q)),
    );
  }, [items, query, active]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="faq-search" className="sr-only">{t("searchLabel")}</label>
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full border border-border bg-background ps-10 pe-3 placeholder:text-muted"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ id: "", label: t("all") }, ...groups].map((g) => (
            <button
              key={g.id || "all"}
              type="button"
              aria-pressed={active === g.id}
              onClick={() => setActive(g.id)}
              className={cn(
                "h-9 border px-3 text-sm",
                active === g.id ? "border-brand bg-brand text-on-brand" : "border-border hover:border-metal",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8" aria-live="polite">
        {visible.length ? <FaqAccordion items={visible} /> : <p className="text-muted">{t("noResults")}</p>}
      </div>
    </div>
  );
}
