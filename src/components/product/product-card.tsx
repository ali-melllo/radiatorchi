import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactButton } from "@/components/modals/contact-button";
import { Media } from "@/components/shared/media";
import { getCategory, getManufacturerName } from "@/lib/products";
import { productPath } from "@/lib/routes";
import type { Locale, Product } from "@/types";

export async function ProductCard({ product, locale, priority }: { product: Product; locale: Locale; priority?: boolean }) {
  const t = await getTranslations("common");
  const category = getCategory(product.categoryId);
  const makes = (product.vehicleManufacturers ?? [])
    .map((id) => getManufacturerName(id, locale))
    .filter(Boolean)
    .join(locale === "fa" ? "، " : ", ");
  const href = productPath(product.slug[locale]);
  const image = product.images[0];

  return (
    <article className="group flex h-full flex-col bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] rounded-xl transition-all">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block">
        <div className="rounded-t-xl relative  overflow-hidden bg-surface-2">
          {image && (
            <Media
              src={image.src}
              alt=""
              height={1000}
              width={1000}
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 90vw"
              className="object-cover min-h-48 transition-transform duration-500 ease-out group-hover:scale-105"
            />
          )}
        </div>
        {product.isSample && (
          <span className="absolute inset-s-3 top-3 bg-background px-2 py-0.5 text-xs font-semibold text-muted">
            {t("sampleBadge")}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-2 md:p-5">
        {category && <p className="text-xs md:text-sm text-brand-ink">{category.name[locale]}</p>}
        <h3 className="mt-1 md:text-lg font-bold leading-snug">
          <Link href={href} className="hover:underline">{product.name[locale]}</Link>
        </h3>
        {makes && <p className="mt-1 text-xs rounded-xl bg-accent w-fit px-3 py-1 text-muted">{makes}</p>}
        <p className="mt-3 line-clamp-2 text-xs md:text-sm text-muted">{product.shortDescription[locale]}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-brand-ink">
            {t("viewProduct")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <ContactButton className="text-nowrap" product={product.name[locale]} size="sm" variant="secondary" icon={false} />
        </div>
      </div>
    </article>
  );
}
