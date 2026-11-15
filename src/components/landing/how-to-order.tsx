import { getTranslations } from "next-intl/server";
import { GrowLine, Reveal, Stagger, StaggerItem } from "@/components/animations/motion";

type Step = { title: string; text: string };

/** A real sequence, so numbered markers are meaningful here. */
export async function HowToOrder({ locale }: { locale: string }) {
  const t = await getTranslations("home");
  const steps = t.raw("order.steps") as Step[];
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">{t("order.title")}</h2>
          <p className="mt-4 text-muted">{t("order.text")}</p>
        </Reveal>
        <div className="relative lg:col-span-8">
          <GrowLine className="absolute start-6 top-6 h-[calc(100%-3rem)] w-0.5 bg-brand" />
          <Stagger as="ol" stagger={0.15} className="space-y-10">
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title} className="relative grid grid-cols-[3rem_1fr] items-start gap-5">
                <span className="relative z-10 grid size-12 place-items-center bg-brand text-lg font-black text-on-brand">
                  {new Intl.NumberFormat(locale).format(i + 1)}
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-1 text-muted">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
