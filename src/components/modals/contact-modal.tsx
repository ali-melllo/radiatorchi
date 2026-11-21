"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type PointerEvent,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, Check, ChevronRight, Copy, Mail, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE } from "@/components/animations/variants";
import { buildContactHref, type ContactMethod, type ContactMethodId } from "@/lib/contact-links";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Context
 * ------------------------------------------------------------------------- */

type ContactContext = { open: (product?: string) => void };
const Ctx = createContext<ContactContext | null>(null);

export function useContactModal(): ContactContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContactModal must be used inside <ContactModalProvider>");
  return ctx;
}

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

/* ----------------------------------------------------------------------------
 * Icons: official WhatsApp glyph (Simple Icons, CC0). Phone/Mail come from Lucide.
 * ------------------------------------------------------------------------- */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const methodMeta: Record<
  ContactMethodId,
  { Icon: ComponentType<{ className?: string }>; tile: string; external: boolean }
> = {
  phone: { Icon: Phone, tile: "bg-brand text-on-brand", external: false },
  // 3rd-party brand color: intentionally not a design token.
  whatsapp: { Icon: WhatsAppIcon, tile: "bg-[#25D366] text-white", external: true },
  email: { Icon: Mail, tile: "bg-foreground text-background", external: false },
};

/* ----------------------------------------------------------------------------
 * Responsive helpers
 * ------------------------------------------------------------------------- */

const DESKTOP_QUERY = "(min-width: 640px)";
function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
}

/* ----------------------------------------------------------------------------
 * Dialog (desktop: centered modal, mobile: bottom drawer with swipe-to-close)
 * ------------------------------------------------------------------------- */

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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-60 bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-61 flex items-end justify-center sm:items-center sm:p-6">
              <ContactPanel product={product} methods={methods} onClose={() => onOpenChange(false)} />
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function ContactPanel({
  product,
  methods,
  onClose,
}: {
  product?: string;
  methods: ContactMethod[];
  onClose: () => void;
}) {
  const t = useTranslations("modal");
  const tc = useTranslations("common");
  const isDesktop = useIsDesktop();

  // Swipe-down to dismiss (mobile drawer). Uses the independent CSS `translate`
  // property so it never fights Motion's `transform` animation.
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    setDragging(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setDragY(Math.max(0, e.clientY - startY.current));
  };
  const onUp = () => {
    setDragging(false);
    if (dragY > 90) onClose();
    else setDragY(0);
  };

  const labels: Record<ContactMethodId, { label: string; action: string }> = {
    phone: { label: t("phone.label"), action: t("phone.action") },
    email: { label: t("email.label"), action: t("email.action") },
    whatsapp: { label: t("whatsapp.label"), action: t("whatsapp.action") },
  };
  const opts = {
    emailSubject: product ? t("emailSubject", { product }) : t("emailSubjectGeneric"),
    message: product ? t("whatsappMessage", { product }) : t("whatsappGeneric"),
  };

  const motionProps = isDesktop
    ? {
        initial: { opacity: 0, y: 16, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.97 },
        transition: { duration: 0.22, ease: EASE },
      }
    : {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { duration: 0.32, ease: EASE },
      };

  return (
    <Dialog.Content asChild forceMount>
      <m.div
        {...motionProps}
        style={{
          translate: dragY ? `0 ${dragY}px` : undefined,
          transition: dragging ? "none" : "translate 0.2s ease-out",
        }}
        className="pointer-events-auto flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        {/* Drag handle (mobile only) */}
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-hidden="true"
          className="flex h-9 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing sm:hidden"
        >
          <span className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        <div className="overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="block h-1 w-10 rounded-full bg-brand" aria-hidden="true" />
              <Dialog.Title className="mt-3 text-2xl font-black leading-tight">{t("title")}</Dialog.Title>
            </div>
            <Dialog.Close
              aria-label={tc("close")}
              className="-me-2 -mt-1 grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
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
            <ul className="mt-6 space-y-3">
              {methods.map((method) => {
                const { Icon, tile, external } = methodMeta[method.id];
                const { label, action } = labels[method.id];
                return (
                  <li key={method.id} className="flex items-stretch gap-2">
                    <a
                      href={buildContactHref(method, opts)}
                      data-testid={`contact-${method.id}`}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex min-w-0 flex-1 items-center gap-4 rounded-2xl border border-border bg-surface p-3.5 transition-colors hover:border-metal hover:bg-surface-2"
                    >
                      <span
                        aria-hidden="true"
                        className={cn("grid size-12 shrink-0 place-items-center rounded-xl", tile)}
                      >
                        <Icon className="size-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-muted">{label}</span>
                        <span dir="ltr" className="block truncate text-base font-bold ltr:text-left rtl:text-right">
                          {method.display}
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-ink">
                        <span className="hidden min-[400px]:inline group-hover:underline">{action}</span>
                        {external ? (
                          <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                        )}
                      </span>
                    </a>
                    <CopyButton value={method.display} label={label} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </m.div>
    </Dialog.Content>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const t = useTranslations("modal");
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    } catch {
      /* Clipboard can be unavailable (insecure context / denied): fail silently. */
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={t("copyItem", { item: label })}
        className={cn(
          "grid w-12 shrink-0 place-items-center rounded-2xl border border-border text-muted transition-colors hover:border-metal hover:bg-surface-2 hover:text-foreground",
          done && "border-brand text-brand-ink",
        )}
      >
        {done ? <Check className="size-5" aria-hidden="true" /> : <Copy className="size-5" aria-hidden="true" />}
      </button>
      <span role="status" className="sr-only">
        {done ? t("copied") : ""}
      </span>
    </>
  );
}