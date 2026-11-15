"use client";

import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { useContactModal } from "./contact-modal";

/** Opens the global contact modal. Pass a localized product name for product context. */
export function ContactButton({
  product,
  variant = "primary",
  size = "md",
  className,
  label,
  icon = true,
}: {
  product?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  label?: string;
  icon?: boolean;
}) {
  const t = useTranslations("common");
  const { open } = useContactModal();
  return (
    <button type="button" onClick={() => open(product)} className={buttonStyles({ variant, size, className })}>
      {icon && <Phone className="size-4" aria-hidden="true" />}
      {label ?? t("contactToOrder")}
    </button>
  );
}
