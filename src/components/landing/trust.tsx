import { getTranslations } from "next-intl/server";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/animations/motion";
import { Media } from "../shared/media";

type Item = { title: string; text: string };

export async function Trust() {
  const t = await getTranslations("home");
  const items = t.raw("trust.items") as Item[];
  return (
    <section id="trust" className="container-x grid items-center gap-10 py-20 lg:py-10 lg:grid-cols-12 ">

      <div className="lg:col-span-3 z-0">
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
      </div>

      <Reveal className="lg:col-span-4">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl">{t("trust.title")}</h2>
        <p className="mt-4 max-w-md text-muted">{t("trust.text")}</p>
      </Reveal>
      <Stagger as="ul" className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-5">
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
