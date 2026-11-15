import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/animations/motion";
import { Media } from "@/components/shared/media";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHero } from "@/components/shared/page-hero";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/page";
import { getCategories, getProductsByCategory } from "@/lib/products";
import { categoryPath } from "@/lib/routes";
import { buildMetadata, samePath } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("categories.title"), description: t("categories.description"), paths: samePath("/categories") });
}

export default async function CategoriesPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("category");
  const tn = await getTranslations("nav");
  return (
    <>
      <PageHero title={t("title")} text={t("intro")}>
        <Breadcrumbs items={[{ label: tn("categories"), href: "/categories" }]} />
      </PageHero>
      <Stagger as="ul" className="container-x grid gap-6 py-12 sm:grid-cols-2 lg:py-16">
        {getCategories().map((c) => (
          <StaggerItem as="li" key={c.id}>
            <Link href={categoryPath(c.slug[locale])} className="group block border border-border bg-surface hover:border-metal">
              <div className="chamfer relative aspect-[16/9] overflow-hidden bg-panel">
                <Media src={c.image} alt={c.imageAlt[locale]} fill sizes="(min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-black">{c.name[locale]}</h2>
                <p className="mt-2 text-muted">{c.description[locale]}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  {t("productCount", { count: getProductsByCategory(c.id).length })}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}
