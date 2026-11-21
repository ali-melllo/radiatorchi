import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/motion";

/** Compact header used by inner pages. Deliberately calmer than the homepage hero. */
export function PageHero({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-surface">
      <div className="bg-fins fade-mask-b bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x py-8 lg:py-10">
        {children}
        <Reveal immediate>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
          {text ? <p className="mt-4 max-w-2xl text-lg text-muted">{text}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
