import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  localePrefix: "always",
  // "/" must always land on Persian, regardless of Accept-Language.
  localeDetection: false,
});
