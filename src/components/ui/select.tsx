import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Styled native <select>: keeps full browser/mobile accessibility (keyboard, OS picker)
 * while replacing the default arrow with a chevron that follows RTL/LTR via `end-*`.
 * Pass `className` for sizing (e.g. "w-full lg:w-56"); it applies to the wrapper.
 */
export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <select
        {...props}
        className="peer h-11 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background ps-4 pe-10 text-sm font-medium text-foreground transition-colors hover:border-metal focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute inset-e-3.5 top-1/2 size-4 -translate-y-1/2 text-muted transition-transform peer-focus-visible:text-foreground"
        aria-hidden="true"
      />
    </div>
  );
}