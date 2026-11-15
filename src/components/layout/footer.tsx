import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { exploreLinks, legalLinks } from "@/config/navigation";
import { Logo } from "@/components/shared/logo";
import { buildContactHref } from "@/lib/contact-links";
import { contact, getContactMethods, getSocialLinks } from "@/lib/contact";
import { getCategories } from "@/lib/products";
import type { Locale } from "@/types";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const methods = getContactMethods();
  const social = getSocialLinks();
  const linkClass = "text-muted hover:text-foreground hover:underline";
  const heading = "mb-4 text-sm font-bold";

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo locale={locale} />
          <p className="mt-4 max-w-sm text-sm text-muted">{t("description")}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:col-span-2 lg:col-span-8 lg:grid-cols-4">
          <nav aria-label={t("explore")}>
            <h2 className={heading}>{t("explore")}</h2>
            <ul className="space-y-2 text-sm">
              {exploreLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className={linkClass}>{tn(l.key)}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("categories")}>
            <h2 className={heading}>{t("categories")}</h2>
            <ul className="space-y-2 text-sm">
              {getCategories().map((c) => (
                <li key={c.id}><Link href={`/categories/${c.slug[locale]}`} className={linkClass}>{c.name[locale]}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("legal")}>
            <h2 className={heading}>{t("legal")}</h2>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className={linkClass}>{tn(l.key)}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={heading}>{t("contact")}</h2>
            <ul className="space-y-2 text-sm">
              {methods.map((m) => (
                <li key={m.id}>
                  <a
                    href={buildContactHref(m)}
                    dir="ltr"
                    className={`${linkClass} inline-block text-start`}
                    {...(m.id === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {m.display}
                  </a>
                </li>
              ))}
              {contact.address[locale] ? <li className="text-muted">{contact.address[locale]}</li> : null}
            </ul>
            {social.length > 0 && (
              <ul aria-label={t("social")} className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {social.map((s) => (
                  <li key={s.id}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{s.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="container-x py-5 text-sm text-muted">{t("rights", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
