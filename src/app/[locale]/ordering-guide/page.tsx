import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GrowLine, Stagger, StaggerItem } from "@/components/animations/motion";
import { ContactCta } from "@/components/landing/contact-cta";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHero } from "@/components/shared/page-hero";
import { resolveLocale } from "@/lib/page";
import { buildMetadata, samePath } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };
type Step = { title: string; text: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("ordering.title"), description: t("ordering.description"), paths: samePath("/ordering-guide") });
}

export default async function OrderingGuidePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("ordering");
  const tn = await getTranslations("nav");
  const steps = t.raw("steps") as Step[];
  return (
    <>
      <PageHero title={t("title")} text={t("intro")}>
        <Breadcrumbs items={[{ label: tn("ordering"), href: "/ordering-guide" }]} />
      </PageHero>
      <div className="container-x max-w-3xl py-14 lg:py-20">
        <div className="relative">
          <GrowLine className="absolute start-6 top-6 h-[calc(100%-3rem)] w-0.5 bg-brand" />
          <Stagger as="ol" stagger={0.12} className="space-y-10">
            {steps.map((s, i) => (
              <StaggerItem as="li" key={s.title} className="relative grid grid-cols-[3rem_1fr] gap-5">
                <span className="relative z-10 grid size-12 place-items-center bg-brand text-lg font-black text-on-brand">
                  {new Intl.NumberFormat(locale).format(i + 1)}
                </span>
                <div className="pt-1">
                  <h2 className="text-xl font-bold">{s.title}</h2>
                  <p className="mt-1 text-muted">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <p role="note" className="mt-12 border-s-4 border-brand bg-surface p-4 font-semibold">{t("notice")}</p>
      </div>
      <ContactCta title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
