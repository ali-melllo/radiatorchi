import { z } from "zod";
import { contactConfig } from "@/config/contact";
import type { ContactMethod } from "./contact-links";

const international = z.string().regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +982100000000");
const optionalUrl = z.union([z.literal(""), z.string().url().startsWith("https://")]);

/** Validates config/contact.ts once, at build/render time, so broken links cannot ship. */
const schema = z.object({
  phone: z.union([z.literal(""), international]),
  whatsapp: z.union([z.literal(""), international]),
  email: z.union([z.literal(""), z.string().email()]),
  address: z.object({ fa: z.string(), en: z.string() }),
  hours: z.object({ fa: z.string(), en: z.string() }),
  social: z.object({ instagram: optionalUrl, telegram: optionalUrl, linkedin: optionalUrl }),
});

export const contact = schema.parse(contactConfig);

export function getContactMethods(): ContactMethod[] {
  const methods: ContactMethod[] = [];
  if (contact.phone) methods.push({ id: "phone", value: contact.phone, display: contact.phone });
  if (contact.whatsapp) methods.push({ id: "whatsapp", value: contact.whatsapp, display: contact.whatsapp });
  if (contact.email) methods.push({ id: "email", value: contact.email, display: contact.email });
  return methods;
}

export function getSocialLinks(): { id: "instagram" | "telegram" | "linkedin"; label: string; href: string }[] {
  const labels = { instagram: "Instagram", telegram: "Telegram", linkedin: "LinkedIn" } as const;
  return (Object.keys(labels) as (keyof typeof labels)[])
    .filter((id) => contact.social[id])
    .map((id) => ({ id, label: labels[id], href: contact.social[id] }));
}
