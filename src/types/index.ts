import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];
export type LocalizedText = Record<Locale, string>;

export type Category = {
  id: string;
  slug: LocalizedText;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
};

export type Manufacturer = { id: string; name: LocalizedText };

export type ProductSpecification = { id: string; label: LocalizedText; value: LocalizedText };

export type ProductImage = { src: string; alt: LocalizedText };

export type Product = {
  id: string;
  slug: LocalizedText;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  images: ProductImage[];
  /** Ids from data/manufacturers.ts */
  vehicleManufacturers?: string[];
  compatibleVehicles?: LocalizedText[];
  specifications?: ProductSpecification[];
  features?: LocalizedText[];
  sku?: string;
  brand?: string;
  featured: boolean;
  relatedProductIds?: string[];
  /** True while the entry is demo data. Shows a visible notice and is never presented as verified. */
  isSample: boolean;
};

export type FaqItem = {
  id: string;
  category: "choosing" | "ordering" | "policies";
  question: LocalizedText;
  answer: LocalizedText;
};
