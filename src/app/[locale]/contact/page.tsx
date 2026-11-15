import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactButton } from "@/components/modals/contact-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHero } from "@/components/shared/page-hero";
import { buildContactHref, type ContactMethodId } from "@/lib/contact-links";
import { contact, getContactMethods, getSocialLinks } from "@/lib/contact";
import { resolveLocale } from "@/lib/page";
import { buildMetadata, samePath } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("contact.title"), description: t("contact.description"), paths: samePath("/contact") });
}

const icons: Record<ContactMethodId, typeof Phone> = { phone: Phone, email: Mail, whatsapp: MessageCircle };

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("contact");
  const tn = await getTranslations("nav");
  const labels: Record<ContactMethodId, string> = { phone: t("phone"), email: t("email"), whatsapp: t("whatsapp") };
  const social = getSocialLinks();
  const address = contact.address[locale];
  const hours = contact.hours[locale];

  return (
    <>
      <PageHero title={t("title")} text={t("intro")}>
        <Breadcrumbs items={[{ label: tn("contact"), href: "/contact" }]} />
      </PageHero>
      <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <ul className="divide-y divide-border border-y border-border lg:col-span-7">
          {getContactMethods().map((m) => {
            const Icon = icons[m.id];
            return (
              <li key={m.id}>
                <a
                  href={buildContactHref(m)}
                  {...(m.id === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-5 py-6 hover:bg-surface"
                >
                  <span className="grid size-12 shrink-0 place-items-center bg-brand text-on-brand">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">{labels[m.id]}</span>
                    <span dir="ltr" className="block text-start text-xl font-bold">{m.display}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="space-y-8 lg:col-span-5">
          <section>
            <h2 className="flex items-center gap-2 font-bold"><MapPin className="size-5 text-brand-ink" aria-hidden="true" />{t("address")}</h2>
            <p className={address ? "mt-2" : "mt-2 text-muted"}>{address || t("addressPlaceholder")}</p>
          </section>
          <section>
            <h2 className="flex items-center gap-2 font-bold"><Clock className="size-5 text-brand-ink" aria-hidden="true" />{t("hours")}</h2>
            <p className={hours ? "mt-2" : "mt-2 text-muted"}>{hours || t("hoursPlaceholder")}</p>
          </section>
          {social.length > 0 && (
            <section>
              <h2 className="font-bold">{t("social")}</h2>
              <ul className="mt-2 flex flex-wrap gap-4">
                {social.map((s) => (
                  <li key={s.id}><a href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand-ink hover:underline">{s.label}</a></li>
                ))}
              </ul>
            </section>
          )}
          <div className="border border-border bg-surface p-6">
            <h2 className="text-xl font-black">{t("ctaTitle")}</h2>
            <p className="mt-1 text-muted">{t("ctaText")}</p>
            <ContactButton className="mt-4" />
          </div>
        </div>
      </div>
    </>
  );
}
