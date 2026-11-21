"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { normalizeText } from "@/lib/products";
import { FaqAccordion, type FaqEntry } from "./faq-accordion";

type Group = { id: string; label: string };
type Entry = FaqEntry & { category: string };

export function FaqExplorer({ items }: { groups: Group[]; items: Entry[] }) {
  const t = useTranslations("faq");
  const [query] = useState("");
  const [active] = useState("");

  const visible = useMemo(() => {
    const q = normalizeText(query);
    return items.filter(
      (i) => (!active || i.category === active) && (!q || normalizeText(`${i.question} ${i.answer}`).includes(q)),
    );
  }, [items, query, active]);

  return (
    <div>
      <div aria-live="polite">
        {visible.length ? <FaqAccordion items={visible} /> : <p className="text-muted">{t("noResults")}</p>}
      </div>
    </div>
  );
}
