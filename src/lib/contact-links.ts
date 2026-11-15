export type ContactMethodId = "phone" | "email" | "whatsapp";
export type ContactMethod = { id: ContactMethodId; value: string; display: string };

export const digitsOnly = (v: string) => v.replace(/\D/g, "");

/** Pure link builder, safe for client and server. Values are validated in lib/contact.ts. */
export function buildContactHref(
  method: ContactMethod,
  opts: { emailSubject?: string; message?: string } = {},
): string {
  switch (method.id) {
    case "phone":
      return `tel:+${digitsOnly(method.value)}`;
    case "email": {
      const subject = opts.emailSubject ? `?subject=${encodeURIComponent(opts.emailSubject)}` : "";
      return `mailto:${method.value}${subject}`;
    }
    case "whatsapp": {
      const text = opts.message ? `?text=${encodeURIComponent(opts.message)}` : "";
      return `https://wa.me/${digitsOnly(method.value)}${text}`;
    }
  }
}
