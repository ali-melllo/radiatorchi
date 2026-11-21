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
    <section className=" py-20 lg:py-28">
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
              <StaggerItem key={c.id} className={cn(i === 0 && "md:col-span-2 md:row-span-2" , "shadow-2xl bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] rounded-xl")}>
                <Link
                  href={categoryPath(c.slug[locale])}
                  aria-label={`${tn("viewCategory")}: ${c.name[locale]}`}
                  className={cn(
                    "group relative rounded-2xl flex h-full min-h-60 flex-col justify-around items-end overflow-hidden p-6 text-panel-foreground",
                    i === 0 && "min-h-80 md:min-h-128" , "rounded-2xl",
                  )}
                >
                  <Media
                    src={c.image}
                    alt=""
                    height={2000}
                    width={2000}
                    sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                    className="object-cover m-auto transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="flex mt-auto flex-col gap-2 items-start w-full">
                  <h3 className={cn("font-black text-foreground", i === 0 ? "text-xl md:text-3xl" : "text-xl")}>{c.name[locale]}</h3>
                  <p className="mt-1 max-w-md text-sm font-medium text-panel-muted">{c.description[locale]}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                    {tc("productCount", { count })}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                  </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
