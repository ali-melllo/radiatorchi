"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, buttonStyles } from "@/components/ui/button";

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20">
      <h1 className="text-3xl font-black">{t("title")}</h1>
      <p className="max-w-md text-muted">{t("text")}</p>
      <div className="flex gap-3">
        <Button size="lg" onClick={reset}>{t("retry")}</Button>
        <Link href="/" className={buttonStyles({ variant: "secondary", size: "lg" })}>{t("home")}</Link>
      </div>
    </section>
  );
}
