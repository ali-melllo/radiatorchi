"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title: string;
  closeLabel: string;
  children: ReactNode;
};

/** Side drawer that slides from the inline-end edge (right in LTR, left in RTL). */
export function Drawer({ open, onOpenChange, trigger, title, closeLabel, children }: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="drawer fixed inset-y-0 inset-e-0 z-50 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-s border-border bg-background p-3 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
            <Dialog.Close
              aria-label={closeLabel}
              className="grid size-10 place-items-center rounded-md hover:bg-surface-2"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
