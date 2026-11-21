import type { Metadata } from "next";
import type { ComponentType } from "react";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, ChevronRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/animations/motion";
import { ContactButton } from "@/components/modals/contact-button";
import { WhatsAppIcon } from "@/components/shared/brand-icons";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CopyButton } from "@/components/shared/copy-button";
import { PageHero } from "@/components/shared/page-hero";
import { buildContactHref, type ContactMethodId } from "@/lib/contact-links";
import { contact, getContactMethods, getSocialLinks } from "@/lib/contact";
import { resolveLocale } from "@/lib/page";
import { buildMetadata, samePath } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("contact.title"), description: t("contact.description"), paths: samePath("/contact") });
}

const methodMeta: Record<ContactMethodId, { Icon: ComponentType<{ className?: string }>; tile: string; external: boolean }> = {
  phone: { Icon: Phone, tile: "bg-brand text-on-brand", external: false },
  // 3rd-party brand color: intentionally not a design token.
  whatsapp: { Icon: WhatsAppIcon, tile: "bg-[#25D366] text-white", external: true },
  email: { Icon: Mail, tile: "bg-foreground text-background", external: false },
};

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("contact");
  const tm = await getTranslations("modal");
  const tn = await getTranslations("nav");
  const labels: Record<ContactMethodId, { label: string; action: string }> = {
    phone: { label: t("phone"), action: tm("phone.action") },
    whatsapp: { label: t("whatsapp"), action: tm("whatsapp.action") },
    email: { label: t("email"), action: tm("email.action") },
  };
  const social = getSocialLinks();
  const address = contact.address[locale];
  const hours = contact.hours[locale];

  const infoRows = [
    { id: "address", Icon: MapPin, title: t("address"), value: address, placeholder: t("addressPlaceholder") },
    { id: "hours", Icon: Clock, title: t("hours"), value: hours, placeholder: t("hoursPlaceholder") },
  ];

  return (
    <>
      <PageHero title={t("title")} text={t("intro")}>
        <Breadcrumbs items={[{ label: tn("contact"), href: "/contact" }]} />
      </PageHero>

      <div className="container-x grid gap-10 py-12 grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:py-20 ">
        {/* Direct contact methods */}
        <section aria-labelledby="direct-contact" className="lg:col-span-7">
          <h2 id="direct-contact" className="sr-only">{tm("title")}</h2>
          <Stagger as="ul" className="space-y-4">
            {getContactMethods().map((m) => {
              const { Icon, tile, external } = methodMeta[m.id];
              const { label, action } = labels[m.id];
              return (
                <StaggerItem as="li" key={m.id} className="flex items-stretch gap-3">
                  <a
                    href={buildContactHref(m)}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-w-0 flex-1 items-center gap-4 rounded-3xl border border-border bg-surface p-4 transition-colors hover:border-metal hover:bg-surface-2 sm:gap-5 sm:p-6"
                  >
                    <span aria-hidden="true" className={cn("grid size-12 shrink-0 place-items-center rounded-2xl sm:size-16", tile)}>
                      <Icon className="size-6 sm:size-8" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-muted">{label}</span>
                      <span dir="ltr" className="block truncate text-lg font-black ltr:text-left rtl:text-right sm:text-2xl">
                        {m.display}
                      </span>
                    </span>
                    {/* Desktop: labelled action pill. Mobile: just the arrow. */}
                    <span className="hidden h-11 shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors group-hover:border-brand group-hover:text-brand-ink sm:inline-flex">
                      {action}
                      {external ? (
                        <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                      )}
                    </span>
                    <span className="text-muted sm:hidden" aria-hidden="true">
                      {external ? <ArrowUpRight className="size-5 rtl:-scale-x-100" /> : <ChevronRight className="size-5 rtl:rotate-180" />}
                    </span>
                  </a>
                  <CopyButton value={m.display} label={label} className="w-12 rounded-3xl sm:w-14" />
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        {/* Info + CTA */}
        <aside className="space-y-6 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <div className="divide-y divide-border rounded-3xl border border-border">
            {infoRows.map(({ id, Icon, title, value, placeholder }) => (
              <section key={id} className="flex items-start gap-4 p-5 sm:p-6">
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-brand-ink">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold">{title}</h2>
                  {value ? (
                    <p className="mt-1">{value}</p>
                  ) : (
                    <p className="mt-2 rounded-xl border border-dashed border-border px-3 py-2 text-sm text-muted">{placeholder}</p>
                  )}
                </div>
              </section>
            ))}
            {social.length > 0 && (
              <section className="p-5 sm:p-6">
                <h2 className="font-bold">{t("social")}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {social.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:border-metal hover:bg-surface-2"
                      >
                        {s.label}
                        <ArrowUpRight className="size-4 text-muted rtl:-scale-x-100" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="relative isolate overflow-hidden rounded-3xl bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] p-6 text-panel-foreground sm:p-8">
            {/* <div className="bg-fins absolute inset-0 -z-10 opacity-60" aria-hidden="true" /> */}
            <span className="block h-1 w-10 rounded-full bg-brand" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black leading-tight">{t("ctaTitle")}</h2>
            <p className="mt-2 text-panel-muted">{t("ctaText")}</p>
            <ContactButton size="lg" className="mt-6 w-full rounded-xl" />
          </div>
        </aside>
      </div>
    </>
  );
}