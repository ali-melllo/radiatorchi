"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Media } from "@/components/shared/media";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const t = useTranslations("product");
  const [index, setIndex] = useState(0);
  const main = images[index] ?? images[0];
  if (!main) return null;

  return (
    <div role="group" aria-label={t("galleryLabel")}>
      <div className="chamfer relative aspect-[4/3] overflow-hidden bg-surface-2">
        <Media
          key={main.src}
          src={main.src}
          alt={main.alt}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                aria-label={t("showImage", { n: i + 1 })}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden border bg-surface-2",
                  i === index ? "border-brand" : "border-border hover:border-metal",
                )}
              >
                <Media src={img.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
