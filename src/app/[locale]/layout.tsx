import type { Metadata, Viewport } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { MotionProvider } from "@/components/animations/motion";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContactModalProvider } from "@/components/modals/contact-modal";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { brand } from "@/config/brand";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getContactMethods } from "@/lib/contact";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { resolveLocale } from "@/lib/page";
import { buildSlugMap } from "@/lib/routes";
import { buildMetadata, samePath } from "@/lib/seo";
import "../globals.css";
import { FloatingContactButton } from "@/components/layout/floating-contact-button";

const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-fa", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-en", display: "swap" });

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: brand.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: brand.themeColor.dark },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: brand.name[locale],
    title: { default: t("siteTitle"), template: `%s | ${brand.name[locale]}` },
    ...buildMetadata({
      locale,
      title: t("siteTitle"),
      description: t("siteDescription"),
      paths: samePath("/"),
      absoluteTitle: true,
    }),
  };
}

/** Only the namespaces that client components read are sent to the browser. */
const CLIENT_NAMESPACES = ["common", "nav", "theme", "lang", "catalog", "faq", "modal", "product", "error"] as const;

export default async function LocaleLayout({ children, params }: Props) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, messages[ns as keyof typeof messages]]),
  );
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      dir={siteConfig.dir[locale]}
      className={`${vazirmatn.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={clientMessages}>
            <MotionProvider>
              <ContactModalProvider methods={getContactMethods()}>
                <a
                  href="#main"
                  className="sr-only z-100 bg-brand px-4 py-2 font-semibold text-on-brand focus:not-sr-only focus:fixed focus:inset-s-3 focus:top-3"
                >
                  {t("skipToContent")}
                </a>
                <Header slugMap={buildSlugMap()} />
                <main id="main">{children}</main>


                <FloatingContactButton />

                <Footer />
              </ContactModalProvider>
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <JsonLd data={organizationJsonLd(locale)} />
        <JsonLd data={websiteJsonLd(locale)} />
      </body>
    </html>
  );
}
