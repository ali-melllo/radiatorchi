import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BadgeCheck, Check, Headset, Wrench } from "lucide-react";
import { ImageReveal, Parallax, Reveal, Stagger, StaggerItem } from "@/components/animations/motion";
import { ContactCta } from "@/components/landing/contact-cta";
import { Media } from "@/components/shared/media";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/page";
import { getCategories } from "@/lib/products";
import { categoryPath } from "@/lib/routes";
import { buildMetadata, samePath } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };
type Value = { title: string; text: string };

/** Replace with your final banner. Used for the overview image and the mission backdrop. */
const BANNER = "/images/banners/banner-1.png";

/** Soft layered-shadow card surface (light) with an inset glow + hairline border (dark). */
const card =
  "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("about.title"), description: t("about.description"), paths: samePath("/about") });
}

/** Icons follow the order of `about.values` in the message files (expertise, clarity, direct contact). */
const valueIcons = [Wrench, BadgeCheck, Headset] as const;

function Heading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div>
      <span className="block h-1 w-10 rounded-full bg-brand" aria-hidden="true" />
      <h2 id={id} className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{children}</h2>
    </div>
  );
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("about");
  const th = await getTranslations("home");
  const tn = await getTranslations("nav");
  const values = t.raw("values") as Value[];
  const why = t.raw("whyItems") as string[];
  const categories = getCategories();

  return (
    <>
      <div className="container-x space-y-16 py-12 sm:space-y-20 lg:space-y-28 lg:py-24">
        {/* Overview: lead text + banner in a card frame */}
        <section className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <Heading>{t("overviewTitle")}</Heading>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted sm:text-xl">{t("overviewText")}</p>
          </Reveal>
          <div className="lg:col-span-5">
            <Parallax offset={14}>
              <ImageReveal>
                <div className={cn(card, "rounded-3xl p-2 sm:p-3")}>
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-panel">
                    <Media
                      src={BANNER}
                      alt={th("company.imageAlt")}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </ImageReveal>
            </Parallax>
          </div>
        </section>

        {/* Mission: dark statement panel over the banner */}
        <Reveal>
          <section className="relative isolate overflow-hidden rounded-3xl bg-panel px-6 py-12 text-panel-foreground sm:px-12 sm:py-16 lg:px-12 lg:py-20">
            <Media src={BANNER} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-panel via-panel/85 to-panel/40 rtl:bg-linear-to-l" aria-hidden="true" />
            <span className="block h-1 w-10 rounded-full bg-brand" aria-hidden="true" />
            <h2 className="mt-4 text-base font-bold text-panel-muted">{t("missionTitle")}</h2>
            <p className="mt-4 max-w-4xl text-2xl font-black leading-snug sm:text-4xl lg:text-4xl lg:leading-tight">
              {t("missionText")}
            </p>
          </section>
        </Reveal>

        {/* Values: ruled list in a card, with icon tiles */}
        <section aria-labelledby="values-title" className="grid gap-8 lg:grid-cols-1 lg:gap-14">
          <Reveal className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <Heading id="values-title">{t("valuesTitle")}</Heading>
          </Reveal>
          <Stagger as="ul" className={cn(card, "divide-y divide-border overflow-hidden rounded-3xl lg:col-span-8")}>
            {values.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length]!;
              return (
                <StaggerItem as="li" key={v.title} className="flex items-start gap-4 p-5 sm:gap-6 sm:p-8">
                  <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-on-brand sm:size-14 sm:rounded-2xl">
                    <Icon className="size-6 sm:size-7" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{v.title}</h3>
                    <p className="mt-1 text-muted">{v.text}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        {/* Specialization: real categories as image tiles */}
        <section aria-labelledby="spec-title" className="grid gap-8 lg:grid-cols-1 lg:gap-14">
          <Reveal className="lg:col-span-4">
            <Heading id="spec-title">{t("specTitle")}</Heading>
            <p className="mt-5 text-muted">{t("specText")}</p>
            <Link href="/products" className={buttonStyles({ variant: "secondary", size: "lg", className: "mt-6 rounded-xl" })}>
              {tn("products")}
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Reveal>
          <Stagger as="ul" stagger={0.07} className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:col-span-8">
            {categories.map((c) => (
              <StaggerItem as="li" key={c.id}>
                <Link
                  href={categoryPath(c.slug[locale])}
                  className="group relative isolate flex aspect-4/3 items-end overflow-hidden rounded-2xl bg-panel p-4 text-panel-foreground sm:rounded-3xl sm:p-6"
                >
                  <Media
                    src={c.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 28vw, 45vw"
                    className="-z-10 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/10 to-transparent" aria-hidden="true" />
                  <span className="text-base font-black leading-snug sm:text-xl">{c.name[locale]}</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Why: checklist card */}
        <Reveal>
          <section aria-labelledby="why-title" className={cn(card, "grid gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14")}>
            <div className="lg:col-span-4">
              <Heading id="why-title">{t("whyTitle")}</Heading>
            </div>
            <ul className="divide-y divide-border lg:col-span-8">
              {why.map((w) => (
                <li key={w} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 sm:py-5">
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-on-brand">
                    <Check className="size-5" />
                  </span>
                  <span className="md:text-lg font-semibold sm:text-xl">{w}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>

      <ContactCta title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}