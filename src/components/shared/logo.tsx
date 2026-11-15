import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";
import { Media } from "./media";

/** Renders both theme variants and lets CSS pick one, so there is no theme flash. */
export function Logo({ locale, className, priority }: { locale: Locale; className?: string; priority?: boolean }) {
  const alt = brand.name[locale];
  const { light, dark } = brand.logo;
  return (
    <span className={cn("inline-flex", className)}>
      <Media src={light.src} width={light.width} height={light.height} alt={alt} priority={priority} className="h-9 w-auto dark:hidden" />
      <Media src={dark.src} width={dark.width} height={dark.height} alt={alt} priority={priority} className="hidden h-9 w-auto dark:block" />
    </span>
  );
}
