import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/animations/motion";
import { ContactButton } from "@/components/modals/contact-button";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Closing band. Reused by inner pages through the `title`/`text` overrides. */
export async function ContactCta({ title, text }: { title?: string; text?: string }) {
  const t = await getTranslations("home");
  return (
    <section className="relative isolate overflow-hidden bg-brand text-on-brand">
      <div className="bg-fins absolute inset-0 -z-10" aria-hidden="true" />
      <Reveal className="container-x flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black leading-tight sm:text-5xl">{title ?? t("cta.title")}</h2>
          <p className="mt-3 text-lg opacity-90">{text ?? t("cta.text")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ContactButton size="lg" label={t("cta.primary")} className="bg-background text-foreground hover:bg-surface-2" />
          <Link href="/products" className={buttonStyles({ variant: "ghost", size: "lg", className: "border border-white/70 text-on-brand hover:bg-white/10" })}>
            {t("cta.secondary")}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
