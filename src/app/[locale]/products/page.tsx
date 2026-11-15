import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CatalogControls } from "@/components/product/catalog-controls";
import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHero } from "@/components/shared/page-hero";
import { ContactButton } from "@/components/modals/contact-button";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { resolveLocale } from "@/lib/page";
import {
  filterProducts,
  getAvailableManufacturers,
  getCategories,
  getProducts,
  paginate,
  parseCatalogParams,
} from "@/lib/products";
import { buildMetadata, samePath } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("products.title"), description: t("products.description"), paths: samePath("/products") });
}

/** Dynamic because filters live in the URL; the products themselves are local static data. */
export default async function ProductsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("catalog");
  const tn = await getTranslations("nav");
  const parsed = parseCatalogParams(await searchParams);
  const filtered = filterProducts(getProducts(), parsed, locale);
  const { items, page, totalPages } = paginate(filtered, parsed.page);

  return (
    <>
      <PageHero title={t("title")} text={t("subtitle")}>
        <Breadcrumbs items={[{ label: tn("products"), href: "/products" }]} />
      </PageHero>
      <div className="container-x py-10 lg:py-14">
        <CatalogControls
          categories={getCategories().map((c) => ({ id: c.id, name: c.name[locale] }))}
          makes={getAvailableManufacturers().map((m) => ({ id: m.id, name: m.name[locale] }))}
          values={parsed}
        />
        <p className="mt-8 text-sm text-muted" role="status" aria-live="polite" data-testid="result-count">
          {t("results", { count: filtered.length })}
        </p>
        {items.length > 0 ? (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" data-testid="product-grid">
            {items.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} locale={locale} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 border border-dashed border-border p-10 text-center">
            <h2 className="text-xl font-bold">{t("emptyTitle")}</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">{t("emptyText")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/products" className={buttonStyles({ variant: "secondary" })}>{t("clear")}</Link>
              <ContactButton />
            </div>
          </div>
        )}
        <Pagination params={parsed} page={page} totalPages={totalPages} />
      </div>
    </>
  );
}
