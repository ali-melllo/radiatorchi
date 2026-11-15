import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ImageReveal, Parallax, Stagger, StaggerItem } from "@/components/animations/motion";
import { ContactButton } from "@/components/modals/contact-button";
import { Media } from "@/components/shared/media";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Homepage hero. The framed radiator is the likely LCP element, so it is the only `priority` image. */
export async function Hero() {
  const t = await getTranslations("home");
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      {/* <div className="bg-fins fade-mask-b  scale-110 skew-x-12 absolute inset-0 -z-10" aria-hidden="true" /> */}
      <div className="container-x grid items-center gap-12 py-12 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:py-16">
        <Stagger immediate stagger={0.12} className="lg:col-span-6 xl:col-span-5">
          <StaggerItem>
            <h1 className="text-[2.6rem] font-black leading-tight sm:text-6xl ">{t("hero.title")}</h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-xl text-lg text-muted">{t("hero.text")}</p>
          </StaggerItem>
          <StaggerItem className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className={buttonStyles({ size: "lg" })}>
              {t("hero.primary")}
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <ContactButton size="lg" variant="secondary" label={t("hero.secondary")} />
          </StaggerItem>
          {/* <StaggerItem className="mt-12 hidden lg:block">
            <a href="#trust" className="inline-flex items-center gap-3 text-sm text-muted hover:text-foreground">
              <span className="grid size-10 place-items-center border border-border">
                <ChevronDown className="size-4" aria-hidden="true" />
              </span>
              {tc("scrollHint")}
            </a>
          </StaggerItem> */}
        </Stagger>

        <div className="relative lg:col-span-6 xl:col-span-7">
          <Parallax offset={18}>
            <ImageReveal immediate>
              <div className="chamfer relative aspect-6/4 overflow-hidden ">
                <Media
                  src="/images/banners/hero.png"
                  alt={t("hero.imageAlt")}
                  fill
                  priority
                  sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </ImageReveal>
          </Parallax>
          
        </div>
      </div>
    </section>
  );
}
