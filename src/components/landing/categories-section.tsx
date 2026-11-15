import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Stagger, StaggerItem, Reveal } from "@/components/animations/motion";
import { Media } from "@/components/shared/media";
import { SectionHeading } from "@/components/shared/section-heading";
import { Link } from "@/i18n/navigation";
import { getCategories, getProductsByCategory } from "@/lib/products";
import { categoryPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

/** Asymmetric bento: the first category is a large feature tile. */
export async function CategoriesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("category");
  const tn = await getTranslations("common");
  const categories = getCategories();
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            title={t("categories.title")}
            text={t("categories.text")}
            action={
              <Link href="/categories" className="inline-flex items-center gap-2 font-semibold hover:text-brand-ink">
                {t("categories.cta")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            }
          />
        </Reveal>
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {categories.map((c, i) => {
            const count = getProductsByCategory(c.id).length;
            return (
              <StaggerItem key={c.id} className={cn(i === 0 && "md:col-span-2 md:row-span-2")}>
                <Link
                  href={categoryPath(c.slug[locale])}
                  aria-label={`${tn("viewCategory")}: ${c.name[locale]}`}
                  className={cn(
                    "group relative isolate flex h-full min-h-60 flex-col justify-end overflow-hidden bg-panel p-6 text-panel-foreground",
                    i === 0 && "min-h-80 md:min-h-[32rem]",
                  )}
                >
                  <Media
                    src={c.image}
                    alt=""
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                    className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
                  <h3 className={cn("font-black", i === 0 ? "text-3xl" : "text-xl")}>{c.name[locale]}</h3>
                  <p className="mt-1 max-w-md text-sm text-panel-muted">{c.description[locale]}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                    {tc("productCount", { count })}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
