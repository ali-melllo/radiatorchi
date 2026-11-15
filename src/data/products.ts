import type { LocalizedText, Product } from "@/types";

/**
 * DEMO DATA. Every entry is flagged isSample and shows a visible notice.
 * Replace with verified products (names, images, compatibility, specifications, SKU).
 */
const sampleShort: LocalizedText = {
  fa: "نمونه نمایشی برای نشان دادن چیدمان کاتالوگ.",
  en: "Demo sample that shows how a catalog entry looks.",
};
const sampleLong: LocalizedText = {
  fa: "این محصول فقط یک نمونه نمایشی است تا چیدمان صفحه محصول دیده شود. توضیحات، تصاویر و سازگاری واقعی را در data/products.ts جایگزین کنید.",
  en: "This is a demo entry that shows the product page layout. Replace the description, images and real compatibility in data/products.ts.",
};

type SampleInput = {
  id: string;
  slug: [fa: string, en: string];
  name: [fa: string, en: string];
  categoryId: string;
  makes?: string[];
  featured?: boolean;
  related?: string[];
};

function sample(o: SampleInput): Product {
  return {
    id: o.id,
    slug: { fa: o.slug[0], en: o.slug[1] },
    name: { fa: o.name[0], en: o.name[1] },
    shortDescription: sampleShort,
    description: sampleLong,
    categoryId: o.categoryId,
    images: [1, 2].map((n) => ({
      src: `/images/products/${o.id}-${n}.svg`,
      alt: {
        fa: `${o.name[0]} (${n === 1 ? "نمای روبه‌رو" : "نمای زاویه‌دار"})`,
        en: `${o.name[1]} (${n === 1 ? "front view" : "angled view"})`,
      },
    })),
    vehicleManufacturers: o.makes,
    featured: Boolean(o.featured),
    relatedProductIds: o.related,
    isSample: true,
  };
}

export const products: Product[] = [
  sample({ id: "radiator-sample-a", slug: ["radiator-nemune-alef", "radiator-sample-a"], name: ["رادیاتور نمونه الف", "Radiator sample A"], categoryId: "radiators", makes: ["peugeot"], featured: true }),
  sample({ id: "radiator-sample-b", slug: ["radiator-nemune-be", "radiator-sample-b"], name: ["رادیاتور نمونه ب", "Radiator sample B"], categoryId: "radiators", makes: ["toyota", "hyundai"], featured: true }),
  sample({ id: "radiator-sample-c", slug: ["radiator-nemune-pe", "radiator-sample-c"], name: ["رادیاتور نمونه پ", "Radiator sample C"], categoryId: "radiators", makes: ["kia"] }),
  sample({ id: "fan-sample-a", slug: ["fan-nemune-alef", "fan-sample-a"], name: ["فن خنک‌کننده نمونه الف", "Cooling fan sample A"], categoryId: "cooling-fans", featured: true }),
  sample({ id: "fan-sample-b", slug: ["fan-nemune-be", "fan-sample-b"], name: ["فن خنک‌کننده نمونه ب", "Cooling fan sample B"], categoryId: "cooling-fans", makes: ["peugeot"] }),
  sample({ id: "component-sample-a", slug: ["qate-nemune-alef", "component-sample-a"], name: ["قطعه سیستم خنک‌کاری نمونه الف", "Cooling component sample A"], categoryId: "cooling-components", featured: true }),
  sample({ id: "component-sample-b", slug: ["qate-nemune-be", "component-sample-b"], name: ["قطعه سیستم خنک‌کاری نمونه ب", "Cooling component sample B"], categoryId: "cooling-components" }),
  sample({ id: "related-sample-a", slug: ["janebi-nemune-alef", "related-sample-a"], name: ["قطعه جانبی نمونه الف", "Related part sample A"], categoryId: "related-parts" }),
];
