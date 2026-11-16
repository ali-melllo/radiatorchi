import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ImageReveal, Reveal } from "@/components/animations/motion";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { faqs } from "@/data/faqs";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types";
import { Media } from "../shared/media";

export async function FaqPreview({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");
  const items = faqs.slice(0, 4).map((f) => ({ id: f.id, question: f.question[locale], answer: f.answer[locale] }));
  return (
    <section className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-20">
      <Reveal className="lg:col-span-4 flex flex-col h-full justify-between">
        <h2 className="text-3xl text-center md:text-right md:ltr:text-left font-black leading-tight sm:text-4xl">{t("faq.title")}</h2>
        <Link href="/faq" className="mt-6 inline-flex items-center gap-2 font-semibold hover:text-brand-ink">
          {t("faq.cta")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>

        <ImageReveal>
          <div className="relative">
            <Media
              src="/images/logo/typography.png"
              alt={t("company.imageAlt")}
              height={1000}
              width={1000}
              className="object-cover h-20"
            />
          </div>
        </ImageReveal>
      </Reveal>
      <Reveal className="lg:col-span-8" delay={0.1}>
        <FaqAccordion items={items} />
      </Reveal>
    </section>
  );
}
