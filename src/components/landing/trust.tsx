import { getTranslations } from "next-intl/server";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/motion";

type Item = { title: string; text: string };

export async function Trust() {
  const t = await getTranslations("home");
  const items = t.raw("trust.items") as Item[];
  return (
    <section id="trust" className="container-x grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
      <Reveal className="lg:col-span-5">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl">{t("trust.title")}</h2>
        <p className="mt-4 max-w-md text-muted">{t("trust.text")}</p>
      </Reveal>
      <Stagger as="ul" className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
        {items.map((item) => (
          <StaggerItem as="li" key={item.title} className="border-s-2 border-brand ps-5">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{item.text}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
