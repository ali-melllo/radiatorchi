import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/motion";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Link } from "@/i18n/navigation";
import { getFeaturedProducts } from "@/lib/products";
import type { Locale } from "@/types";

export async function Featured({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");
  return (
    <section className="container-x py-20 lg:py-28">
      <Reveal>
        <SectionHeading
          title={t("featured.title")}
          text={t("featured.text")}
          action={
            <Link href="/products" className="inline-flex items-center gap-2 font-semibold hover:text-brand-ink">
              {t("featured.cta")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          }
        />
      </Reveal>
      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {getFeaturedProducts(4).map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} locale={locale} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
