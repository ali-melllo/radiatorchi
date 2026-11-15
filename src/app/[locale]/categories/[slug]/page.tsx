import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactButton } from "@/components/modals/contact-button";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Media } from "@/components/shared/media";
import { PageHero } from "@/components/shared/page-hero";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/page";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/products";
import { categoryPath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCategories().map((c) => ({ locale, slug: c.slug[locale] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const category = getCategoryBySlug(locale, slug);
  if (!category) return {};
  return buildMetadata({
    locale,
    title: category.name[locale],
    description: category.description[locale],
    paths: { fa: categoryPath(category.slug.fa), en: categoryPath(category.slug.en) },
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const category = getCategoryBySlug(locale, slug);
  if (!category) notFound();

  const t = await getTranslations("category");
  const tn = await getTranslations("nav");
  const items = getProductsByCategory(category.id);
  const others = getCategories().filter((c) => c.id !== category.id);

  return (
    <>
      <PageHero title={category.name[locale]} text={category.description[locale]}>
        <Breadcrumbs
          items={[
            { label: tn("categories"), href: "/categories" },
            { label: category.name[locale], href: categoryPath(category.slug[locale]) },
          ]}
        />
        <p className="mt-3 text-sm font-semibold text-brand-ink">{t("productCount", { count: items.length })}</p>
      </PageHero>
      <div className="container-x py-12 lg:py-16">
        <div className="chamfer relative mb-12 aspect-[21/9] overflow-hidden bg-panel">
          <Media src={category.image} alt={category.imageAlt[locale]} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
        </div>
        <h2 className="text-2xl font-black">{t("productsIn")}</h2>
        {items.length > 0 ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} /></li>)}
          </ul>
        ) : (
          <div className="mt-6 border border-dashed border-border p-10">
            <p className="max-w-md text-muted">{t("noProducts")}</p>
            <div className="mt-5"><ContactButton /></div>
          </div>
        )}
        <h2 className="mt-16 text-2xl font-black">{t("others")}</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {others.map((c) => (
            <li key={c.id}>
              <Link href={categoryPath(c.slug[locale])} className="inline-flex h-11 items-center border border-border px-4 font-semibold hover:border-metal">
                {c.name[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
