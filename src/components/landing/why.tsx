import { getTranslations } from "next-intl/server";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/animations/motion";
import { Media } from "../shared/media";

type Row = { label: string; value: string };

/** Presented as a technical spec sheet rather than an icon grid. */
export async function Why() {
  const t = await getTranslations("home");
  const rows = t.raw("why.rows") as Row[];
  return (
    <section className="overflow-x-hidden shadow-lg pt-10 pb-20 text-panel-foreground lg:py-20">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="text-3xl text-center md:text-right md:ltr:text-left text-foreground font-black leading-tight sm:text-4xl">{t("why.title")}</h2>
          <p className="mt-4 text-center md:text-right md:ltr:text-left text-sm md:text-base text-muted-foreground">{t("why.text")}</p>

          <ImageReveal immediate>
            <Media
              src="/images/company/trust.png"
              alt={t("hero.imageAlt")}
              height={1000}
              width={1000}
              priority
              sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 50vw, 100vw"
              className="object-cover size-fit"
            />
          </ImageReveal>
        </Reveal>
        <Stagger as="div" className="lg:col-span-8">
          <dl className="border-t border-panel-border">
            {rows.map((row) => (
              <StaggerItem key={row.label} className="grid gap-1 border-b border-panel-border py-5 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <dt className="font-semibold text-foreground">{row.label}</dt>
                <dd className="font-semibold text-xs md:text-base text-muted-foreground">{row.value}</dd>
              </StaggerItem>
            ))}
          </dl>
        </Stagger>
      </div>
    </section>
  );
}
