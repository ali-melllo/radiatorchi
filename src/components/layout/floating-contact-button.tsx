"use client";

import { m } from "motion/react";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE } from "@/components/animations/variants";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useContactModal } from "../modals/contact-modal";

/**
 * Global floating contact button, pinned to the bottom-right corner on every page.
 * Uses the physical `right` edge on purpose (also in RTL), as requested.
 * Icon-only on small screens, icon + label from `sm` up.
 */
export function FloatingContactButton() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { open } = useContactModal();
  // Product pages show a full-width sticky CTA bar below `lg`, so lift the button above it.
  const aboveStickyBar = pathname.startsWith("/products/");

  return (
    <m.button
      type="button"
      data-testid="floating-contact"
      aria-label={t("contactToOrder")}
      onClick={() => open()}
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.35, ease: EASE }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "fixed right-4 cursor-pointer shadow-2xl z-40 inline-flex size-14 items-center justify-center gap-2 rounded-full bg-brand px-4 font-semibold text-on-brand shadow-black/30 transition-colors hover:bg-brand-hover sm:right-6 sm:px-5",
        aboveStickyBar ? "bottom-24 lg:bottom-6" : "bottom-4 sm:bottom-6",
      )}
    >
      <Phone className="size-5" aria-hidden="true" />
    </m.button>
  );
}