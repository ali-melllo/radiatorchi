import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/motion";

/** Compact header used by inner pages. Deliberately calmer than the homepage hero. */
export function PageHero({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-surface">
      <div className="bg-fins fade-mask-b absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x py-12 lg:py-16">
        {children}
        <Reveal immediate>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
          {text ? <p className="mt-4 max-w-2xl text-lg text-muted">{text}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
