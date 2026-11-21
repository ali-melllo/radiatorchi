"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Copies a value to the clipboard and announces the result to screen readers. */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const t = useTranslations("modal");
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    } catch {
      /* Clipboard can be unavailable (insecure context / denied): fail silently. */
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={t("copyItem", { item: label })}
        className={cn(
          "grid w-12 shrink-0 place-items-center rounded-2xl border border-border text-muted transition-colors hover:border-metal hover:bg-surface-2 hover:text-foreground",
          done && "border-brand text-brand-ink",
          className,
        )}
      >
        {done ? <Check className="size-5" aria-hidden="true" /> : <Copy className="size-5" aria-hidden="true" />}
      </button>
      <span role="status" className="sr-only">
        {done ? t("copied") : ""}
      </span>
    </>
  );
}