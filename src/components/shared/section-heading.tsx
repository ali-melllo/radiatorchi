import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  text,
  action,
  className,
  as: Tag = "h2",
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <Tag className="text-3xl text-center md:text-right md:ltr:text-left font-black leading-tight sm:text-4xl">{title}</Tag>
        {text ? <p className="mt-3 text-center md:text-right md:ltr:text-left text-sm md:text-base text-muted">{text}</p> : null}
      </div>
      {action}
    </div>
  );
}
