import { ArrowRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ImageReveal, Parallax, Reveal } from "@/components/animations/motion";
import { Media } from "@/components/shared/media";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function Company() {
  const t = await getTranslations("home");
  const values = t.raw("company.values") as string[];
  return (
    <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
      <Parallax>
        <ImageReveal>
          <div className="chamfer relative aspect-[4/3] overflow-hidden bg-panel">
            <Media
              src="/images/company/company.svg"
              alt={t("company.imageAlt")}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </ImageReveal>
      </Parallax>
      <Reveal direction="end">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl">{t("company.title")}</h2>
        <p className="mt-4 max-w-xl text-muted">{t("company.text")}</p>
        <ul className="mt-6 space-y-3">
          {values.map((v) => (
            <li key={v} className="flex items-center gap-3 font-semibold">
              <span className="grid size-6 place-items-center bg-brand text-on-brand">
                <Check className="size-4" aria-hidden="true" />
              </span>
              {v}
            </li>
          ))}
        </ul>
        <Link href="/about" className={buttonStyles({ variant: "secondary", size: "lg", className: "mt-8" })}>
          {t("company.cta")}
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
