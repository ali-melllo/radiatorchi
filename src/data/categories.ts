import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "radiators",
    slug: { fa: "radiator-khodro", en: "car-radiators" },
    name: { fa: "رادیاتور خودرو", en: "Car radiators" },
    description: {
      fa: "رادیاتورهای خودرو برای انتقال گرمای موتور به هوا. برای انتخاب مدل مناسب با ما تماس بگیرید.",
      en: "Car radiators that move engine heat into the air. Contact us to choose the right model.",
    },
    image: "/images/categories/radiators.svg",
    imageAlt: { fa: "رادیاتور خودرو", en: "Car radiator" },
  },
  {
    id: "cooling-fans",
    slug: { fa: "fan-khonak-konande", en: "cooling-fans" },
    name: { fa: "فن خنک‌کننده", en: "Cooling fans" },
    description: {
      fa: "فن‌های خنک‌کننده رادیاتور و سیستم خنک‌کاری خودرو.",
      en: "Cooling fans for the radiator and the vehicle cooling system.",
    },
    image: "/images/categories/cooling-fans.svg",
    imageAlt: { fa: "فن خنک‌کننده خودرو", en: "Car cooling fan" },
  },
  {
    id: "cooling-components",
    slug: { fa: "qataat-khonak-kari", en: "cooling-components" },
    name: { fa: "قطعات سیستم خنک‌کاری", en: "Cooling system components" },
    description: {
      fa: "شیلنگ، منبع انبساط و دیگر قطعات مسیر آب خنک‌کاری.",
      en: "Hoses, expansion tanks and other coolant-circuit components.",
    },
    image: "/images/categories/cooling-components.svg",
    imageAlt: { fa: "قطعات سیستم خنک‌کاری", en: "Cooling system components" },
  },
  {
    id: "related-parts",
    slug: { fa: "qataat-janebi", en: "related-parts" },
    name: { fa: "قطعات جانبی خودرو", en: "Related automotive parts" },
    description: {
      fa: "قطعات جانبی مرتبط با خنک‌کاری و تعمیر رادیاتور.",
      en: "Related parts for cooling and radiator service.",
    },
    image: "/images/categories/related-parts.svg",
    imageAlt: { fa: "قطعات جانبی خودرو", en: "Related automotive parts" },
  },
];
