import { getTranslations } from "next-intl/server";
import { GrowLine, ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/animations/motion";
import { Media } from "../shared/media";

type Step = { title: string; text: string };

/** A real sequence, so numbered markers are meaningful here. */
export async function HowToOrder({ locale }: { locale: string }) {
  const t = await getTranslations("home");
  const steps = t.raw("order.steps") as Step[];
  return (
    <section className="bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] shadow py-20 lg:py-10">
      <div className="container-x md:justify-items-end items-center grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 className="text-3xl text-center md:text-right md:ltr:text-left font-black leading-tight sm:text-4xl">{t("order.title")}</h2>
          <p className="mt-4 text-center md:text-right md:ltr:text-left text-sm md:text-base text-muted">{t("order.text")}</p>
          <ImageReveal>
          <div className="chamfer relative aspect-4/3">
            <Media
              src="/images/banners/banner-1.png"
              alt={t("company.imageAlt")}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover size-fit"
            />
          </div>
        </ImageReveal>
        </Reveal>
        <div className="relative lg:col-span-6 ">
          <GrowLine className="absolute inset-s-6 top-6 h-[calc(90%-3rem)] w-0.5 bg-brand" />
          <Stagger as="ol" stagger={0.15} className="space-y-10">
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title} className="relative grid grid-cols-[3rem_1fr] items-start gap-5">
                <span className="relative z-10 grid size-12 rounded-xl place-items-center bg-brand text-lg font-black text-on-brand">
                  {new Intl.NumberFormat(locale).format(i + 1)}
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-1 text-muted text-xs">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
