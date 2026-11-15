import { getTranslations } from "next-intl/server";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/motion";

type Row = { label: string; value: string };

/** Presented as a technical spec sheet rather than an icon grid. */
export async function Why() {
  const t = await getTranslations("home");
  const rows = t.raw("why.rows") as Row[];
  return (
    <section className="bg-panel py-20 text-panel-foreground lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">{t("why.title")}</h2>
          <p className="mt-4 text-panel-muted">{t("why.text")}</p>
        </Reveal>
        <Stagger as="div" className="lg:col-span-8">
          <dl className="border-t border-panel-border">
            {rows.map((row) => (
              <StaggerItem key={row.label} className="grid gap-1 border-b border-panel-border py-5 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <dt className="font-semibold text-panel-muted">{row.label}</dt>
                <dd className="text-lg font-semibold">{row.value}</dd>
              </StaggerItem>
            ))}
          </dl>
        </Stagger>
      </div>
    </section>
  );
}
