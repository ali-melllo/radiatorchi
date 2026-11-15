import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactButton } from "@/components/modals/contact-button";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { productJsonLd } from "@/lib/jsonld";
import { resolveLocale } from "@/lib/page";
import {
  getCategory,
  getManufacturerName,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/products";
import { categoryPath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProducts().map((p) => ({ locale, slug: p.slug[locale] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const product = getProductBySlug(locale, slug);
  if (!product) return {};
  return buildMetadata({
    locale,
    title: product.name[locale],
    description: product.shortDescription[locale],
    paths: { fa: `/products/${product.slug.fa}`, en: `/products/${product.slug.en}` },
    image: product.images[0]?.src.endsWith(".svg") ? undefined : product.images[0]?.src,
    noindex: product.isSample,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const product = getProductBySlug(locale, slug);
  if (!product) notFound();

  const t = await getTranslations("product");
  const tc = await getTranslations("nav");
  const category = getCategory(product.categoryId);
  const makes = (product.vehicleManufacturers ?? []).map((id) => getManufacturerName(id, locale)).filter((n): n is string => Boolean(n));
  const sep = locale === "fa" ? "، " : ", ";

  const specs: { id: string; label: string; value: string }[] = [
    ...(category ? [{ id: "category", label: t("specCategory"), value: category.name[locale] }] : []),
    ...(makes.length ? [{ id: "makes", label: t("specManufacturers"), value: makes.join(sep) }] : []),
    ...(product.brand ? [{ id: "brand", label: t("specBrand"), value: product.brand }] : []),
    ...(product.sku ? [{ id: "sku", label: t("specSku"), value: product.sku }] : []),
    ...(product.specifications ?? []).map((s) => ({ id: s.id, label: s.label[locale], value: s.value[locale] })),
  ];
  const related = getRelatedProducts(product, 4);

  return (
    <>
      {!product.isSample && category && <JsonLd data={productJsonLd(locale, product, category.name[locale])} />}
      <div className="container-x pb-28 pt-8 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: tc("products"), href: "/products" },
            ...(category ? [{ label: category.name[locale], href: categoryPath(category.slug[locale]) }] : []),
            { label: product.name[locale], href: `/products/${product.slug[locale]}` },
          ]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images.map((i) => ({ src: i.src, alt: i.alt[locale] }))} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              {category && (
                <Link href={categoryPath(category.slug[locale])} className="text-sm font-semibold text-brand-ink hover:underline">
                  {category.name[locale]}
                </Link>
              )}
              <h1 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">{product.name[locale]}</h1>
              <p className="mt-4 text-muted">{product.shortDescription[locale]}</p>
              {product.isSample && (
                <p role="note" className="mt-5 border-s-4 border-brand bg-surface p-4 text-sm">{t("sampleNotice")}</p>
              )}
              {specs.length > 0 && (
                <section aria-labelledby="specs-title" className="mt-8">
                  <h2 id="specs-title" className="mb-3 text-lg font-bold">{t("specs")}</h2>
                  <dl className="border-t border-border">
                    {specs.map((s) => (
                      <div key={s.id} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-border py-3 text-sm">
                        <dt className="text-muted">{s.label}</dt>
                        <dd className="font-semibold">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
              <div className="mt-8 hidden lg:block">
                <ContactButton product={product.name[locale]} size="lg" className="w-full" />
                <p className="mt-3 text-sm text-muted">{t("contactNote")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <h2 className="text-2xl font-black">{t("description")}</h2>
            <p className="mt-3 max-w-prose text-muted">{product.description[locale]}</p>
          </section>
          {(product.features?.length || product.compatibleVehicles?.length) ? (
            <div className="space-y-8 lg:col-span-5">
              {product.features?.length ? (
                <section>
                  <h2 className="text-xl font-bold">{t("features")}</h2>
                  <ul className="mt-3 list-disc space-y-1 ps-5 text-muted">
                    {product.features.map((f) => <li key={f.en}>{f[locale]}</li>)}
                  </ul>
                </section>
              ) : null}
              {product.compatibleVehicles?.length ? (
                <section>
                  <h2 className="text-xl font-bold">{t("compatibility")}</h2>
                  <ul className="mt-3 list-disc space-y-1 ps-5 text-muted">
                    {product.compatibleVehicles.map((v) => <li key={v.en}>{v[locale]}</li>)}
                  </ul>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-title">
            <h2 id="related-title" className="text-2xl font-black">{t("related")}</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}><ProductCard product={p} locale={locale} /></li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <ContactButton product={product.name[locale]} size="lg" className="w-full" />
      </div>
    </>
  );
}
