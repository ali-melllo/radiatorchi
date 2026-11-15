import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactButton } from "@/components/modals/contact-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FaqExplorer } from "@/components/shared/faq-explorer";
import { PageHero } from "@/components/shared/page-hero";
import { faqs } from "@/data/faqs";
import { faqJsonLd } from "@/lib/jsonld";
import { resolveLocale } from "@/lib/page";
import { buildMetadata, samePath } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("faq.title"), description: t("faq.description"), paths: samePath("/faq") });
}

export default async function FaqPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("faq");
  const tn = await getTranslations("nav");
  const groups = (["choosing", "ordering", "policies"] as const).map((id) => ({ id, label: t(`groups.${id}`) }));
  const items = faqs.map((f) => ({ id: f.id, category: f.category, question: f.question[locale], answer: f.answer[locale] }));
  return (
    <>
      <JsonLd data={faqJsonLd(locale, faqs)} />
      <PageHero title={t("title")} text={t("intro")}>
        <Breadcrumbs items={[{ label: tn("faq"), href: "/faq" }]} />
      </PageHero>
      <div className="container-x py-12 lg:py-16">
        <FaqExplorer groups={groups} items={items} />
        <div className="mt-14 border border-border bg-surface p-8">
          <h2 className="text-2xl font-black">{t("ctaTitle")}</h2>
          <p className="mt-1 text-muted">{t("ctaText")}</p>
          <ContactButton className="mt-5" />
        </div>
      </div>
    </>
  );
}
