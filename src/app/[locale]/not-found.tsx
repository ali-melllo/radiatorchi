import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="relative isolate overflow-hidden">
      <div className="bg-fins fade-mask-b absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center gap-6 py-20">
        <p dir="ltr" className="text-8xl font-black text-brand-ink sm:text-9xl">404</p>
        <h1 className="text-3xl font-black sm:text-4xl">{t("title")}</h1>
        <p className="max-w-md text-muted">{t("text")}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className={buttonStyles({ size: "lg" })}>{t("home")}</Link>
          <Link href="/products" className={buttonStyles({ variant: "secondary", size: "lg" })}>{t("products")}</Link>
        </div>
      </div>
    </section>
  );
}
