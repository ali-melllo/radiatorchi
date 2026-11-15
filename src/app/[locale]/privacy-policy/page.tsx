import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/shared/legal-page";
import { resolveLocale } from "@/lib/page";
import { buildMetadata, samePath } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("privacy.title"), description: t("privacy.description"), paths: samePath("/privacy-policy") });
}

export default async function Page({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("legal");
  const tn = await getTranslations("nav");
  return (
    <LegalPage
      title={t("privacyTitle")}
      intro={t("privacyIntro")}
      sections={t.raw("privacy") as { title: string; body: string }[]}
      href="/privacy-policy"
      crumb={tn("privacy")}
    />
  );
}
