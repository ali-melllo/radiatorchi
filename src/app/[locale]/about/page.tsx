import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/animations/motion";
import { ContactCta } from "@/components/landing/contact-cta";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHero } from "@/components/shared/page-hero";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/page";
import { buildMetadata, samePath } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };
type Value = { title: string; text: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("about.title"), description: t("about.description"), paths: samePath("/about") });
}

export default async function AboutPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("about");
  const tn = await getTranslations("nav");
  const values = t.raw("values") as Value[];
  const why = t.raw("whyItems") as string[];
  return (
    <>
      <PageHero title={t("heroTitle")} text={t("heroText")}>
        <Breadcrumbs items={[{ label: tn("about"), href: "/about" }]} />
      </PageHero>
      <div className="container-x space-y-20 py-16 lg:py-24">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <h2 className="text-3xl font-black lg:col-span-4">{t("overviewTitle")}</h2>
          <p className="max-w-prose text-lg text-muted lg:col-span-8">{t("overviewText")}</p>
        </Reveal>
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <h2 className="text-3xl font-black lg:col-span-4">{t("missionTitle")}</h2>
          <p className="max-w-prose text-lg text-muted lg:col-span-8">{t("missionText")}</p>
        </Reveal>
        <section className="grid gap-8 lg:grid-cols-12">
          <h2 className="text-3xl font-black lg:col-span-4">{t("valuesTitle")}</h2>
          <dl className="border-t border-border lg:col-span-8">
            {values.map((v) => (
              <div key={v.title} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt className="font-bold">{v.title}</dt>
                <dd className="text-muted">{v.text}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="grid gap-8 lg:grid-cols-12">
          <h2 className="text-3xl font-black lg:col-span-4">{t("specTitle")}</h2>
          <div className="lg:col-span-8">
            <p className="max-w-prose text-lg text-muted">{t("specText")}</p>
            <Link href="/products" className={buttonStyles({ variant: "secondary", className: "mt-5" })}>{tn("products")}</Link>
          </div>
        </section>
        <section className="grid gap-8 lg:grid-cols-12">
          <h2 className="text-3xl font-black lg:col-span-4">{t("whyTitle")}</h2>
          <ul className="space-y-3 text-lg lg:col-span-8">
            {why.map((w) => <li key={w} className="border-s-2 border-brand ps-4 font-semibold">{w}</li>)}
          </ul>
        </section>
      </div>
      <ContactCta title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
