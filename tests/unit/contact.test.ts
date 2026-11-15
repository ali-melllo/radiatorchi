import { describe, expect, it } from "vitest";
import { buildContactHref } from "@/lib/contact-links";
import { getContactMethods } from "@/lib/contact";

describe("contact links", () => {
  it("builds tel, mailto and wa.me links", () => {
    expect(buildContactHref({ id: "phone", value: "+982100000000", display: "" })).toBe("tel:+982100000000");
    expect(buildContactHref({ id: "email", value: "a@b.co", display: "" }, { emailSubject: "x y" })).toBe("mailto:a@b.co?subject=x%20y");
    expect(buildContactHref({ id: "whatsapp", value: "+989120000000", display: "" }, { message: "hi" })).toBe("https://wa.me/989120000000?text=hi");
  });
  it("validates configured contact data", () => {
    expect(getContactMethods().map((m) => m.id)).toEqual(["phone", "whatsapp", "email"]);
  });
});
