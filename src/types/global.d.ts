import type { routing } from "@/i18n/routing";
import type fa from "../../messages/fa.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof fa;
  }
}
