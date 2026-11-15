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
    <article className="group flex h-full flex-col border border-border bg-surface transition-colors hover:border-metal">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block">
        <div className="chamfer relative aspect-[4/3] overflow-hidden bg-surface-2">
          {image && (
            <Media
              src={image.src}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 90vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          )}
        </div>
        {product.isSample && (
          <span className="absolute start-3 top-3 bg-background px-2 py-0.5 text-xs font-semibold text-muted">
            {t("sampleBadge")}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {category && <p className="text-sm text-brand-ink">{category.name[locale]}</p>}
        <h3 className="mt-1 text-lg font-bold leading-snug">
          <Link href={href} className="hover:underline">{product.name[locale]}</Link>
        </h3>
        {makes && <p className="mt-1 text-sm text-muted">{makes}</p>}
        <p className="mt-3 line-clamp-2 text-sm text-muted">{product.shortDescription[locale]}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-brand-ink">
            {t("viewProduct")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <ContactButton product={product.name[locale]} size="sm" variant="secondary" icon={false} />
        </div>
      </div>
    </article>
  );
}
