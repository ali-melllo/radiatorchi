import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ImageReveal, Parallax, Stagger, StaggerItem } from "@/components/animations/motion";
import { ContactButton } from "@/components/modals/contact-button";
import { Media } from "@/components/shared/media";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import SideRays from '../SideRays.jsx';
import { cn } from "cn";

/** Homepage hero. The framed radiator is the likely LCP element, so it is the only `priority` image. */
export async function Hero() {
  const t = await getTranslations("home");
  return (
    <section className="relative w-full min-h-dvh isolate overflow-hidden border-b border-border shadow-2xl -mt-20">

      <div className="h-full" style={{ width: '100%', position: 'absolute' }}>
        <SideRays
          style={{}}
          rayColor1="#FFC46B"
          rayColor2="#96c8ff"
          origin="top-left"
          speed={2.5}
          intensity={2}
          spread={2}
          density={5}
          followMouse
          blend={0.6}
          sharpness={0.5}
          tilt={0}
          falloff={1.6}
          glow={0.5}
          saturation={1}
          dust={0}
          mouseInfluence={0.5}
          intro
          lightMode={false}
          opacity={1}
        />
      </div>

      <div className="container-x z-50! mt-20 grid items-center gap-12 py-12 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:py-16">
        <Stagger immediate stagger={0.12} className="lg:col-span-6 xl:col-span-5">
          <StaggerItem>
            <h1 className="text-3xl md:text-[2.6rem] text-center md:text-right md:ltr:text-left font-black leading-tight sm:text-5xl ">{t("hero.title")}</h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-xl text-sm text-center md:text-right md:ltr:text-left md:text-lg text-muted">{t("hero.text")}</p>
          </StaggerItem>
          <StaggerItem className="mt-10 flex justify-center md:justify-start flex-wrap gap-3">
            <Link href="/products" className={cn("shadow-2xl cursor-pointer", buttonStyles({ size: "lg" }))}>
              {t("hero.primary")}
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <ContactButton className="cursor-pointer shadow-2xl bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]" size="lg" variant="secondary" label={t("hero.secondary")} />
          </StaggerItem>
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
