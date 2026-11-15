import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";

function shape(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).sort().map(([k, x]) => [k, shape(x)]));
  return typeof v;
}

describe("translations", () => {
  it("fa and en have identical structure", () => expect(shape(en)).toEqual(shape(fa)));
  it("has no empty strings", () => {
    const empty: string[] = [];
    const walk = (v: unknown, path: string) => {
      if (typeof v === "string") { if (!v.trim()) empty.push(path); }
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    };
    walk(fa, "fa"); walk(en, "en");
    expect(empty).toEqual([]);
  });
});
