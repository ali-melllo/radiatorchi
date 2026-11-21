"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export type FaqEntry = { id: string; question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-start md:text-lg font-semibold">
              {item.question}
              <Plus className="size-5 shrink-0 text-brand-ink transition-transform duration-200 group-data-[state=open]:rotate-45" aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="max-w-3xl pb-5 text-muted">{item.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
