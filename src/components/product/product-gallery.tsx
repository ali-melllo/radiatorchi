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
      <div className="rounded-lg flex justify-center items-center overflow-hidden bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
        <Media
          key={main.src}
          src={main.src}
          alt={main.alt}
          height={2000}
          width={2000}
          priority
          className="object-cover size-[25svh] md:size-[50dvh]"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <li key={img.src + i}>
              <button
                type="button"
                aria-label={t("showImage", { n: i + 1 })}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative flex justify-center items-center w-full cursor-pointer rounded-lg transition-all duration-200 overflow-hidden bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                  i === index ? "border-brand!" : "border-border hover:border-metal",
                )}
              >
                <Media src={img.src} alt="" height={500} width={500} className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
