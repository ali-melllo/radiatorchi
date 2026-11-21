import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoriesSection } from "@/components/landing/categories-section";
import { Company } from "@/components/landing/company";
import { ContactCta } from "@/components/landing/contact-cta";
import { FaqPreview } from "@/components/landing/faq-preview";
import { Featured } from "@/components/landing/featured";
import { Hero } from "@/components/landing/hero";
import { HowToOrder } from "@/components/landing/how-to-order";
import { Trust } from "@/components/landing/trust";
import { Why } from "@/components/landing/why";
import { resolveLocale } from "@/lib/page";
import { buildMetadata, samePath } from "@/lib/seo";
import { FloatingContactButton } from "@/components/layout/floating-contact-button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    title: t("siteTitle"),
    description: t("siteDescription"),
    paths: samePath("/"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  return (
    <div>
      <Hero />
      <Featured locale={locale} /> 
      <Trust />
      <CategoriesSection locale={locale} />
      <Why />
      <Company />
      <HowToOrder locale={locale} />
      <FaqPreview locale={locale} />
      <ContactCta />
      <FloatingContactButton />
    </div>
  );
}
