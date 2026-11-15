import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "./breadcrumbs";
import { PageHero } from "./page-hero";

type Section = { title: string; body: string };

export async function LegalPage({
  title,
  intro,
  sections,
  href,
  crumb,
}: {
  title: string;
  intro: string;
  sections: Section[];
  href: string;
  crumb: string;
}) {
  const t = await getTranslations("legal");
  return (
    <>
      <PageHero title={title} text={intro}>
        <Breadcrumbs items={[{ label: crumb, href }]} />
      </PageHero>
      <div className="container-x max-w-3xl py-12 lg:py-16">
        <p role="note" className="border-s-4 border-brand bg-surface p-4 text-sm">{t("draftNotice")}</p>
        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-2xl font-black">{s.title}</h2>
              <p className="mt-3 text-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
