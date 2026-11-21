"use client";

import { Suspense, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { headerLinks } from "@/config/navigation";
import { ContactButton } from "@/components/modals/contact-button";
import { Drawer } from "@/components/ui/drawer";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import type { SlugMap } from "@/lib/routes";
import type { Locale } from "@/types";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ slugMap }: { slugMap: SlugMap }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
        className={cn(
          "sticky top-0 z-50 mx-auto w-full border md:px-10",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1.03)]",
          "will-change-[max-width,padding,top,border-radius,background-color]",
          scrolled
            ? "rounded-b-lg md:top-1 md:rounded-xl px-0! md:container-x shadow-2xl bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
            : "top-0 max-w-full border-transparent"
        )}
      >
      <div className="container-x flex h-18 items-center gap-6">
        <Link href="/" aria-label={t("home")} className="shrink-0 flex items-center">
          <Logo locale={locale} priority />
        </Link>

        <nav aria-label={t("main")} className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {headerLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center px-3 text-[0.95rem] font-medium text-muted transition-colors hover:text-foreground",
                      active && "text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-brand",
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Suspense fallback={<span className="h-9 w-20" />}>
              <LanguageSwitcher slugMap={slugMap} />
            </Suspense>
            <ContactButton label={t("cta")} size="md" />
          </div>

          <Drawer
            open={menuOpen}
            onOpenChange={setMenuOpen}
            title={t("menuTitle")}
            closeLabel={tc("close")}
            trigger={
              <button
                type="button"
                aria-label={t("openMenu")}
                className="grid size-11 place-items-center rounded-md border border-border lg:hidden bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            }
          >
            <nav aria-label={t("main")}>
              <ul className="flex flex-col ">
                {headerLinks.map((link) => (
                  <li key={link.href} className="border-b border-border">
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(pathname, link.href) ? "page" : undefined}
                      className={cn(
                        "flex h-14 items-center font-semibold",
                        isActive(pathname, link.href) && "text-brand-ink",
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <Suspense fallback={null}>
                <LanguageSwitcher slugMap={slugMap} />
              </Suspense>
            </div>
            <div className="mt-6" onClick={() => setMenuOpen(false)}>
              <ContactButton label={t("cta")} size="lg" className="w-full" />
            </div>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
