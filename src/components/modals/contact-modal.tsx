"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "motion/react";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildContactHref, type ContactMethod, type ContactMethodId } from "@/lib/contact-links";

type ContactContext = { open: (product?: string) => void };
const Ctx = createContext<ContactContext | null>(null);

export function useContactModal(): ContactContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContactModal must be used inside <ContactModalProvider>");
  return ctx;
}

const icons: Record<ContactMethodId, typeof Phone> = { phone: Phone, email: Mail, whatsapp: MessageCircle };

export function ContactModalProvider({ children, methods }: { children: ReactNode; methods: ContactMethod[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<string | undefined>();
  const open = useCallback((name?: string) => {
    setProduct(name);
    setIsOpen(true);
  }, []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <ContactDialog open={isOpen} onOpenChange={setIsOpen} product={product} methods={methods} />
    </Ctx.Provider>
  );
}

function ContactDialog({
  open,
  onOpenChange,
  product,
  methods,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product?: string;
  methods: ContactMethod[];
}) {
  const t = useTranslations("modal");
  const tc = useTranslations("common");
  const labels: Record<ContactMethodId, { label: string; action: string }> = {
    phone: { label: t("phone.label"), action: t("phone.action") },
    email: { label: t("email.label"), action: t("email.action") },
    whatsapp: { label: t("whatsapp.label"), action: t("whatsapp.action") },
  };
  const opts = {
    emailSubject: product ? t("emailSubject", { product }) : t("emailSubjectGeneric"),
    message: product ? t("whatsappMessage", { product }) : t("whatsappGeneric"),
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-[60] bg-black/65"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-[61] grid place-items-end p-3 sm:place-items-center sm:p-6">
              <Dialog.Content asChild forceMount>
                <m.div
                  className="pointer-events-auto w-full max-w-md border border-border bg-background p-6 shadow-2xl sm:rounded-lg"
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Dialog.Title className="text-xl font-black">{t("title")}</Dialog.Title>
                    <Dialog.Close
                      aria-label={tc("close")}
                      className="-m-2 grid size-10 place-items-center rounded-md hover:bg-surface-2"
                    >
                      <X className="size-5" aria-hidden="true" />
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="mt-2 text-muted">
                    {product ? t("productDescription", { product }) : t("description")}
                  </Dialog.Description>
                  {methods.length === 0 ? (
                    <p className="mt-6 text-sm text-muted">{t("empty")}</p>
                  ) : (
                    <ul className="mt-6 divide-y divide-border border-y border-border">
                      {methods.map((method) => {
                        const Icon = icons[method.id];
                        const { label, action } = labels[method.id];
                        return (
                          <li key={method.id}>
                            <a
                              href={buildContactHref(method, opts)}
                              data-testid={`contact-${method.id}`}
                              {...(method.id === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="group flex items-center gap-4 py-4 transition-colors hover:bg-surface"
                            >
                              <span className="grid size-11 shrink-0 place-items-center bg-brand text-on-brand">
                                <Icon className="size-5" aria-hidden="true" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm text-muted">{label}</span>
                                <span dir="ltr" className="block truncate text-start font-semibold">
                                  {method.display}
                                </span>
                              </span>
                              <span className="text-sm font-semibold text-brand-ink group-hover:underline">{action}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </m.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
